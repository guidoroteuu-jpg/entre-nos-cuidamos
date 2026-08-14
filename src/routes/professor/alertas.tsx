import { createFileRoute } from "@tanstack/react-router";
import TeacherAlerts from "@/pages/teacher/TeacherAlerts";

export const Route = createFileRoute("/professor/alertas")({
  component: TeacherAlerts,
});
