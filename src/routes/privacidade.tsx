import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/pages/Privacy";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/privacidade")({
  head: () => routeHead("Privacidade", "Conheça os compromissos do Entre Nós com privacidade, segurança e LGPD."),
  component: Privacy,
});
