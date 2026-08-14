import { createFileRoute } from "@tanstack/react-router";
import FamilyAttendance from "@/pages/family/FamilyAttendance";

export const Route = createFileRoute("/familia/frequencia")({
  component: FamilyAttendance,
});
