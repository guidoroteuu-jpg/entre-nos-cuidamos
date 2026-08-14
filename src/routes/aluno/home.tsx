import { createFileRoute } from "@tanstack/react-router";
import StudentHome from "@/pages/student/StudentHome";

export const Route = createFileRoute("/aluno/home")({
  component: StudentHome,
});
