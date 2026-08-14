import { createFileRoute } from "@tanstack/react-router";
import CouncilReferral from "@/pages/CouncilReferral";

export const Route = createFileRoute("/professor/conselho-tutelar")({
  component: () => <CouncilReferral role="teacher" />,
});
