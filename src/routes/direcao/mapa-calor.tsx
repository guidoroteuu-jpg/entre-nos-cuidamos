import { createFileRoute } from "@tanstack/react-router";
import DirectionHeatmap from "@/pages/direction/DirectionHeatmap";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/mapa-calor")({
  head: () => routeHead("Mapa de bem-estar", "Visualize tendências agregadas de bem-estar na escola."),
  component: DirectionHeatmap,
});
