import { createFileRoute } from "@tanstack/react-router";
import FamilyWellbeing from "@/pages/family/FamilyWellbeing";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/familia/bem-estar")({
  head: () => routeHead("Bem-estar da família", "Acompanhe os indicadores de bem-estar do estudante."),
  component: FamilyWellbeing,
});
