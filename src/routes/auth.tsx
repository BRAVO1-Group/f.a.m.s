import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { DEMO_USERS } from "@/lib/mock-data";
import { setDemoUser, ROLE_LABELS } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — InternTrack" },
      { name: "description", content: "Sign in to your InternTrack demo workspace." },
      { property: "og:title", content: "Sign in — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  ssr: false,
  component: AuthPage,
});

const ROLE_ICONS: Record<string, string> = {
  student: "🎓",
  supervisor: "👔",
  org_admin: "🏢",
  uni_admin: "🏛️",
};

function AuthPage() {
  const navigate = useNavigate();

  function signInAs(userId: string) {
    setDemoUser(userId);
    window.dispatchEvent(new Event("demo-auth-change"));
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-10">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold text-primary-foreground">
            InternTrack
          </span>
        </Link>

        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Demo — Choose your role</CardTitle>
            <CardDescription>
              Select a persona to explore the full InternTrack workflow. No sign-up required.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                id={`demo-login-${user.id}`}
                onClick={() => signInAs(user.id)}
                className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <span className="text-3xl">{ROLE_ICONS[user.role] ?? "👤"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-none">{user.full_name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
                  {user.institution ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{user.institution}</p>
                  ) : null}
                </div>
                <Badge variant="secondary" className="shrink-0 capitalize">
                  {ROLE_LABELS[user.role]}
                </Badge>
              </button>
            ))}

            <p className="mt-2 text-center text-xs text-muted-foreground">
              This is a prototype showcase. All data is simulated.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
