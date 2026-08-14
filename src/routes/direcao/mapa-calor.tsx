import { createFileRoute } from "@tanstack/react-router";
import DirectionHeatmap from "@/pages/direction/DirectionHeatmap";

export const Route = createFileRoute("/direcao/mapa-calor")({
  component: DirectionHeatmap,
});
