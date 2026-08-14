import { createFileRoute } from "@tanstack/react-router";
import FamilyWellbeing from "@/pages/family/FamilyWellbeing";

export const Route = createFileRoute("/familia/bem-estar")({
  component: FamilyWellbeing,
});
