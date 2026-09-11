import { createFileRoute } from "@tanstack/react-router";
import StudentClassConnection from "@/pages/student/StudentClassConnection";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/turma")({
  head: () => routeHead("Minha turma", "Fortaleça conexões e compartilhe como você se sente na turma."),
  component: StudentClassConnection,
});
