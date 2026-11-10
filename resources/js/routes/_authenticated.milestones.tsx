// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import MilestonesPage from "@/pages/milestones";

export const Route = createFileRoute("/_authenticated/milestones")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Milestones Roadmap — InternTrack" },
      {
        name: "description",
        content: "Track internship phases, weekly deliverables, and mentor milestones.",
      },
      { property: "og:title", content: "Milestones Roadmap — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MilestonesPage,
});
