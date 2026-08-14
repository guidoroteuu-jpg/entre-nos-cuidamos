import { createFileRoute } from "@tanstack/react-router";
import TeacherResourceLibrary from "@/pages/teacher/TeacherResourceLibrary";

export const Route = createFileRoute("/professor/biblioteca")({
  component: TeacherResourceLibrary,
});
