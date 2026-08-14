import { createFileRoute } from "@tanstack/react-router";
import StudentDiary from "@/pages/student/StudentDiary";

export const Route = createFileRoute("/aluno/diario")({
  component: StudentDiary,
});
