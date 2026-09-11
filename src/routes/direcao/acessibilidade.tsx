import { createFileRoute } from "@tanstack/react-router";
import DirectionAccessibility from "@/pages/direction/DirectionAccessibility";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/acessibilidade")({
  head: () => routeHead("Acessibilidade da direção", "Personalize a experiência de acessibilidade da equipe de direção."),
  component: DirectionAccessibility,
});
