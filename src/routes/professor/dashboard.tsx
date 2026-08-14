import { createFileRoute } from "@tanstack/react-router";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";

export const Route = createFileRoute("/professor/dashboard")({
  component: TeacherDashboard,
});
