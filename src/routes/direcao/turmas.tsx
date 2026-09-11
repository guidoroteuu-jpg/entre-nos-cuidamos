import { createFileRoute } from "@tanstack/react-router";
import DirectionClasses from "@/pages/direction/DirectionClasses";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/turmas")({
  head: () => routeHead("Turmas", "Acompanhe o bem-estar das turmas da escola."),
  component: DirectionClasses,
});
