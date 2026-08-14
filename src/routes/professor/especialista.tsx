import { createFileRoute } from "@tanstack/react-router";
import SpecialistReferral from "@/pages/SpecialistReferral";

export const Route = createFileRoute("/professor/especialista")({
  component: () => <SpecialistReferral role="teacher" />,
});
