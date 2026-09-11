import { createFileRoute } from "@tanstack/react-router";
import SpecialistReferral from "@/pages/SpecialistReferral";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/especialista")({
  head: () => routeHead("Encaminhamento especialista", "Acompanhe encaminhamentos para apoio especializado."),
  component: () => <SpecialistReferral role="admin" />,
});
