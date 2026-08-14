import { createFileRoute } from "@tanstack/react-router";
import FamilyChannel from "@/pages/FamilyChannel";

export const Route = createFileRoute("/direcao/familia")({
  component: () => <FamilyChannel role="admin" />,
});
