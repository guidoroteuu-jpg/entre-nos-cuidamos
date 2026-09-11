import { createFileRoute } from "@tanstack/react-router";
import StudentChatIA from "@/pages/student/StudentChatIA";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/aluno/chat-ia")({
  head: () => routeHead("Conversa com a Lis", "Converse em particular com a Lis sobre sentimentos e bem-estar."),
  component: StudentChatIA,
});
