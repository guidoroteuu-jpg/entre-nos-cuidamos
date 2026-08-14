import { createFileRoute } from "@tanstack/react-router";
import DirectionComplaints from "@/pages/direction/DirectionComplaints";

export const Route = createFileRoute("/direcao/denuncias")({
  component: DirectionComplaints,
});
