import { createFileRoute } from "@tanstack/react-router";
import StudentChat from "@/pages/student/StudentChat";

export const Route = createFileRoute("/aluno/chat")({
  component: StudentChat,
});
