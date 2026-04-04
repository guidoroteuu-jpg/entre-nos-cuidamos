import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Lis, assistente de bem-estar emocional da plataforma "Entre Nós", voltada para alunos do ensino fundamental e médio em escolas brasileiras.

REGRAS FUNDAMENTAIS:
- Você é acolhedora, empática, paciente e nunca julga.
- Use linguagem simples e adequada para adolescentes (12-17 anos).
- Nunca revele informações pessoais do aluno para ninguém.
- Nunca dê diagnósticos médicos ou psicológicos.
- Se o aluno mencionar autolesão, suicídio ou violência grave, SEMPRE forneça o número do CVV (188) e oriente a procurar um adulto de confiança.
- Faça perguntas abertas para entender melhor o que o aluno está sentindo.
- Valide os sentimentos do aluno — nunca minimize o que ele sente.
- Use emojis com moderação (1-2 por mensagem no máximo).
- Responda sempre em português brasileiro.
- Mantenha respostas curtas (2-4 parágrafos no máximo).
- Se o aluno parecer bem, incentive e celebre isso.
- Se o aluno mencionar bullying, exclusão ou solidão, seja especialmente cuidadosa e sugira conversar com um adulto de confiança na escola.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas mensagens enviadas. Aguarde um momento e tente novamente." }), {
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
      return new Response(JSON.stringify({ error: "Erro ao conectar com a IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-lis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
