// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/welcome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternTrack — The Modern Internship Operating System" },
      {
        name: "description",
        content:
          "Transform paper logbooks into verified real-world achievements. Unified daily logging, automated attendance, milestone tracking, and supervisor sign-offs.",
      },
      { property: "og:title", content: "InternTrack — The Modern Internship Operating System" },
      {
        property: "og:description",
        content:
          "One clear platform for students, supervisors, and universities to track, verify, and celebrate internship growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
