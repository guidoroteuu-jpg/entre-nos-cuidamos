import { createFileRoute } from "@tanstack/react-router";
import FamilyChannel from "@/pages/FamilyChannel";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/direcao/familia")({
  head: () => routeHead("Canal com famílias", "Organize a comunicação entre escola e responsáveis."),
  component: () => <FamilyChannel role="admin" />,
});
