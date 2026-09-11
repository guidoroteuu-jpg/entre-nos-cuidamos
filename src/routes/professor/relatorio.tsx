import { createFileRoute } from "@tanstack/react-router";
import TeacherReport from "@/pages/teacher/TeacherReport";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/relatorio")({
  head: () => routeHead("Relatório da turma", "Veja tendências e indicadores agregados da turma."),
  component: TeacherReport,
});
