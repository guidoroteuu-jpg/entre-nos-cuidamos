import { createFileRoute } from "@tanstack/react-router";
import StudentConfident from "@/pages/student/StudentConfident";

export const Route = createFileRoute("/aluno/confidente")({
  component: StudentConfident,
});
