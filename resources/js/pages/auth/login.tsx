import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Info,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { DEMO_USERS } from "@/lib/mock-data";
import { setDemoUser, ROLE_LABELS, ROLE_TIERS } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  function signInAs(userId: string) {
    setDemoUser(userId);
    window.dispatchEvent(new Event("demo-auth-change"));
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-10 antialiased">
      <div className="w-full max-w-xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur shadow-xs">
            <GraduationCap className="size-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">
            InternTrack
          </span>
        </Link>

        <Card className="shadow-elevated border-border/80">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
              <KeyRound className="size-5.5" />
            </div>
            <CardTitle className="text-2xl font-bold font-display">
              Attachment Portal Authentication
            </CardTitle>
            <CardDescription className="text-xs max-w-md mx-auto">
              Host Organization Supervisors & Faculty Assessors access via received institutional
              credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => setActiveTab(v as "login" | "register")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl mb-4">
                <TabsTrigger value="login" className="text-xs font-semibold rounded-lg">
                  <KeyRound className="mr-1.5 size-3.5" />
                  Sign In (Received Logins)
                </TabsTrigger>
                <TabsTrigger value="register" className="text-xs font-semibold rounded-lg">
                  <Lock className="mr-1.5 size-3.5" />
                  New Registration
                </TabsTrigger>
              </TabsList>

              {/* ── TAB 1: RECEIVED CREDENTIALS LOGIN ── */}
              <TabsContent value="login" className="space-y-3.5 mt-0">
                {/* Notice on Supervisor Credential Provisioning */}
                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-foreground/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <Info className="size-4 shrink-0" />
                    <span>Host Organization & Faculty Supervisor Access Notice</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Host Organization Field Mentors do not create self-service accounts. Credentials
                    are provisioned by the University Administration upon placement confirmation and
                    delivered via invitation email.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block px-1">
                    Select Your Received Demo Credential:
                  </span>

                  {DEMO_USERS.map((user) => {
                    const isSupervisor = user.role === "supervisor";
                    const isOrgRole = user.role === "org_admin";
                    const isReceivedLogin = isSupervisor || isOrgRole;
                    const tier = ROLE_TIERS[user.role];

                    return (
                      <button
                        key={user.id}
                        id={`demo-login-${user.id}`}
                        onClick={() => signInAs(user.id)}
                        className={`group flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all hover:shadow-card focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          isReceivedLogin
                            ? "border-amber-300/80 bg-amber-500/5 hover:border-amber-400 hover:bg-amber-500/10"
                            : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${
                            isReceivedLogin
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {user.full_name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-foreground leading-tight">
                              {user.full_name}
                            </p>
                            {isReceivedLogin && (
                              <Badge
                                variant="outline"
                                className="border-amber-300 text-amber-700 bg-amber-50 text-[10px] font-semibold py-0 px-1.5"
                              >
                                Received Login
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground font-mono">
                            {user.email}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground/80">
                            {user.id === "supervisor-1"
                              ? "TechCorp Kenya Ltd • Field Supervisor (Tied to Alice & Kevin)"
                              : user.role === "org_admin"
                                ? "TechCorp Kenya Ltd • Field Mentor (Received University Login)"
                                : user.role === "uni_admin"
                                  ? "University of Nairobi • Dean & Assessor"
                                  : "BSc. Computer Science Candidate"}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[10px] font-semibold ${tier.color}`}
                        >
                          Tier {tier.tier}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>

              {/* ── TAB 2: REGISTRATION RESTRICTION NOTICE ── */}
              <TabsContent value="register" className="space-y-4 mt-0">
                <Alert
                  variant="destructive"
                  className="border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-200 rounded-xl"
                >
                  <Lock className="size-4 text-amber-600" />
                  <AlertTitle className="font-semibold text-sm">
                    Self-Registration Restricted for Supervisors
                  </AlertTitle>
                  <AlertDescription className="text-xs mt-1 text-muted-foreground leading-relaxed">
                    Host Organization Supervisors and University Faculty Assessors{" "}
                    <strong>cannot</strong> create self-service accounts. Supervisor accounts are
                    provisioned exclusively by the University Administration and linked to specific
                    student internship placements.
                  </AlertDescription>
                </Alert>

                <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                  <p className="font-semibold text-foreground">How supervisor accounts work:</p>
                  <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
                    <li>
                      <strong>Placement Matching:</strong> When an attachment agreement is signed,
                      the university dean provisions the host organization supervisor account.
                    </li>
                    <li>
                      <strong>Credentials Delivery:</strong> Your unique username and initial login
                      token are sent directly to your corporate email.
                    </li>
                    <li>
                      <strong>Scope Limitation:</strong> Upon signing in, you will have exclusive
                      access to review and certify submissions from your assigned student interns.
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => setActiveTab("login")}
                  className="w-full text-xs font-semibold h-9"
                >
                  Return to Sign In with Received Logins →
                </Button>
              </TabsContent>
            </Tabs>

            <p className="pt-2 text-center text-[11px] text-muted-foreground border-t border-border/60">
              InternTrack Multi-Tenant Attachment & Industrial Training System • Kenya
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
