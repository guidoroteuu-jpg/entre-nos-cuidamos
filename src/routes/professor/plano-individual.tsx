import { createFileRoute } from "@tanstack/react-router";
import TeacherActionPlan from "@/pages/teacher/TeacherActionPlan";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/plano-individual")({
  head: () => routeHead("Plano individual", "Crie e acompanhe planos de cuidado individual."),
  component: TeacherActionPlan,
});
