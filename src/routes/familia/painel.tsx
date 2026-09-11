import { createFileRoute } from "@tanstack/react-router";
import FamilyDashboard from "@/pages/family/FamilyDashboard";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/familia/painel")({
  head: () => routeHead("Resumo da família", "Veja o resumo acadêmico e de bem-estar do estudante."),
  component: FamilyDashboard,
});
