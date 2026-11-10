// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import LogbookPage from "@/pages/logbook";

export const Route = createFileRoute("/_authenticated/logbook")({
  head: () => ({
    meta: [
      { title: "Digital Logbook — InternTrack" },
      {
        name: "description",
        content: "Record daily internship activities and submit for approval.",
      },
      { property: "og:title", content: "Digital Logbook — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LogbookPage,
});
