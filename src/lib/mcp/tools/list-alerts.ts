import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_alerts",
  title: "Listar alertas de risco",
  description:
    "Lista os alertas de bem-estar e risco acessíveis ao usuário autenticado, com severidade e situação de resolução.",
  inputSchema: {
    severity: z.enum(["low", "medium", "high"]).optional().describe("Filtra pela severidade do alerta."),
    only_unresolved: z.boolean().optional().describe("Se verdadeiro, retorna apenas alertas não resolvidos."),
    limit: z.number().int().optional().describe("Número máximo de alertas (padrão 20, máximo 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ severity, only_unresolved, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("alertas")
      .select("id, type, description, severity, resolved, created_at")
      .order("created_at", { ascending: false })
      .limit(max);
    if (severity) query = query.eq("severity", severity);
    if (only_unresolved) query = query.eq("resolved", false);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { alerts: data ?? [] },
    };
  },
});
