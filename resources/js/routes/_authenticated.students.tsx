// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import StudentsPage from "@/pages/admin/students";

export const Route = createFileRoute("/_authenticated/students")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Assigned Interns — InternTrack" },
      {
        name: "description",
        content: "Track and supervise assigned student interns, progress, and submissions.",
      },
      { property: "og:title", content: "Assigned Interns — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StudentsPage,
});
