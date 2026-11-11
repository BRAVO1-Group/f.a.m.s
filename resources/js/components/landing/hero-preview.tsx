import { useState } from "react";
import {
  Award,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FileCheck2,
  Lock,
  MapPin,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type PreviewTab = "logbook" | "verification" | "attendance";

export function HeroPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("logbook");
  const [hasApproved, setHasApproved] = useState(false);

  return (
    <div className="relative mx-auto mt-12 sm:mt-16 max-w-5xl">
      {/* ── Ambient Multi-Color Radial Glow ── */}
      <div className="pointer-events-none absolute -inset-4 sm:-inset-8 rounded-[2.5rem] bg-gradient-to-r from-primary/30 via-accent/20 to-primary/20 blur-3xl opacity-75 -z-10" />

      {/* ── Floating Badge 1: Top Right (Dual Cryptographic Sign-Off) ── */}
      <div className="hidden lg:flex absolute -top-6 -right-6 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-2.5 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Dual Sign-Off Verified</span>
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] font-mono text-muted-foreground">SHA-256: 0x9f4a...e12b</p>
        </div>
      </div>

      {/* ── Floating Badge 2: Bottom Left (Geofence Clock-in) ── */}
      <div className="hidden md:flex absolute -bottom-6 -left-6 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-2.5 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Geofence Validated</span>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1 font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            >
              HQ Campus
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">Clock-in verified at 08:31 AM EAT</p>
        </div>
      </div>

      {/* ── Floating Badge 3: Bottom Right (Defense Dossier Export) ── */}
      <div className="hidden lg:flex absolute -bottom-6 -right-6 z-20 items-center gap-3 rounded-2xl border border-border/80 bg-card/90 px-4 py-2.5 shadow-elevated backdrop-blur-md transition-transform hover:-translate-y-1">
        <div className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
          <FileCheck2 className="size-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">Defense Dossier Ready</span>
            <span className="text-[10px] font-semibold text-primary">100% Complete</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Faculty rubric compiled (PDF / Word)</p>
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
              <span>app.interntrack.pro/workspace/alice-wanjiku</span>
            </div>
          </div>

          {/* Interactive Feature Preview Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-background/80 p-1 border border-border/60 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("logbook")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition",
                activeTab === "logbook"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <BookOpen className="size-3.5" />
              <span>Daily Log</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("verification")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition",
                activeTab === "verification"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <ShieldCheck className="size-3.5" />
              <span>Dual Sign-Off</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("attendance")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition",
                activeTab === "attendance"
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CalendarCheck className="size-3.5" />
              <span>Attendance</span>
            </button>
          </div>
        </div>

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
                    Student Intern
                  </Badge>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    • University of Nairobi (BSc Computer Science)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Host Org:{" "}
                  <strong className="text-foreground font-medium">TechCorp Kenya Ltd</strong>{" "}
                  (DevOps & Cloud Engineering Unit)
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[11px] text-muted-foreground">Progress Completion</span>
                <span className="font-bold text-foreground">328 / 400 Hours (82%)</span>
              </div>
              <div className="h-8 w-px bg-border/60 hidden sm:block" />
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[11px] text-muted-foreground">Clearance Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> On Track
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Today's Logbook Content */}
        {activeTab === "logbook" && (
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
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 border-emerald-500/20 text-xs">
                    Field Signed
                  </Badge>
                </div>

                <div className="rounded-xl border border-border/80 bg-background/60 p-4 sm:p-5 space-y-3">
                  <h4 className="font-semibold text-base text-foreground leading-snug">
                    Deployed Terraform Stacks for Multi-Region Failover & Automated Backup
                    Verification
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Configured state locking with DynamoDB and established AWS S3 bucket replication
                    for disaster recovery. Implemented GitHub Actions CI/CD pipeline triggering
                    automated security compliance scanning with Trivy and Checkov before terraform
                    apply.
                  </p>

                  {/* Code / Artifact Tag Snippet */}
                  <div className="rounded-lg bg-muted/60 p-3 font-mono text-xs text-foreground/80 overflow-x-auto border border-border/40">
                    <span className="text-primary font-bold">git commit -m</span> "feat(infra): add
                    resilient S3 replica policies & automated Trivy scanning hook"
                  </div>

                  {/* Skills / Competency Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground font-medium">Competencies:</span>
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

                {/* Supervisor Feedback Snapshot */}
                <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
                  <Avatar className="size-8 mt-0.5 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                      JO
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">James Otieno</span>
                      <span className="text-[11px] text-muted-foreground">
                        (Field Supervisor, TechCorp)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">10:45 AM</span>
                    </div>
                    <p className="text-muted-foreground leading-normal">
                      "Well-documented runbook and zero regression during failover simulation. Great
                      attention to security best practices."
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Weekly Summary & Milestone Meter */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Attachment Milestone
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
                      <span>Field Mentor Sign-offs</span>
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
                    Defense dossier auto-aggregates all 8 weeks with verified digital signatures for
                    academic panel review.
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

        {/* Tab 2: Dual Sign-off View */}
        {activeTab === "verification" && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-foreground">
                  Dual-Track Supervision Protocol
                </h4>
                <p className="text-xs text-muted-foreground">
                  Simultaneous verification from industry mentor and academic faculty supervisor.
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
              <div className="rounded-2xl border border-border/80 bg-background/60 p-5 space-y-4 relative overflow-hidden">
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
                    <span className="font-mono text-[10px] text-foreground">#7f9a8c...2026</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Approved & Signed for Week 8 Tasks</span>
                </div>
              </div>

              {/* University Faculty Assessor Card */}
              <div className="rounded-2xl border border-border/80 bg-background/60 p-5 space-y-4 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-accent/20 text-accent font-bold">
                      AK
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-foreground">Dr. Agnes Kimani</h5>
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
                  Interactive supervisor dispatch: Host mentors approve logs via one-click secure
                  links without complex account setup.
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

        {/* Tab 3: Attendance & Geofence View */}
        {activeTab === "attendance" && (
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
                      <span className="font-semibold text-foreground">Attendance Reliability</span>
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
    </div>
  );
}
