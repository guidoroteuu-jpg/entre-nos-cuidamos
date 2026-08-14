import { createFileRoute } from "@tanstack/react-router";
import CouncilReferral from "@/pages/CouncilReferral";

export const Route = createFileRoute("/direcao/conselho-tutelar")({
  component: () => <CouncilReferral role="admin" />,
});
