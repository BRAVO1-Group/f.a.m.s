// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import AdminPage from "@/pages/admin/placements";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administration — InternTrack" },
      {
        name: "description",
        content: "Manage students, organizations, supervisors and placements.",
      },
      { property: "og:title", content: "Administration — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminPage,
});
