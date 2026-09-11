import { createFileRoute } from "@tanstack/react-router";
import Brand from "@/pages/Brand";
import { routeHead } from "@/lib/route-head";

export const Route = createFileRoute("/brand")({
  head: () => routeHead("Marca", "Conheça a identidade visual e os princípios da marca Entre Nós."),
  component: Brand,
});
