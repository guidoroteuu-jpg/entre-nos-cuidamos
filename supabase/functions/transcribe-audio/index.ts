import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Transcreve áudio curto do diário usando Gemini (multimodal) via Lovable AI Gateway.
// A entrada é { audio: <base64 sem prefixo>, mimeType: "audio/webm" | "audio/mp4" | ... }
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const audio: string | undefined = body?.audio;
    const mimeType: string = body?.mimeType ?? "audio/webm";

    if (!audio || typeof audio !== "string") {
      return new Response(JSON.stringify({ error: "Áudio inválido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Limite ~10MB em base64
    if (audio.length > 14_000_000) {
      return new Response(JSON.stringify({ error: "Áudio muito longo. Grave até ~2 minutos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "Você é a Lis, transcritora do diário emocional de alunos. Transcreva fielmente em português brasileiro o áudio enviado, sem adicionar comentários, opiniões ou interpretações. Corrija apenas pontuação básica e quebras de linha. Devolva APENAS o texto transcrito.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Transcreva este áudio do meu diário:" },
              {
                type: "input_audio",
                input_audio: { data: audio, format: mimeType.includes("mp4") ? "mp4" : mimeType.includes("wav") ? "wav" : "webm" },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas gravações enviadas. Aguarde um momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Limite de uso atingido. Entre em contato com a administração." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Não consegui transcrever agora. Tente novamente." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const transcript: string = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ transcript }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("transcribe-audio error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
