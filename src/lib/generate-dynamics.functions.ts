import { createServerFn } from "@tanstack/react-start";

const situations = ["bullying", "ansiedade", "exclusão", "conflito"];

type DynamicsInput = { situation: string; grade: string; objective: string };
type DynamicsResult = { content?: string; error?: string };

export const generateDynamics = createServerFn({ method: "POST" })
  .inputValidator((input: unknown): DynamicsInput => {
    const body = input as DynamicsInput;
    const situation = String(body?.situation || "").trim().toLowerCase();
    const grade = String(body?.grade || "").trim();
    const objective = String(body?.objective || "").trim();
    if (
      !situations.includes(situation) ||
      grade.length < 2 ||
      grade.length > 80 ||
      objective.length < 8 ||
      objective.length > 400
    ) {
      throw new Error("Informe situação, turma e objetivo válidos.");
    }
    return { situation, grade, objective };
  })
  .handler(async ({ data }): Promise<DynamicsResult> => {
    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Crie uma dinâmica escolar segura e prática para professores. Situação: ${data.situation}. Turma/faixa: ${data.grade}. Objetivo: ${data.objective}. Responda em português brasileiro com: título, duração, materiais, passo a passo, cuidados de sigilo e fechamento. Não faça diagnóstico e não exponha alunos.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Você ajuda professores a criar dinâmicas socioemocionais seguras, inclusivas, discretas e sem diagnóstico clínico.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return { error: "Muitas solicitações. Tente novamente em instantes." };
      if (response.status === 402) return { error: "Limite de uso da IA atingido." };
      return { error: "Não foi possível gerar a dinâmica agora." };
    }

    const result = await response.json();
    return { content: result?.choices?.[0]?.message?.content || "Não foi possível gerar uma sugestão." };
  });
