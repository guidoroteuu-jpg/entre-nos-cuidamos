import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const situations = ["bullying", "ansiedade", "exclusão", "conflito"];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const situation = String(body?.situation || "").trim().toLowerCase();
    const grade = String(body?.grade || "").trim();
    const objective = String(body?.objective || "").trim();

    if (!situations.includes(situation) || grade.length < 2 || grade.length > 80 || objective.length < 8 || objective.length > 400) {
      return new Response(JSON.stringify({ error: "Informe situação, turma e objetivo válidos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Crie uma dinâmica escolar segura e prática para professores. Situação: ${situation}. Turma/faixa: ${grade}. Objetivo: ${objective}. Responda em português brasileiro com: título, duração, materiais, passo a passo, cuidados de sigilo e fechamento. Não faça diagnóstico e não exponha alunos.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Você ajuda professores a criar dinâmicas socioemocionais seguras, inclusivas, discretas e sem diagnóstico clínico." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em instantes." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Limite de uso da IA atingido." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "Não foi possível gerar a dinâmica agora." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "Não foi possível gerar uma sugestão.";
    return new Response(JSON.stringify({ content }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});