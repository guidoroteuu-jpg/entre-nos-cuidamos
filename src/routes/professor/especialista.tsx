import { createFileRoute } from "@tanstack/react-router";
import SpecialistReferral from "@/pages/SpecialistReferral";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/especialista")({
  head: () => routeHead("Apoio especializado", "Acompanhe encaminhamentos para apoio especializado."),
  component: () => <SpecialistReferral role="teacher" />,
});
