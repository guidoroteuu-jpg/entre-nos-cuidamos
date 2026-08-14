import { createFileRoute } from "@tanstack/react-router";
import TeacherReport from "@/pages/teacher/TeacherReport";

export const Route = createFileRoute("/professor/relatorio")({
  component: TeacherReport,
});
