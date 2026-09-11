import { createFileRoute } from "@tanstack/react-router";
import CouncilReferral from "@/pages/CouncilReferral";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/conselho-tutelar")({
  head: () => routeHead("Conselho Tutelar", "Acompanhe encaminhamentos ao Conselho Tutelar."),
  component: () => <CouncilReferral role="teacher" />,
});
