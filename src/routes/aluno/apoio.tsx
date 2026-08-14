import { createFileRoute } from "@tanstack/react-router";
import StudentSupport from "@/pages/student/StudentSupport";

export const Route = createFileRoute("/aluno/apoio")({
  component: StudentSupport,
});
