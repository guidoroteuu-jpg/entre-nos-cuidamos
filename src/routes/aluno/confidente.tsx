import { createFileRoute } from "@tanstack/react-router";
import StudentConfident from "@/pages/student/StudentConfident";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/confidente")({
  head: () => routeHead("Confidente", "Encontre apoio seguro e pessoas de confiança na escola."),
  component: StudentConfident,
});
