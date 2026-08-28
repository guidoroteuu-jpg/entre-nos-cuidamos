import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "wellbeing_summary",
  title: "Resumo de bem-estar",
  description:
    "Resume os check-ins de humor visíveis ao usuário autenticado em um período recente: média, total e distribuição por nota.",
  inputSchema: {
    days: z.number().int().optional().describe("Janela em dias a considerar (padrão 7, máximo 90)."),
  },
  outputSchema: {
    days: z.number(),
    total: z.number(),
    average: z.number().nullable(),
    distribution: z.record(z.string(), z.number()),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const window = Math.min(Math.max(days ?? 7, 1), 90);
    const since = new Date(Date.now() - window * 24 * 60 * 60 * 1000).toISOString();
    const supabase = supabaseForUser(ctx);

    const { data, error } = await supabase
      .from("checkins")
      .select("mood, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = data ?? [];
    const distribution: Record<string, number> = {};
    let sum = 0;
    for (const row of rows) {
      sum += row.mood;
      const key = String(row.mood);
      distribution[key] = (distribution[key] ?? 0) + 1;
    }
    const summary = {
      days: window,
      total: rows.length,
      average: rows.length ? Number((sum / rows.length).toFixed(2)) : null,
      distribution,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: summary,
    };
  },
});
