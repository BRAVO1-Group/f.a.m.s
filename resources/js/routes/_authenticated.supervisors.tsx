// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import SupervisorsPage from "@/pages/admin/supervisors";

export const Route = createFileRoute("/_authenticated/supervisors")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Supervisor Accounts — InternTrack" },
      {
        name: "description",
        content: "Create and manage host organization mentors and university academic supervisors.",
      },
      { property: "og:title", content: "Supervisor Accounts — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SupervisorsPage,
});
