import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STAGES = [
  {
    step: "01",
    title: "Placement & Supervisor Pairing",
    tag: "Pre-Attachment",
    description:
      "Student uploads placement letter. Host organization mentors receive automated zero-friction invitation links with no software installation required.",
    deliverables: [
      "Tripartite Attachment Agreement",
      "Pre-provisioned supervisor credentials",
      "Learning outcome blueprint",
    ],
    icon: UserCheck,
  },
  {
    step: "02",
    title: "Continuous Logging & Geofencing",
    tag: "Weeks 1 — 6",
    description:
      "Daily activity logging with code attachments and competency tags. Geofenced smart clock-in validates physical presence at company premises.",
    deliverables: [
      "Cryptographic daily timestamping",
      "50m perimeter GPS verification",
      "Live milestone progress bar",
    ],
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "Dual-Track Assessment & Visitations",
    tag: "Midterm Evaluation",
    description:
      "Field mentors sign off on weekly achievements. Visiting university faculty assessors conduct evaluations directly within the standardized rubric.",
    deliverables: [
      "Weekly supervisor feedback loops",
      "On-site visitation scoring rubric",
      "Early warning flag detection",
    ],
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Defense Dossier & Faculty Clearance",
    tag: "Graduation Clearance",
    description:
      "InternTrack auto-compiles all verified entries, attendance tallies, and dual sign-offs into a defense-ready academic dossier for panel defense.",
    deliverables: [
      "Standardized CUE/ABET dossier export",
      "Dual digital signature stamps",
      "Permanent institutional archive",
    ],
    icon: GraduationCap,
  },
];

export function LifecycleJourney() {
  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 bg-muted/20 border-y border-border/70 relative"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16 sm:mb-20">
          <Badge
            variant="outline"
            className="mb-3.5 px-3 py-1 text-xs font-semibold tracking-wide border-primary/30 text-primary bg-primary/5 uppercase"
          >
            End-to-End Workflow
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            From onboarding day to final defense clearance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            A cohesive 4-stage journey that eliminates paper chasing and ensures compliance at every
            academic milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STAGES.map((stage, idx) => (
            <div
              key={stage.step}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-card hover:border-primary/40 hover:shadow-elevated transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors">
                    {stage.step}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono border-primary/30 text-primary"
                  >
                    {stage.tag}
                  </Badge>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <stage.icon className="size-5" />
                </div>

                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {stage.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {stage.description}
                </p>
              </div>

              {/* Deliverables list */}
              <div className="pt-4 border-t border-border/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Key Milestones
                </span>
                <ul className="space-y-1.5 text-xs text-foreground/80">
                  {stage.deliverables.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
