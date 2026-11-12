import { useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  MapPin,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RolePerspective = "student" | "supervisor" | "university";
type StudentSubTab = "logbook" | "verification" | "attendance";

export function HeroPreview() {
  const [rolePerspective, setRolePerspective] = useState<RolePerspective>("student");
  const [studentTab, setStudentTab] = useState<StudentSubTab>("logbook");
  const [hasApproved, setHasApproved] = useState(false);
  const [entrySubmitted, setEntrySubmitted] = useState(false);
  const [dossierExported, setDossierExported] = useState(false);
  const [showLiveScreenshot, setShowLiveScreenshot] = useState(false);

  function getCurrentScreenshot() {
    if (rolePerspective === "student") {
      if (studentTab === "logbook") return { src: "/screenshots/logbook.png", label: "Student Technical Daily Logbook" };
      if (studentTab === "attendance") return { src: "/screenshots/attendance.png", label: "GPS Attendance & Geofence Station" };
      return { src: "/screenshots/dashboard.png", label: "Student Executive Hub" };
    }
    if (rolePerspective === "supervisor") {
      return { src: "/screenshots/review.png", label: "Host Org Field Supervisor Review & 1-Tap Sign-Off" };
    }
    return { src: "/screenshots/evaluations.png", label: "Faculty Dean Evaluation & Scoring Rubric" };
  }

  return (
    <div id="preview-sandbox" className="relative mx-auto mt-12 sm:mt-16 max-w-5xl">
      {/* ── Ambient Multi-Color Radial Glow ── */}
      <div className="pointer-events-none absolute -inset-4 sm:-inset-10 rounded-[3rem] bg-gradient-to-r from-primary/30 via-emerald-500/20 to-accent/25 blur-3xl opacity-80 -z-10" />

      {/* ── Perspective Selector Header ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Interactive Product Sandbox
          </span>
        </div>

        {/* Stakeholder Switcher Buttons */}
        <div className="inline-flex items-center rounded-2xl bg-muted/80 p-1 border border-border/80 backdrop-blur-md shadow-2xs">
          <button
            type="button"
            onClick={() => setRolePerspective("student")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
              rolePerspective === "student"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <GraduationCap className="size-3.5 text-primary" />
            <span>Student View</span>
          </button>
          <button
            type="button"
            onClick={() => setRolePerspective("supervisor")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
              rolePerspective === "supervisor"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Building2 className="size-3.5 text-accent" />
            <span>Host Mentor</span>
          </button>
          <button
            type="button"
            onClick={() => setRolePerspective("university")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
              rolePerspective === "university"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Award className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Faculty Dean</span>
          </button>
        </div>
      </div>

      {/* ── Floating Badge 1: Top Right (Dual Cryptographic Sign-Off) ── */}
      <div className="hidden lg:flex absolute -top-5 -right-6 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-2.5 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Dual Sign-Off Sealed</span>
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] font-mono text-muted-foreground">SHA-256: 0x9f4a...e12b</p>
        </div>
      </div>

      {/* ── Floating Badge 2: Bottom Left (Geofence Clock-in) ── */}
      <div className="hidden md:flex absolute -bottom-5 -left-6 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-2.5 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">50m Geofence Validated</span>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1 font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            >
              Nairobi HQ
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">Clock-in verified at 08:31 AM EAT</p>
        </div>
      </div>

      {/* ── Floating Badge 3: Bottom Right (Defense Dossier Export) ── */}
      <div className="hidden lg:flex absolute -bottom-5 -right-6 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-2.5 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
          <FileCheck2 className="size-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Defense Dossier</span>
            <span className="text-[10px] font-semibold text-primary">Ready to Export</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Standardized CUE Rubric Format</p>
        </div>
      </div>

      {/* ── Main Glassmorphism Dashboard Window ── */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 shadow-elevated backdrop-blur-xl transition-all">
        {/* Window Chrome Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-muted/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-[#ef4444]/80 inline-block" />
              <span className="size-3 rounded-full bg-[#f59e0b]/80 inline-block" />
              <span className="size-3 rounded-full bg-[#10b981]/80 inline-block" />
            </div>
            <div className="ml-3 hidden sm:flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
              <Lock className="size-3 text-emerald-500" />
              <span>
                {rolePerspective === "student" && "app.interntrack.pro/student/alice-wanjiku"}
                {rolePerspective === "supervisor" && "app.interntrack.pro/mentor/james-otieno"}
                {rolePerspective === "university" && "app.interntrack.pro/faculty/uon-dean"}
              </span>
            </div>
          </div>

          {/* Student Sub-tab Switcher (only shown if Student View is selected) */}
          {rolePerspective === "student" ? (
            <div className="flex items-center gap-1 rounded-xl bg-background/80 p-1 border border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setStudentTab("logbook")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition",
                  studentTab === "logbook"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <BookOpen className="size-3.5" />
                <span>Daily Log</span>
              </button>
              <button
                type="button"
                onClick={() => setStudentTab("verification")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition",
                  studentTab === "verification"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ShieldCheck className="size-3.5" />
                <span>Dual Sign-Off</span>
              </button>
              <button
                type="button"
                onClick={() => setStudentTab("attendance")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition",
                  studentTab === "attendance"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <CalendarCheck className="size-3.5" />
                <span>Attendance</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLiveScreenshot(!showLiveScreenshot)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition border",
                  showLiveScreenshot
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-xs"
                    : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground",
                )}
              >
                <Sparkles className="size-3 text-emerald-500" />
                <span>{showLiveScreenshot ? "Screenshot Active" : "Live Dashboard View"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLiveScreenshot(!showLiveScreenshot)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition border",
                  showLiveScreenshot
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-xs"
                    : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground",
                )}
              >
                <Sparkles className="size-3 text-emerald-500" />
                <span>{showLiveScreenshot ? "Screenshot Active" : "Live Dashboard View"}</span>
              </button>
              <Badge
                variant="outline"
                className="text-xs font-mono text-primary border-primary/30 hidden sm:inline-flex"
              >
                {rolePerspective === "supervisor" ? "Host Org Dashboard" : "Dean's Faculty Console"}
              </Badge>
            </div>
          )}
        </div>

        {/* ── Optional Full Actual Dashboard Screenshot Mode ── */}
        {showLiveScreenshot && (
          <div className="p-5 sm:p-7 space-y-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground">{getCurrentScreenshot().label}</span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Pixel-Perfect App Capture
              </Badge>
            </div>
            <div className="relative rounded-2xl border border-border/80 overflow-hidden shadow-2xl bg-black/40">
              <img
                src={getCurrentScreenshot().src}
                alt={getCurrentScreenshot().label}
                className="w-full h-auto object-cover max-h-[520px] transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>
        )}

        {/* ── Perspective 1: STUDENT VIEW ── */}
        {rolePerspective === "student" && (
          <div>
            {/* Intern Header Profile Strip */}
            <div className="border-b border-border/60 bg-card/60 px-5 py-3.5 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border border-primary/20 shadow-xs">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      AW
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">Alice Wanjiku</h3>
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 border-primary/30 text-primary font-semibold"
                      >
                        Tier 1 Intern
                      </Badge>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        • UoN BSc Computer Science
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Host Org:{" "}
                      <strong className="text-foreground font-medium">TechCorp Kenya Ltd</strong>{" "}
                      (DevOps Engineering)
                    </p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[11px] text-muted-foreground">Logged Hours</span>
                    <span className="font-bold text-foreground">328 / 400 Hours (82%)</span>
                  </div>
                  <div className="h-8 w-px bg-border/60 hidden sm:block" />
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[11px] text-muted-foreground">Clearance Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Defense On Track
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tab 1: Today's Logbook Content */}
            {studentTab === "logbook" && (
              <div className="p-5 sm:p-7 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Active Log Entry */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Today's Verified Log Entry • Week 8, Day 4
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs transition-colors",
                          entrySubmitted
                            ? "bg-primary text-primary-foreground"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                        )}
                      >
                        {entrySubmitted ? "Queued for Mentor Sign-Off" : "Field Signed"}
                      </Badge>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-background/60 p-4 sm:p-5 space-y-3">
                      <h4 className="font-semibold text-base text-foreground leading-snug">
                        Deployed Terraform Stacks for Multi-Region Failover & Automated Backup
                        Verification
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Configured state locking with DynamoDB and established AWS S3 bucket
                        replication for disaster recovery. Implemented GitHub Actions CI/CD pipeline
                        triggering automated security compliance scanning with Trivy and Checkov
                        before terraform apply.
                      </p>

                      {/* Code / Artifact Tag Snippet */}
                      <div className="rounded-lg bg-muted/60 p-3 font-mono text-xs text-foreground/80 overflow-x-auto border border-border/40">
                        <span className="text-primary font-bold">git commit -m</span> "feat(infra):
                        add resilient S3 replica policies & automated Trivy scanning hook"
                      </div>

                      {/* Skills / Competency Chips */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          Competencies:
                        </span>
                        {[
                          "#CloudInfrastructure",
                          "#Terraform",
                          "#CICDPipelines",
                          "#SecurityAuditing",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Submit/Simulate Bar */}
                    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary shrink-0" />
                        <span className="text-foreground">
                          {entrySubmitted
                            ? "✓ Entry timestamped & synced to host supervisor's review queue."
                            : "Students draft daily technical activities and dispatch with 1-click."}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setEntrySubmitted(!entrySubmitted)}
                        className="h-8 text-xs font-semibold px-3"
                      >
                        {entrySubmitted ? "Reset Entry" : "Simulate Submit"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Weekly Summary & Milestone Meter */}
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Attachment Progress
                      </h5>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Logbook Submissions</span>
                          <span className="font-bold text-foreground">38 / 40 Days</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>Mentor Weekly Sign-offs</span>
                          <span className="font-bold text-foreground">100% Up to Date</span>
                        </div>
                        <Progress
                          value={100}
                          className="h-2 bg-emerald-500/20 [&>div]:bg-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Institutional Defence Card */}
                    <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Award className="size-4 text-accent" />
                        <span>Faculty Defense Clearance</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Defense dossier auto-aggregates all 8 weeks with verified digital signatures
                        for academic panel review.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge
                          variant="outline"
                          className="text-[11px] font-mono text-primary border-primary/30"
                        >
                          Rubric Grade: A (92%)
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Dual Sign-off View */}
            {studentTab === "verification" && (
              <div className="p-5 sm:p-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base text-foreground">
                      Dual-Track Supervision Protocol
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Simultaneous verification from industry mentor and academic faculty
                      supervisor.
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  >
                    Institutional Standard Enforced
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Host Org Field Supervisor Card */}
                  <div className="rounded-2xl border border-border/80 bg-background/60 p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                          JO
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-foreground">James Otieno</h5>
                          <p className="text-xs text-muted-foreground">
                            Lead Cloud Architect • TechCorp Kenya
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                        Industry Mentor
                      </Badge>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Task Accuracy & Autonomy</span>
                        <span className="font-bold text-foreground">5 / 5 ★★★★★</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Punctuality & Workplace Ethics</span>
                        <span className="font-bold text-foreground">5 / 5 ★★★★★</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Field Verification Hash</span>
                        <span className="font-mono text-[10px] text-foreground">
                          #7f9a8c...2026
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>Approved & Signed for Week 8 Tasks</span>
                    </div>
                  </div>

                  {/* University Faculty Assessor Card */}
                  <div className="rounded-2xl border border-border/80 bg-background/60 p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-accent/20 text-accent font-bold">
                          AK
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-foreground">
                            Dr. Agnes Kimani
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Faculty Assessor • University of Nairobi
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent/15 text-accent-foreground border-accent/25 text-xs">
                        Academic Assessor
                      </Badge>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Academic Alignment (CUE Std)</span>
                        <span className="font-bold text-foreground">Exceeds Expectations</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>On-Site Visitation Assessment</span>
                        <span className="font-bold text-foreground">Completed (Week 6)</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Midterm Evaluation Rubric</span>
                        <span className="font-bold text-foreground">94 / 100</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>Accreditation Audit Confirmed</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Sign-off action demonstration */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-4 text-primary shrink-0" />
                    <span className="text-foreground">
                      Host mentors approve logs via one-click secure links without complex account
                      setup.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasApproved(!hasApproved)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0",
                      hasApproved
                        ? "bg-emerald-600 text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    {hasApproved ? "✓ Digital Signature Sealed" : "Simulate Instant Sign-off"}
                  </button>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Attendance & Geofence View */}
            {studentTab === "attendance" && (
              <div className="p-5 sm:p-7 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-foreground">
                        Anti-Fraud Geofenced Attendance
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-xs font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      >
                        Radius: 50m • Precision: 99.8%
                      </Badge>
                    </div>

                    {/* Simulated Map Visual */}
                    <div className="relative rounded-2xl border border-border/80 bg-muted/40 p-6 overflow-hidden flex flex-col items-center justify-center min-h-[200px] text-center">
                      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="relative">
                          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <MapPin className="size-5 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            TechCorp Kenya Headquarters
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            Latitude: -1.2612 • Longitude: 36.8044 (Westlands, Nairobi)
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                          Device Inside Designated Internship Perimeter
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                        <span className="text-[11px] text-muted-foreground">Clock-in Time</span>
                        <p className="font-bold text-foreground text-sm mt-0.5">08:31 AM</p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                        <span className="text-[11px] text-muted-foreground">Clock-out Time</span>
                        <p className="font-bold text-foreground text-sm mt-0.5">05:04 PM</p>
                      </div>
                      <div className="rounded-xl border border-border/60 bg-background/60 p-3">
                        <span className="text-[11px] text-muted-foreground">Effective Hours</span>
                        <p className="font-bold text-primary text-sm mt-0.5">8.5 hrs</p>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Breakdown */}
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        8-Week Attendance Record
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Verified Days Present</span>
                          <span className="font-bold text-foreground">38 Days</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Authorized Academic Leave</span>
                          <span className="font-bold text-foreground">2 Days</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Unexcused Absences</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            0 Days
                          </span>
                        </div>
                        <div className="flex justify-between text-xs pt-1 border-t border-border/60">
                          <span className="font-semibold text-foreground">
                            Attendance Reliability
                          </span>
                          <span className="font-bold text-primary">100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <QrCode className="size-4 text-primary" />
                        <span>Dynamic QR Kiosk Ready</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Host organizations can project rotating QR tokens on company displays for
                        contactless verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Perspective 2: HOST SUPERVISOR VIEW ── */}
        {rolePerspective === "supervisor" && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h4 className="font-bold text-base text-foreground">
                  Host Organization Mentorship Console
                </h4>
                <p className="text-xs text-muted-foreground">
                  James Otieno • Lead Cloud Architect, TechCorp Kenya Ltd (3 Assigned Interns)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-8 text-xs font-semibold gap-1.5">
                  <Check className="size-3.5" /> 1-Click Batch Approve
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Review Queue Column */}
              <div className="md:col-span-2 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pending Task Verifications
                </h5>

                {[
                  {
                    name: "Alice Wanjiku",
                    title: "Kubernetes Auto-Scaler Tuning & Trivy Vulnerability Audit",
                    time: "Today • 4.5 hrs",
                    tags: ["#K8s", "#DevOps", "#Security"],
                    status: "Pending Review",
                  },
                  {
                    name: "Brian Ochieng",
                    title: "Redis Cluster Sharding & Pub/Sub Benchmark Testing",
                    time: "Yesterday • 8.0 hrs",
                    tags: ["#Database", "#Redis", "#Caching"],
                    status: "Pending Review",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">{item.name}</span>
                      <span className="font-mono text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-xs font-semibold transition"
                        >
                          ✓ Sign Off
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Competency Rubric */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Intern Evaluation Rubric
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technical Aptitude</span>
                      <span className="font-bold text-foreground">5 / 5 ★★★★★</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initiative & Teamwork</span>
                      <span className="font-bold text-foreground">5 / 5 ★★★★★</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Code Quality</span>
                      <span className="font-bold text-foreground">4.8 / 5 ★★★★★</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/40 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ All ratings synchronized with University Assessor
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Sparkles className="size-4 text-primary" />
                    <span>Zero Login Friction</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Supervisors receive weekly email digests and can approve logs directly without
                    remembering passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Perspective 3: UNIVERSITY FACULTY VIEW ── */}
        {rolePerspective === "university" && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h4 className="font-bold text-base text-foreground">
                  Faculty Industrial Attachment Portal
                </h4>
                <p className="text-xs text-muted-foreground">
                  University of Nairobi • School of Computing & Informatics (Semester 2 Cohort)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setDossierExported(!dossierExported)}
                  className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground"
                >
                  <Download className="size-3.5" />
                  {dossierExported ? "Dossier Compiled (PDF)" : "Export Defense Dossier"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground">Placed Interns</span>
                <p className="text-2xl font-bold text-foreground">412 Students</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Across 86 Host Orgs
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground">Faculty Visitations</span>
                <p className="text-2xl font-bold text-foreground">94.2%</p>
                <span className="text-[10px] text-primary font-medium">388 / 412 Completed</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-1">
                <span className="text-[11px] text-muted-foreground">Audit Flags</span>
                <p className="text-2xl font-bold text-foreground">0 Critical</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  CUE & TVETA Compliant
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                <span className="font-bold text-foreground">
                  Active Cohort Placement Roster (Sample)
                </span>
                <span className="text-muted-foreground font-mono">
                  Real-time GPS & Verification Status
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  {
                    name: "Alice Wanjiku",
                    host: "TechCorp Kenya",
                    hours: "328/400 hrs",
                    grade: "92% (Grade A)",
                    status: "Compliant",
                  },
                  {
                    name: "Brian Ochieng",
                    host: "Safaricom PLC",
                    hours: "340/400 hrs",
                    grade: "88% (Grade A)",
                    status: "Compliant",
                  },
                  {
                    name: "Faith Chebet",
                    host: "Equity Group",
                    hours: "310/400 hrs",
                    grade: "90% (Grade A)",
                    status: "Compliant",
                  },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-lg bg-card p-2.5 border border-border/40"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-[10px] text-muted-foreground">{row.host}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-foreground">{row.hours}</p>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.grade} • {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
