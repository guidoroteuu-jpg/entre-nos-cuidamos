import { createFileRoute } from "@tanstack/react-router";
import DirectionPanel from "@/pages/direction/DirectionPanel";

export const Route = createFileRoute("/direcao/painel")({
  component: DirectionPanel,
});
