import { createFileRoute } from "@tanstack/react-router";
import StudentDiary from "@/pages/student/StudentDiary";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/diario")({
  head: () => routeHead("Diário", "Registre sentimentos e reflexões em seu diário privado."),
  component: StudentDiary,
});
