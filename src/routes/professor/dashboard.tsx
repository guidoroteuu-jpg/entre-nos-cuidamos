import { createFileRoute } from "@tanstack/react-router";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/dashboard")({
  head: () => routeHead("Dashboard da turma", "Acompanhe o clima e os indicadores de bem-estar da turma."),
  component: TeacherDashboard,
});
