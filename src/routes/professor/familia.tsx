import { createFileRoute } from "@tanstack/react-router";
import FamilyChannel from "@/pages/FamilyChannel";

export const Route = createFileRoute("/professor/familia")({
  component: () => <FamilyChannel role="teacher" />,
});
