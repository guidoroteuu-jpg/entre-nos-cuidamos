import { createFileRoute } from "@tanstack/react-router";
import TeacherAlerts from "@/pages/teacher/TeacherAlerts";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/alertas")({
  head: () => routeHead("Alertas", "Acompanhe sinais que precisam de atenção na turma."),
  component: TeacherAlerts,
});
