import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/familia/")({
  beforeLoad: () => {
    throw redirect({ to: "/familia/painel", replace: true });
  },
});
