import { createFileRoute } from "@tanstack/react-router";
import StudentHome from "@/pages/student/StudentHome";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/home")({
  head: () => routeHead("Início do aluno", "Acompanhe seu bem-estar, missões e conquistas no Entre Nós."),
  component: StudentHome,
});
