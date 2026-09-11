import { createFileRoute } from "@tanstack/react-router";
import DirectionSchoolYear from "@/pages/direction/DirectionSchoolYear";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/ano-letivo")({
  head: () => routeHead("Ano letivo", "Organize períodos e informações do ano letivo."),
  component: DirectionSchoolYear,
});
