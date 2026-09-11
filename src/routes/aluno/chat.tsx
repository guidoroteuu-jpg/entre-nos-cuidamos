import { createFileRoute } from "@tanstack/react-router";
import StudentChat from "@/pages/student/StudentChat";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/chat")({
  head: () => routeHead("Chat do aluno", "Acesse suas conversas de apoio no Entre Nós."),
  component: StudentChat,
});
