// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import ReviewPage from "@/pages/review";

export const Route = createFileRoute("/_authenticated/review")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { student?: string | undefined } => ({
    student: typeof search["student"] === "string" ? search["student"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Review Queue — InternTrack" },
      {
        name: "description",
        content: "Review, approve and give feedback on intern activity reports.",
      },
      { property: "og:title", content: "Review Queue — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReviewPage,
});
