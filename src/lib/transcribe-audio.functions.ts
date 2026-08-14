import { createServerFn } from "@tanstack/react-start";

type TranscribeInput = { audio: string; mimeType?: string };
type TranscribeResult = { transcript?: string; error?: string };

// Transcreve áudio curto do diário usando Gemini (multimodal) via Lovable AI Gateway.
export const transcribeAudio = createServerFn({ method: "POST" })
  .inputValidator((input: unknown): TranscribeInput => {
    const body = input as TranscribeInput;
    if (!body || typeof body.audio !== "string" || !body.audio) {
      throw new Error("Áudio inválido.");
    }
    return { audio: body.audio, mimeType: body.mimeType ?? "audio/webm" };
  })
  .handler(async ({ data }): Promise<TranscribeResult> => {
    const { audio, mimeType = "audio/webm" } = data;

    // Limite ~10MB em base64
    if (audio.length > 14_000_000) {
      return { error: "Áudio muito longo. Grave até ~2 minutos." };
    }

    const apiKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
                input_audio: {
                  data: audio,
                  format: mimeType.includes("mp4") ? "mp4" : mimeType.includes("wav") ? "wav" : "webm",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return { error: "Muitas gravações enviadas. Aguarde um momento." };
      if (response.status === 402) return { error: "Limite de uso atingido. Entre em contato com a administração." };
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return { error: "Não consegui transcrever agora. Tente novamente." };
    }

    const result = await response.json();
    const transcript: string = result?.choices?.[0]?.message?.content ?? "";
    return { transcript };
  });
