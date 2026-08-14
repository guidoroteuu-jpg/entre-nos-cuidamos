import { createFileRoute } from "@tanstack/react-router";
import TeacherSchoolYear from "@/pages/teacher/TeacherSchoolYear";

export const Route = createFileRoute("/professor/ano-letivo")({
  component: TeacherSchoolYear,
});
