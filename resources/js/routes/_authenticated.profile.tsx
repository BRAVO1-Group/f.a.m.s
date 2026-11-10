// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/pages/profile";

export const Route = createFileRoute("/_authenticated/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Profile — InternTrack" },
      { name: "description", content: "Manage your internship profile details and placement." },
      { property: "og:title", content: "My Profile — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ProfilePage,
});
