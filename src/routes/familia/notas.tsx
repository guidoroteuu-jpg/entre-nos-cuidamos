import { createFileRoute } from "@tanstack/react-router";
import FamilyGrades from "@/pages/family/FamilyGrades";

export const Route = createFileRoute("/familia/notas")({
  component: FamilyGrades,
});
