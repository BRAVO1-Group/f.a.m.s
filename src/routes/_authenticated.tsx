import { useEffect } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AppUserProvider } from "@/lib/app-user";
import { primaryRole, useProfile, useRoles, useSession } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: roles, isLoading: rolesLoading } = useRoles(user?.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user || profileLoading || rolesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const role = primaryRole(roles);
  const name = profile?.full_name || user.email || "";
  const email = profile?.email || user.email || "";

  return (
    <AppUserProvider value={{ userId: user.id, email, name, role, roles: roles ?? [role] }}>
      <AppShell role={role} roles={roles ?? [role]} name={name} email={email}>
        <Outlet />
      </AppShell>
    </AppUserProvider>
  );
}
