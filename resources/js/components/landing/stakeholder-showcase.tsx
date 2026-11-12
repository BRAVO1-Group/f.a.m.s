import { useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Laptop,
  QrCode,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Stakeholder = "universities" | "employers" | "students";

export function StakeholderShowcase() {
  const [active, setActive] = useState<Stakeholder>("universities");

  return (
    <section id="roles" className="py-20 sm:py-28 relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          <Badge
            variant="outline"
            className="mb-3.5 px-3 py-1 text-xs font-semibold tracking-wide border-primary/30 text-primary bg-primary/5 uppercase"
          >
            Tailored Experiences
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Built specifically for all 3 stakeholders.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eliminating miscommunication between academia, workplace hosts, and students.
          </p>

          {/* Interactive Role Tabs */}
          <div className="mt-8 inline-flex items-center rounded-2xl bg-muted/60 p-1.5 border border-border/80">
            <button
              type="button"
              onClick={() => setActive("universities")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all",
                active === "universities"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <GraduationCap className="size-4 text-primary" />
              <span>Universities & Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => setActive("employers")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all",
                active === "employers"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Building2 className="size-4 text-accent" />
              <span>Host Organizations</span>
            </button>
            <button
              type="button"
              onClick={() => setActive("students")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all",
                active === "students"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Laptop className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Student Interns</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Universities & Faculty */}
        {active === "universities" && (
          <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-10 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Academic Governance & Accreditation
              </Badge>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                Full programmatic visibility without hunting down physical booklets.
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Faculty coordinators and Deans can monitor hundreds of students placed across dozens
                of industries in real time. Flag inactive students, track supervisor visitations,
                and standardize grading rubrics.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Standardized CUE & TVETA curriculum alignment",
                  "Automated early-warning flags for at-risk placements",
                  "1-Click institutional defense dossiers (PDF/Word)",
                  "Permanent digital archiving for accreditation audits",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-muted/40 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-border/60 pb-3">
                <span className="font-semibold text-foreground">Faculty Allocation Matrix</span>
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-primary border-primary/30"
                >
                  UoN Computing
                </Badge>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: "Dr. Agnes Kimani", interns: 12, visits: "100%", status: "Compliant" },
                  { name: "Prof. David Mutua", interns: 15, visits: "93%", status: "Compliant" },
                  { name: "Dr. Grace Ochieng", interns: 9, visits: "78%", status: "Visit Pending" },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl bg-card p-3 border border-border/50 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {row.interns} Assigned Interns
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{row.visits} Verified</p>
                      <span
                        className={cn(
                          "text-[10px] font-semibold",
                          row.status === "Compliant"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Average Faculty Review Turnaround:</span>
                <span className="font-bold text-primary">18.4 Hours</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Host Organizations */}
        {active === "employers" && (
          <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-10 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-accent/15 text-accent-foreground border-accent/25 text-xs">
                Frictionless Mentorship
              </Badge>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                Review and sign off on intern tasks in 60 seconds.
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Field mentors are busy building products and running departments. InternTrack
                eliminates paper logbook piles by sending automated digest summaries with one-click
                approval buttons directly to their inbox.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Zero complex software installation or IT setup",
                  "Structured competency rating with 5-star rubric",
                  "Automated weekly digest with one-click sign-off",
                  "Verified time records ready for corporate HR stipends",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-muted/40 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-border/60 pb-3">
                <span className="font-semibold text-foreground">Field Mentor Quick Approval</span>
                <Badge variant="outline" className="text-xs text-accent border-accent/30">
                  Weekly Digest
                </Badge>
              </div>

              <div className="rounded-xl bg-card p-4 border border-border/50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Alice Wanjiku (Week 8)</span>
                  <span className="font-mono text-[10px] text-muted-foreground">40 hrs logged</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  "Tasks completed: Terraform multi-zone failover, Kubernetes node autoscaler
                  tuning, and Trivy security hooks."
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                  <span className="rounded-lg bg-emerald-600 text-white px-3 py-1 text-xs font-semibold">
                    ✓ Sign & Approve
                  </span>
                  <span className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground">
                    Request Revision
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Student Interns */}
        {active === "students" && (
          <div className="rounded-3xl border border-border/80 bg-card p-7 sm:p-10 shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                Student-Centric Career Growth
              </Badge>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                Turn daily attachment tasks into a verified professional portfolio.
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Log activities easily from any mobile device, receive instant supervisor feedback,
                and walk into your final academic defense with an undeniable, pre-approved digital
                dossier.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Mobile-responsive logging with offline sync support",
                  "Real-time progress tracker towards graduation hours",
                  "Rich skill tagging that translates into CV bullet points",
                  "Zero lost signatures or last-minute panic before defense",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-border/70 bg-muted/40 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-border/60 pb-3">
                <span className="font-semibold text-foreground">Student Defense Readiness</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                  Defense Ready
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-card p-3 border border-border/50 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-foreground">Required Attachment Hours</p>
                    <p className="text-[11px] text-muted-foreground">CUE 400-hour minimum</p>
                  </div>
                  <span className="font-bold text-primary">328 / 400 (82%)</span>
                </div>

                <div className="rounded-xl bg-card p-3 border border-border/50 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-foreground">Field Supervisor Approval</p>
                    <p className="text-[11px] text-muted-foreground">Weeks 1 through 8</p>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    100% Signed
                  </span>
                </div>

                <div className="rounded-xl bg-card p-3 border border-border/50 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-foreground">Faculty Midterm Visit</p>
                    <p className="text-[11px] text-muted-foreground">Rubric Grade</p>
                  </div>
                  <span className="font-bold text-accent">Grade A (94%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
