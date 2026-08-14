import { createFileRoute } from "@tanstack/react-router";
import Welcome from "@/pages/Welcome";

export const Route = createFileRoute("/bem-vindo")({
  component: Welcome,
});
