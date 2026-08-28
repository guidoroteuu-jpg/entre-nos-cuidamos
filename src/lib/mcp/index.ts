import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listComplaintsTool from "./tools/list-complaints";
import listAlertsTool from "./tools/list-alerts";
import wellbeingSummaryTool from "./tools/wellbeing-summary";
import updateComplaintStatusTool from "./tools/update-complaint-status";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "entre-nos",
  title: "entre nos",
  version: "0.1.0",
  instructions:
    "Ferramentas da plataforma escolar Entre Nós. Use `list_complaints` para ver denúncias, `list_alerts` para alertas de risco, `wellbeing_summary` para o panorama de humor da comunidade escolar e `update_complaint_status` para encaminhar uma denúncia. Todos os dados respeitam as permissões do usuário autenticado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listComplaintsTool, listAlertsTool, wellbeingSummaryTool, updateComplaintStatusTool],
});
