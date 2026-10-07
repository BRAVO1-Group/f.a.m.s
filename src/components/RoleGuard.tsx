import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS, setDemoUser, type AppRole } from "@/lib/auth";
import { DEMO_USERS } from "@/lib/mock-data";

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: AppRole[];
  children: ReactNode;
}) {
  const { role } = useAppUser();

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  // Find a demo persona that matches one of the allowed roles
  const compatiblePersona = DEMO_USERS.find((u) => u.roles.some((r) => allowedRoles.includes(r)));

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/80 shadow-lg text-center">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Access Restricted</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your active role does not have permission to view this page.
            </p>
            <div className="mt-2.5 flex justify-center items-center gap-2">
              <span className="text-xs text-muted-foreground">Active Role:</span>
              <Badge
                variant="outline"
                className="font-semibold text-xs border-destructive/40 text-destructive"
              >
                {ROLE_LABELS[role]}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Allowed roles for this page:{" "}
            <span className="font-medium text-foreground">
              {allowedRoles.map((r) => ROLE_LABELS[r]).join(", ")}
            </span>
          </p>

          <div className="pt-3 flex flex-col gap-2">
            {compatiblePersona ? (
              <Button
                size="sm"
                className="cursor-pointer gap-1.5"
                onClick={() => {
                  setDemoUser(compatiblePersona.id);
                  window.dispatchEvent(new Event("demo-auth-change"));
                }}
              >
                <RefreshCw className="size-3.5" />
                Switch to {compatiblePersona.full_name} ({ROLE_LABELS[compatiblePersona.roles[0]!]})
              </Button>
            ) : null}

            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">
                <ArrowLeft className="size-3.5 mr-1" /> Return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
