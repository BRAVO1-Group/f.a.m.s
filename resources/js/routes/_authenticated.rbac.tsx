// Temporary TanStack route binding. When the Laravel backend is added this file is
// replaced by a route in routes/web.php rendering the page via Inertia.
import { createFileRoute } from "@tanstack/react-router";
import RbacPage from "@/pages/admin/rbac";

export const Route = createFileRoute("/_authenticated/rbac")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "RBAC Control Matrix — InternTrack" },
      {
        name: "description",
        content:
          "Configure role-based access control permissions, security clearances, and privileges.",
      },
      { property: "og:title", content: "RBAC Control Matrix — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RbacPage,
});
