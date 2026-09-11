import { createFileRoute } from "@tanstack/react-router";
import DirectionComplaints from "@/pages/direction/DirectionComplaints";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/denuncias")({
  head: () => routeHead("Triagem de denúncias", "Priorize e acompanhe denúncias com segurança e responsabilidade."),
  component: DirectionComplaints,
});
