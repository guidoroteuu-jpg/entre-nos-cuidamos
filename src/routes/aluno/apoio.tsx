import { createFileRoute } from "@tanstack/react-router";
import StudentSupport from "@/pages/student/StudentSupport";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/apoio")({
  head: () => routeHead("Cantinho de apoio", "Encontre conteúdos e exercícios sobre ansiedade, autoestima e amizade."),
  component: StudentSupport,
});
