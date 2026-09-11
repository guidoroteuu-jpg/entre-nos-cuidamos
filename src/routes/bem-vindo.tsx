import { createFileRoute } from "@tanstack/react-router";
import Welcome from "@/pages/Welcome";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/bem-vindo")({
  head: () => routeHead("Boas-vindas", "Comece sua jornada de cuidado e bem-estar escolar no Entre Nós."),
  component: Welcome,
});
