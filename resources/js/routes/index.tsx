// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/welcome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAMS — Field Attachment Management System" },
      {
        name: "description",
        content:
          "Field Attachment Management System for universities, students, host organisations and supervisors.",
      },
      { property: "og:title", content: "FAMS — Field Attachment Management System" },
      {
        property: "og:description",
        content:
          "Field Attachment Management System for universities, students, host organisations and supervisors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
