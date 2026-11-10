// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/pages/dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  validateSearch: (
    search: Record<string, unknown>,
  ): { role?: string | undefined; user?: string | undefined } => ({
    role: typeof search["role"] === "string" ? search["role"] : undefined,
    user: typeof search["user"] === "string" ? search["user"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dashboard — InternTrack" },
      {
        name: "description",
        content: "Real-time internship progress, attendance tracking, and supervisor reviews.",
      },
      { property: "og:title", content: "Dashboard — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});
