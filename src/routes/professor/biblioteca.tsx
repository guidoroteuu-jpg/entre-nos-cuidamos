import { createFileRoute } from "@tanstack/react-router";
import TeacherResourceLibrary from "@/pages/teacher/TeacherResourceLibrary";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/biblioteca")({
  head: () => routeHead("Biblioteca", "Encontre recursos e dinâmicas para o cuidado em sala."),
  component: TeacherResourceLibrary,
});
