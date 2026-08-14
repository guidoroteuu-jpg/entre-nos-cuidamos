import { createFileRoute } from "@tanstack/react-router";
import StudentAccessibility from "@/pages/student/StudentAccessibility";

export const Route = createFileRoute("/aluno/acessibilidade")({
  component: StudentAccessibility,
});
