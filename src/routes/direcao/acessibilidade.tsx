import { createFileRoute } from "@tanstack/react-router";
import DirectionAccessibility from "@/pages/direction/DirectionAccessibility";

export const Route = createFileRoute("/direcao/acessibilidade")({
  component: DirectionAccessibility,
});
