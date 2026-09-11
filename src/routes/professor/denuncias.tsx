import { createFileRoute } from "@tanstack/react-router";
import TeacherComplaints from "@/pages/teacher/TeacherComplaints";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/denuncias")({
  head: () => routeHead("Denúncias da turma", "Acompanhe denúncias e situações que precisam de atenção."),
  component: TeacherComplaints,
});
