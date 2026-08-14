import { createFileRoute } from "@tanstack/react-router";
import DirectionSchoolYear from "@/pages/direction/DirectionSchoolYear";

export const Route = createFileRoute("/direcao/ano-letivo")({
  component: DirectionSchoolYear,
});
