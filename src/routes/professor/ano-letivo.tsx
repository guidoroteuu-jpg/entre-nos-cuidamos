import { createFileRoute } from "@tanstack/react-router";
import TeacherSchoolYear from "@/pages/teacher/TeacherSchoolYear";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/ano-letivo")({
  head: () => routeHead("Ano letivo do professor", "Organize informações e períodos do ano letivo."),
  component: TeacherSchoolYear,
});
