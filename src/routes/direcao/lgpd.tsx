import { createFileRoute } from "@tanstack/react-router";
import DirectionLGPD from "@/pages/direction/DirectionLGPD";

export const Route = createFileRoute("/direcao/lgpd")({
  component: DirectionLGPD,
});
