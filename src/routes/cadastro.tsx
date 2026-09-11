import { createFileRoute } from "@tanstack/react-router";
import Registration from "@/pages/Registration";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/cadastro")({
  head: () => routeHead("Cadastro", "Cadastre sua escola para começar a cuidar do bem-estar da comunidade escolar."),
  component: Registration,
});
