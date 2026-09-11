import { createFileRoute } from "@tanstack/react-router";
import DirectionPanel from "@/pages/direction/DirectionPanel";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/painel")({
  head: () => routeHead("Painel da direção", "Acompanhe indicadores e prioridades de bem-estar escolar."),
  component: DirectionPanel,
});
