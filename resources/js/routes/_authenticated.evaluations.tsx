// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import EvaluationsPage from "@/pages/evaluations";

export const Route = createFileRoute("/_authenticated/evaluations")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Evaluations & Grading — InternTrack" },
      {
        name: "description",
        content:
          "Midterm and final performance evaluations, competency grading, and recommendations.",
      },
      { property: "og:title", content: "Evaluations & Grading — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EvaluationsPage,
});
