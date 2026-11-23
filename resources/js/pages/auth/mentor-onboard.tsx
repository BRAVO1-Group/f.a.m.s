import { useMemo, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { BrandLogo } from "@/components/ui/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MentorOnboardPage() {
  const { url } = usePage();

  const params = useMemo(() => {
    const query = url.split("?")[1] ?? "";
    const sp = new URLSearchParams(query);
    return {
      studentName: sp.get("student") || "Alice Wanjiku",
      studentReg: sp.get("reg") || "CS/2021/0042",
      studentCourse: sp.get("course") || "BSc. Computer Science (Year 3)",
      university: sp.get("uni") || "Makerere University",
      company: sp.get("company") || "TechCorp Solutions Uganda Ltd",
      department: sp.get("dept") || "Product Engineering",
      mentorName: sp.get("mentor") || "Eng. James Otieno",
      mentorEmail: sp.get("email") || "james.otieno@techcorp.co.ug",
      expectedOtp: sp.get("otp") || "OTP-849201",
    };
  }, [url]);

  const [step, setStep] = useState<"verify_otp" | "setup_account" | "completed">("verify_otp");
  const [otpInput, setOtpInput] = useState(params.expectedOtp);
  const [showPass, setShowPass] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: params.mentorName,
    jobTitle: "Lead Systems Architect",
    department: params.department,
    phone: "+256 701 884 310",
    email: params.mentorEmail,
    newPassword: "",
    confirmPassword: "",
  });

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpInput.trim()) {
      toast.error("Please enter the One-Time Password from your invitation link.");
      return;
    }
    setStep("setup_account");
    toast.success("One-Time Password Verified", {
      description: `Confirmed supervision assignment for ${params.studentName}. Please confirm your details and set your password.`,
    });
  }

  function handleRequestActivate(e: React.FormEvent) {
    e.preventDefault();
    if (profileForm.newPassword.length < 6) {
      toast.error("Please choose a password with at least 6 characters.");
      return;
    }
    if (profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error("Your new password and confirmation password do not match.");
      return;
    }
    setConfirmOpen(true);
  }

  function executeActivateAccount() {
    setConfirmOpen(false);
    setStep("completed");
    toast.success("Field Mentor Account Activated", {
      description: `You are now linked to supervise ${params.studentName} at ${params.company}.`,
    });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 sm:p-6 md:p-10 antialiased">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <BrandLogo variant="auto" size="md" />
          <Badge variant="secondary" className="font-mono text-xs">
            Field Mentor Invitation &amp; OTP Setup
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: Assigned Student Intern Context (Always Visible on the Link!) */}
          <Card className="lg:col-span-5 rounded-xl border border-border/60 bg-card">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-[11px]">
                  Assigned Student to Supervise
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {params.expectedOtp}
                </span>
              </div>
              <CardTitle className="mt-2 text-lg font-bold text-foreground">
                {params.studentName}
              </CardTitle>
              <CardDescription className="font-mono text-xs">
                {params.studentReg} · {params.studentCourse}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4 text-xs">
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <span>{params.university}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  This student confirmed an accepted internship placement at{" "}
                  <strong className="text-foreground">{params.company}</strong> and nominated you as
                  their workplace Field Mentor.
                </p>
              </div>

              <div className="space-y-2.5 border-t border-border/50 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Host Organization:</span>
                  <span className="font-semibold text-foreground">{params.company}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Department / Unit:</span>
                  <span className="font-medium text-foreground">{params.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Required Duration:</span>
                  <span className="font-mono font-medium text-foreground">60 Workplace Days</span>
                </div>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/60 p-3 space-y-1.5">
                <p className="font-semibold text-foreground">Your Role as Field Mentor:</p>
                <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                  <li>Verify daily workplace attendance &amp; shift hours</li>
                  <li>Comment on and sign off weekly logbook entries</li>
                  <li>Assess workplace conduct &amp; identify student strengths</li>
                  <li>Submit the Mid-Term and Final Field Mentor Grading Form</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT COLUMN: Step 1 (OTP Verification) -> Step 2 (Details & Change Password) */}
          <Card className="lg:col-span-7 rounded-xl border border-border/60 bg-card">
            {step === "verify_otp" && (
              <>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <KeyRound className="size-5 text-primary" />
                    Step 1: Verify One-Time Password (OTP)
                  </CardTitle>
                  <CardDescription>
                    Enter the One-Time Password dispatched by the University Admin to{" "}
                    <strong className="text-foreground">{params.mentorEmail}</strong> to unlock your
                    supervisory setup.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="otp-input">One-Time Password (OTP)</Label>
                      <Input
                        id="otp-input"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="e.g. OTP-849201"
                        className="h-10 font-mono text-sm"
                        required
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Pre-filled from your secure invitation link (<code>{params.expectedOtp}</code>
                        ).
                      </p>
                    </div>

                    <Button type="submit" className="w-full font-semibold">
                      Verify OTP &amp; Continue to Account Setup
                    </Button>
                  </form>
                </CardContent>
              </>
            )}

            {step === "setup_account" && (
              <>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <UserCheck className="size-5 text-primary" />
                    Step 2: Confirm Details &amp; Set Your Password
                  </CardTitle>
                  <CardDescription>
                    Confirm your workplace details at <strong>{params.company}</strong> and replace
                    the One-Time Password with a permanent password comfortable for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <form onSubmit={handleRequestActivate} className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Your Full Name</Label>
                        <Input
                          value={profileForm.fullName}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, fullName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Job Title / Position</Label>
                        <Input
                          value={profileForm.jobTitle}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, jobTitle: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Official Email (Username)</Label>
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Phone Number</Label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-3 space-y-3">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Lock className="size-3.5" />
                        Change One-Time Password to Your Preferred Password
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label>New Password</Label>
                          <div className="relative">
                            <Input
                              type={showPass ? "text" : "password"}
                              value={profileForm.newPassword}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, newPassword: e.target.value })
                              }
                              placeholder="Choose a strong password"
                              className="pr-9"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPass((v) => !v)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              {showPass ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label>Confirm New Password</Label>
                          <Input
                            type={showPass ? "text" : "password"}
                            value={profileForm.confirmPassword}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Re-enter your new password"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("verify_otp")}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="font-semibold">
                        Save Password &amp; Activate Supervision
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </>
            )}

            {step === "completed" && (
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-foreground">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Field Mentor Account Activated
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Welcome, <strong>{profileForm.fullName}</strong>. Your custom password has been
                    saved and you are now actively paired to supervise{" "}
                    <strong>{params.studentName}</strong> ({params.studentReg}) at{" "}
                    <strong>{params.company}</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => router.visit("/login")}
                    className="font-semibold"
                  >
                    Proceed to Field Mentor Sign In
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard">Return to Portal</Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Yes / No Confirmation Dialog before activating Field Mentor account */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Student Supervision & Save New Password?"
        description={
          <>
            Are you sure you want to activate your Field Mentor account as{" "}
            <strong>{profileForm.fullName}</strong> ({profileForm.email}) and accept workplace
            supervision responsibility for <strong>{params.studentName}</strong> (
            {params.studentReg}) at <strong>{params.company}</strong>?
          </>
        }
        confirmLabel="Yes, Activate & Supervise"
        cancelLabel="No, Edit Details"
        onConfirm={executeActivateAccount}
      />
    </div>
  );
}
