// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import ReportsPage from "@/pages/reports";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — InternTrack" },
      { name: "description", content: "Generate weekly, monthly and final internship reports." },
      { property: "og:title", content: "Reports — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReportsPage,
});
