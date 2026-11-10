// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/pages/auth/login";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — InternTrack" },
      {
        name: "description",
        content:
          "Log in with received supervisor credentials or access the student attachment portal.",
      },
      { property: "og:title", content: "Sign In — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  ssr: false,
  component: AuthPage,
});
