// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import AttendancePage from "@/pages/attendance";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — InternTrack" },
      { name: "description", content: "Digital check-in and check-out with attendance history." },
      { property: "og:title", content: "Attendance — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AttendancePage,
});
