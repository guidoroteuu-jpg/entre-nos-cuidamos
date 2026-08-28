import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_complaint_status",
  title: "Atualizar status de denúncia",
  description:
    "Atualiza o status de uma denúncia. Só funciona para administradores da escola correspondente.",
  inputSchema: {
    id: z.string().describe("Identificador da denúncia."),
    status: z.enum(["pendente", "em_analise", "resolvida"]).describe("Novo status da denúncia."),
    internal_notes: z.string().optional().describe("Observação interna opcional sobre o encaminhamento."),
  },
  outputSchema: {
    complaint: z.object({ id: z.string(), status: z.string(), updated_at: z.string() }),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status, internal_notes }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Não autenticado." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const patch: { status: string; internal_notes?: string } = { status };
    if (internal_notes !== undefined) patch.internal_notes = internal_notes;

    const { data, error } = await supabase
      .from("denuncias")
      .update(patch)
      .eq("id", id)
      .select("id, status, updated_at");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data || data.length === 0) {
      return {
        content: [
          { type: "text", text: "Nenhuma denúncia foi atualizada — ela não existe ou você não tem permissão." },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0]) }],
      structuredContent: { complaint: data[0] },
    };
  },
});
