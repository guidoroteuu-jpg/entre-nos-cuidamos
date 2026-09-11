import { createFileRoute } from "@tanstack/react-router";
import FamilyChannel from "@/pages/FamilyChannel";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/professor/familia")({
  head: () => routeHead("Canal com famílias", "Mantenha a comunicação com os responsáveis."),
  component: () => <FamilyChannel role="teacher" />,
});
