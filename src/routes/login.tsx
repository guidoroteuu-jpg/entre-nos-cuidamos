import { createFileRoute } from "@tanstack/react-router";
import Login from "@/pages/Login";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/login")({
  head: () => routeHead("Entrar", "Acesse o Entre Nós como aluno, professor, direção ou responsável."),
  component: Login,
});
