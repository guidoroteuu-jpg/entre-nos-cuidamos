import { createFileRoute } from "@tanstack/react-router";
import FamilyDashboard from "@/pages/family/FamilyDashboard";

export const Route = createFileRoute("/familia/painel")({
  component: FamilyDashboard,
});
