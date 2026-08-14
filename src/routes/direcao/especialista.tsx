import { createFileRoute } from "@tanstack/react-router";
import SpecialistReferral from "@/pages/SpecialistReferral";

export const Route = createFileRoute("/direcao/especialista")({
  component: () => <SpecialistReferral role="admin" />,
});
