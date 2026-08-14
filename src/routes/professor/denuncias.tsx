import { createFileRoute } from "@tanstack/react-router";
import TeacherComplaints from "@/pages/teacher/TeacherComplaints";

export const Route = createFileRoute("/professor/denuncias")({
  component: TeacherComplaints,
});
