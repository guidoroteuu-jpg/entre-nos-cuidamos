import { createFileRoute } from "@tanstack/react-router";
import DirectionClasses from "@/pages/direction/DirectionClasses";

export const Route = createFileRoute("/direcao/turmas")({
  component: DirectionClasses,
});
