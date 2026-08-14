import { createServerFn } from "@tanstack/react-start";

type PlanInput = { studentProfile: string; status: string; context: string };
type PlanResult = { content?: string; error?: string };

export const generateActionPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown): PlanInput => {
    const body = input as PlanInput;
    const studentProfile = String(body?.studentProfile || "").trim();
    const status = String(body?.status || "").trim();
    const context = String(body?.context || "").trim();
    if (
      !["Problema", "Grave"].includes(status) ||
      studentProfile.length < 3 ||
      studentProfile.length > 120 ||
      context.length < 10 ||
      context.length > 600
    ) {
      throw new Error("Informe perfil, status e contexto válidos.");
    }
    return { studentProfile, status, context };
  })
  .handler(async ({ data }): Promise<PlanResult> => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Você apoia professores com planos de ação escolares individualizados. Não faça diagnóstico, não rotule alunos e proponha ações observáveis, discretas e seguras.",
          },
          {
            role: "user",
            content: `Crie 5 ações para um plano individualizado. Perfil: ${data.studentProfile}. Status: ${data.status}. Contexto observado: ${data.context}. Para cada ação, inclua: ação, responsável sugerido, prazo sugerido e critério simples de acompanhamento. Responda em português brasileiro.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return { error: "Muitas solicitações. Tente novamente em instantes." };
      if (response.status === 402) return { error: "Limite de uso da IA atingido." };
      return { error: "Não foi possível gerar o plano agora." };
    }

    const result = await response.json();
    return { content: result?.choices?.[0]?.message?.content || "Não foi possível gerar sugestões." };
  });
