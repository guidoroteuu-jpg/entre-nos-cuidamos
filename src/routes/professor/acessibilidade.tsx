import { createFileRoute } from "@tanstack/react-router";
import TeacherAccessibility from "@/pages/teacher/TeacherAccessibility";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/acessibilidade")({
  head: () => routeHead("Acessibilidade do professor", "Personalize a experiência de acessibilidade para professores."),
  component: TeacherAccessibility,
});
