import { createFileRoute } from "@tanstack/react-router";
import FamilyAttendance from "@/pages/family/FamilyAttendance";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/familia/frequencia")({
  head: () => routeHead("Frequência", "Acompanhe a frequência escolar do estudante."),
  component: FamilyAttendance,
});
