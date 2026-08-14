import { createFileRoute } from "@tanstack/react-router";
import StudentChatIA from "@/pages/student/StudentChatIA";

export const Route = createFileRoute("/aluno/chat-ia")({
  component: StudentChatIA,
});
