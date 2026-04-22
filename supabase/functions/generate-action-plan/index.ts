import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const studentProfile = String(body?.studentProfile || "").trim();
    const status = String(body?.status || "").trim();
    const context = String(body?.context || "").trim();

    if (!["Problema", "Grave"].includes(status) || studentProfile.length < 3 || studentProfile.length > 120 || context.length < 10 || context.length > 600) {
      return new Response(JSON.stringify({ error: "Informe perfil, status e contexto válidos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você apoia professores com planos de ação escolares individualizados. Não faça diagnóstico, não rotule alunos e proponha ações observáveis, discretas e seguras." },
          { role: "user", content: `Crie 5 ações para um plano individualizado. Perfil: ${studentProfile}. Status: ${status}. Contexto observado: ${context}. Para cada ação, inclua: ação, responsável sugerido, prazo sugerido e critério simples de acompanhamento. Responda em português brasileiro.` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em instantes." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Limite de uso da IA atingido." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "Não foi possível gerar o plano agora." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ content: data?.choices?.[0]?.message?.content || "Não foi possível gerar sugestões." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});