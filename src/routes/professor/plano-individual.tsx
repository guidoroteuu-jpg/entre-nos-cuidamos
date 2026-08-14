import { createFileRoute } from "@tanstack/react-router";
import TeacherActionPlan from "@/pages/teacher/TeacherActionPlan";

export const Route = createFileRoute("/professor/plano-individual")({
  component: TeacherActionPlan,
});
