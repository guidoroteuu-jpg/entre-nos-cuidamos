import { createFileRoute } from "@tanstack/react-router";
import FamilyGrades from "@/pages/family/FamilyGrades";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/familia/notas")({
  head: () => routeHead("Notas", "Acompanhe notas e evolução acadêmica do estudante."),
  component: FamilyGrades,
});
