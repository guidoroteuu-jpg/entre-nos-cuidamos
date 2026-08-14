import { createFileRoute } from "@tanstack/react-router";
import StudentClassConnection from "@/pages/student/StudentClassConnection";

export const Route = createFileRoute("/aluno/turma")({
  component: StudentClassConnection,
});
