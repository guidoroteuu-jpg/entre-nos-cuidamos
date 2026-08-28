import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_complaints",
  title: "Listar denúncias",
  description:
    "Lista as denúncias (bullying, exclusão, agressão) visíveis para o usuário autenticado, com status e data.",
  inputSchema: {
    status: z
      .enum(["pendente", "em_analise", "resolvida"])
      .optional()
      .describe("Filtra pelo status da denúncia."),
    limit: z.number().int().optional().describe("Número máximo de denúncias (padrão 20, máximo 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("denuncias")
      .select("id, type, description, status, is_anonymous, created_at")
      .order("created_at", { ascending: false })
      .limit(max);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { complaints: data ?? [] },
    };
  },
});
