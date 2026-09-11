import { createFileRoute } from "@tanstack/react-router";
import DirectionProtocols from "@/pages/direction/DirectionProtocols";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/protocolos")({
  head: () => routeHead("Protocolos", "Padronize os protocolos de cuidado e resposta da escola."),
  component: DirectionProtocols,
});
