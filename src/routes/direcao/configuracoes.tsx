import { createFileRoute } from "@tanstack/react-router";
import DirectionSettings from "@/pages/direction/DirectionSettings";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/configuracoes")({
  head: () => routeHead("Configurações", "Gerencie as configurações institucionais do Entre Nós."),
  component: DirectionSettings,
});
