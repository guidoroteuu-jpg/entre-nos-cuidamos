import { createFileRoute } from "@tanstack/react-router";
import DirectionProtocols from "@/pages/direction/DirectionProtocols";

export const Route = createFileRoute("/direcao/protocolos")({
  component: DirectionProtocols,
});
