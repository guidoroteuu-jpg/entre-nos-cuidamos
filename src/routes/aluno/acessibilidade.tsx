import { createFileRoute } from "@tanstack/react-router";
import StudentAccessibility from "@/pages/student/StudentAccessibility";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/acessibilidade")({
  head: () => routeHead("Acessibilidade do aluno", "Personalize idioma, contraste, leitura e outras opções de acessibilidade."),
  component: StudentAccessibility,
});
