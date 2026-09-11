import { createFileRoute } from "@tanstack/react-router";
import DirectionLGPD from "@/pages/direction/DirectionLGPD";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/lgpd")({
  head: () => routeHead("Conformidade LGPD", "Acompanhe consentimentos, retenção e conformidade de dados escolares."),
  component: DirectionLGPD,
});
