import { useEffect, useState } from "react";
import { Link, router, useForm } from "@inertiajs/react";
import {
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { BrandLogo } from "@/components/ui/brand-logo";
import { WALKTHROUGH_ROLE_KEY, WALKTHROUGH_STORAGE_KEY } from "@/pages/walkthrough";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type DemoAccount = {
  label: string;
  email: string;
  schoolId: string;
  icon: typeof GraduationCap;
};

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Student",
    email: "alice@university.ac.ug",
    schoolId: "22/U/10428/PS",
    icon: GraduationCap,
  },
  {
    label: "Supervisor",
    email: "james.otieno@techcorp.co.ug",
    schoolId: "SUP-TC-019",
    icon: UserCheck,
  },
  {
    label: "Org Admin",
    email: "admin@techcorp.co.ug",
    schoolId: "ORG-TC-001",
    icon: Building2,
  },
  {
    label: "Uni Admin",
    email: "dean@university.ac.ug",
    schoolId: "MAK-STF-004",
    icon: ShieldCheck,
  },
];

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "school_id" | "info">("login");
  const [schoolIdInput, setSchoolIdInput] = useState("");
  const [ready, setReady] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: true,
  });

  useEffect(() => {
    try {
      const done = localStorage.getItem(WALKTHROUGH_STORAGE_KEY);
      if (done !== "1") {
        router.visit("/walkthrough", { replace: true });
        return;
      }

      const selectedRole = localStorage.getItem(WALKTHROUGH_ROLE_KEY);
      const roleEmailMap: Record<string, string> = {
        student: "alice@university.ac.ug",
        supervisor: "james.otieno@techcorp.co.ug",
        academic: "james.otieno@techcorp.co.ug",
        admin: "dean@university.ac.ug",
      };

      if (selectedRole && roleEmailMap[selectedRole] && !data.email) {
        setData((prev) => ({ ...prev, email: roleEmailMap[selectedRole] }));
      }
    } catch {
      // ignore storage errors
    }

    const timer = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(timer);
  }, []);

  if (!ready || ssoLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 antialiased">
        <div className="w-full max-w-sm md:max-w-4xl">
          <Card className="overflow-hidden border-border/70 p-0 shadow-elevated">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="flex flex-col justify-between p-6 md:p-8 lg:p-10 space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Skeleton className="h-8 w-36 rounded-xl" />
                  <Skeleton className="h-7 w-44" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 pt-2">
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="relative hidden md:block min-h-[480px] p-6">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/login");
  }

  function handleSchoolIdContinue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = schoolIdInput.trim().toLowerCase();
    const matched =
      DEMO_ACCOUNTS.find(
        (acc) =>
          acc.schoolId.toLowerCase() === normalized ||
          acc.email.toLowerCase() === normalized,
      ) ?? DEMO_ACCOUNTS[0]!;

    setData({
      email: matched.email,
      password: "InternTrack@2026!",
      remember: true,
    });
    setMode("login");
    toast.success(`School ID verified (${matched.schoolId})`, {
      description: `Linked to ${matched.email}. Click Login to continue.`,
    });
  }

  function handleGoogleSignIn() {
    setSsoLoading(true);
    const targetEmail = data.email || "alice@university.ac.ug";
    setTimeout(() => {
      setData({
        email: targetEmail,
        password: "InternTrack@2026!",
        remember: true,
      });
      setSsoLoading(false);
      toast.success("Google Workspace account connected", {
        description: `Authenticated ${targetEmail}. Click Login to continue.`,
      });
    }, 450);
  }

  function fillDemoAccount(account: DemoAccount) {
    setData({
      email: account.email,
      password: "InternTrack@2026!",
      remember: true,
    });
    setSchoolIdInput(account.schoolId);
    setMode("login");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 antialiased">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border-border/70 p-0 shadow-elevated">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Left Form Column (shadcn login-04 pattern) */}
              <div className="flex flex-col justify-between p-6 md:p-8 lg:p-10">
                <div className="flex flex-col gap-6">
                  {/* Brand & Heading */}
                  <div className="flex flex-col items-center text-center">
                    <Link href="/" className="mb-3 inline-flex items-center">
                      <BrandLogo variant="auto" size="md" />
                    </Link>

                    {mode === "login" && (
                      <>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                          Welcome back
                        </h1>
                        <p className="mt-1 text-balance text-sm text-muted-foreground">
                          Login to your InternTrack portal account
                        </p>
                      </>
                    )}

                    {mode === "school_id" && (
                      <>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                          Sign in with School ID
                        </h1>
                        <p className="mt-1 text-balance text-sm text-muted-foreground">
                          Enter your university registration or staff ID number
                        </p>
                      </>
                    )}

                    {mode === "info" && (
                      <>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                          Institutional Access
                        </h1>
                        <p className="mt-1 text-balance text-sm text-muted-foreground">
                          How InternTrack credentials are provisioned
                        </p>
                      </>
                    )}
                  </div>

                  {/* Mode 1: Standard Login Form */}
                  {mode === "login" && (
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          autoComplete="username"
                          value={data.email}
                          onChange={(e) => setData("email", e.target.value)}
                          placeholder="student@university.ac.ug"
                          required
                          className="h-10"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="login-password">Password</Label>
                          <button
                            type="button"
                            onClick={() => setMode("info")}
                            className="ml-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline cursor-pointer"
                          >
                            Need institutional credentials?
                          </button>
                        </div>

                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="h-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                      </div>

                      <Button type="submit" disabled={processing} className="w-full font-semibold">
                        {processing ? "Signing in..." : "Login"}
                      </Button>

                      {/* Divider: Or continue with */}
                      <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>

                      {/* Google (Official 4-Color Branding) and School ID Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoogleSignIn}
                          className="w-full gap-2.5 font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          >
                            <path
                              fill="#EA4335"
                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                              fill="#4285F4"
                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                              fill="#34A853"
                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                          </svg>
                          <span>Google</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setMode("school_id")}
                          className="w-full gap-2 font-medium"
                        >
                          <IdCard className="size-4 shrink-0" />
                          <span>School ID</span>
                        </Button>
                      </div>

                      {/* Quick-fill Demo Role Switcher */}
                      <div className="space-y-2 pt-1">
                        <p className="text-center text-[11px] font-medium text-muted-foreground">
                          Quick demo role credentials
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {DEMO_ACCOUNTS.map((account) => {
                            const Icon = account.icon;
                            const isSelected = data.email === account.email;
                            return (
                              <button
                                key={account.email}
                                type="button"
                                onClick={() => fillDemoAccount(account)}
                                title={`${account.label} (${account.email})`}
                                className={`flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[11px] font-medium transition cursor-pointer ${
                                  isSelected
                                    ? "border-primary bg-primary/15 text-foreground font-semibold"
                                    : "border-border/70 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <Icon className="size-3.5" />
                                <span className="truncate">{account.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Mode 2: School ID Lookup Form */}
                  {mode === "school_id" && (
                    <form onSubmit={handleSchoolIdContinue} className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="school-id-input">
                          Student Registration / University Staff ID
                        </Label>
                        <Input
                          id="school-id-input"
                          type="text"
                          value={schoolIdInput}
                          onChange={(e) => setSchoolIdInput(e.target.value)}
                          placeholder="e.g. 22/U/10428/PS or MAK-STF-004"
                          required
                          className="h-10 font-mono"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Demo IDs: <code className="text-foreground">22/U/10428/PS</code> (Student)
                          · <code className="text-foreground">SUP-TC-019</code> (Supervisor) ·{" "}
                          <code className="text-foreground">MAK-STF-004</code> (Admin)
                        </p>
                      </div>

                      <Button type="submit" className="w-full font-semibold">
                        Verify School ID
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMode("login")}
                        className="w-full"
                      >
                        Back to Email Login
                      </Button>
                    </form>
                  )}

                  {/* Mode 3: Institutional Access Info */}
                  {mode === "info" && (
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-foreground">
                        <Briefcase className="size-5" />
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Student accounts are linked to your university registration ID. Host
                        Organization Supervisors and Faculty Assessors receive pre-provisioned
                        credentials directly from the University Administration.
                      </p>
                      <Button
                        type="button"
                        onClick={() => setMode("login")}
                        className="w-full font-semibold"
                      >
                        Back to Login
                      </Button>
                    </div>
                  )}
                </div>

                {/* Bottom Institutional Footer */}
                <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <span>Accredited University &amp; Host Organization Portal</span>
                </div>
              </div>

              {/* Right Image Column (shadcn login-04 pattern with our 3D scene) */}
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/images/auth-3d-scene.jpg"
                  alt="InternTrack workspace illustration"
                  className="absolute inset-0 h-full w-full object-cover select-none"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-6 text-white">
                  <p className="font-display text-sm font-semibold">
                    Accredited Digital Logbook & Dual Supervision
                  </p>
                  <p className="mt-0.5 text-xs text-white/80">
                    Connecting Student Interns, Host Field Mentors, and University Faculty
                    Assessors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* login-04 Footer Notice */}
          <div className="text-balance text-center text-xs text-muted-foreground">
            By clicking continue, you agree to InternTrack&apos;s{" "}
            <button
              type="button"
              onClick={() => setMode("info")}
              className="underline underline-offset-4 hover:text-foreground cursor-pointer"
            >
              Institutional Policy
            </button>{" "}
            and{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              Terms of Service
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
