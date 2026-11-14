import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { GraduationCap, Info, KeyRound, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-10 antialiased">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur shadow-xs">
            <GraduationCap className="size-5 text-white" />
          </div>

          <span className="font-display text-xl font-bold text-white tracking-tight">
            InternTrack
          </span>
        </Link>

        <Card className="shadow-elevated border-border/80">
          {/* Header */}
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
              <KeyRound className="size-5.5" />
            </div>

            <CardTitle className="text-2xl font-bold font-display">
              Attachment Portal Authentication
            </CardTitle>

            <CardDescription className="text-xs max-w-md mx-auto">
              Sign in using the institutional email address and password associated with your
              account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => setActiveTab(v as "login" | "register")}
              className="w-full"
            >
              {/* Tabs */}
              <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-muted/60 rounded-xl mb-4">
                <TabsTrigger value="login" className="text-xs font-semibold rounded-lg">
                  <KeyRound className="mr-1.5 size-3.5" />
                  Sign In
                </TabsTrigger>

                <TabsTrigger value="register" className="text-xs font-semibold rounded-lg">
                  <Lock className="mr-1.5 size-3.5" />
                  New Registration
                </TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent value="login" className="space-y-4 mt-0">
                {/* Account notice */}
                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-foreground/90 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <Info className="size-4 shrink-0" />
                    <span>Institutional Account Access</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Students can register for their accounts. Host Organization Supervisors and
                    Faculty Assessors receive their credentials from the University Administration.
                  </p>
                </div>

                {/* Login form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-xs font-semibold">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

                      <input
                        id="login-email"
                        type="email"
                        autoComplete="username"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Enter your institutional email"
                        required
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>

                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-xs font-semibold">
                      Password
                    </label>

                    <input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />

                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>

                  {/* Remember me */}
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData("remember", e.target.checked)}
                      className="rounded"
                    />
                    Remember me
                  </label>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full text-xs font-semibold h-10"
                  >
                    {processing ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* REGISTRATION TAB */}
              <TabsContent value="register" className="space-y-4 mt-0">
                <Alert
                  variant="destructive"
                  className="border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-200 rounded-xl"
                >
                  <Lock className="size-4 text-amber-600" />

                  <AlertTitle className="font-semibold text-sm">
                    Registration Restrictions
                  </AlertTitle>

                  <AlertDescription className="text-xs mt-1 text-muted-foreground leading-relaxed">
                    Students can create their own accounts. Host Organization Supervisors,
                    Organization Administrators and University Administrators must receive accounts
                    through authorized institutional provisioning.
                  </AlertDescription>
                </Alert>

                <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
                  <p className="font-semibold text-foreground">How institutional accounts work:</p>

                  <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
                    <li>
                      <strong>Students:</strong> Can create accounts through the student
                      registration process.
                    </li>

                    <li>
                      <strong>Supervisors:</strong> Accounts are created by University
                      Administrators after placement confirmation.
                    </li>

                    <li>
                      <strong>Organization Administrators:</strong> Accounts are provisioned by
                      authorized University Administrators.
                    </li>

                    <li>
                      <strong>University Administrators:</strong> Accounts are provisioned by
                      authorized System Administrators.
                    </li>
                  </ul>
                </div>

                <Button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="w-full text-xs font-semibold h-9"
                >
                  Return to Sign In
                </Button>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <p className="pt-2 text-center text-[11px] text-muted-foreground border-t border-border/60">
              InternTrack Multi-Tenant Attachment & Industrial Training System
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
