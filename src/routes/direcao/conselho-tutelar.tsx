import { createFileRoute } from "@tanstack/react-router";
import CouncilReferral from "@/pages/CouncilReferral";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/conselho-tutelar")({
  head: () => routeHead("Conselho Tutelar", "Acompanhe encaminhamentos seguros ao Conselho Tutelar."),
  component: () => <CouncilReferral role="admin" />,
});
