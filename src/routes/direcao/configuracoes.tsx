import { createFileRoute } from "@tanstack/react-router";
import DirectionSettings from "@/pages/direction/DirectionSettings";

export const Route = createFileRoute("/direcao/configuracoes")({
  component: DirectionSettings,
});
