// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import AssignmentsPage from "@/pages/admin/assignments";

export const Route = createFileRoute("/_authenticated/assignments")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Supervisor Pairing — InternTrack" },
      {
        name: "description",
        content:
          "Pair students with host organization mentors and university academic supervisors.",
      },
      { property: "og:title", content: "Supervisor Pairing — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AssignmentsPage,
});
