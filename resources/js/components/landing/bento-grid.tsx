import {
  Award,
  BookOpen,
  CheckCircle2,
  Cpu,
  FileCheck2,
  FileText,
  Fingerprint,
  GraduationCap,
  Layers,
  Lock,
  MapPin,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function BentoGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-14 sm:mb-18">
          <Badge
            variant="outline"
            className="mb-3.5 px-3 py-1 text-xs font-semibold tracking-wide border-primary/30 text-primary bg-primary/5 uppercase"
          >
            Core Architecture
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Engineered to replace paper logbooks forever.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every feature is purpose-built to solve real-world friction between interns, company
            mentors, and university defense boards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ── 1. Digital Logbook (Spans 2 columns on lg) ── */}
          <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-card/80 p-7 sm:p-9 shadow-card hover:border-primary/40 transition-all hover:shadow-elevated relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                >
                  Tamper-Evident SHA-256
                </Badge>
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground">
                Continuous Proof-of-Work Digital Logbook
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                Students document daily technical tasks, code commits, and challenges with automatic
                timestamping. No more retroactive backdating or lost physical booklets.
              </p>
            </div>

            {/* Interactive Mock Log Preview inside Bento */}
            <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-4.5 space-y-3 relative z-10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
                <span className="font-mono text-foreground font-semibold">
                  ENTRY #042 • Thursday, Week 8
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3.5" /> Mentor Verified
                </span>
              </div>
              <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                "Configured multi-zone VPC peering with route table convergence and implemented
                automated Canary deployment rollouts using ArgoCD."
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 font-medium">
                  #CloudArchitecture
                </span>
                <span className="rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 font-medium">
                  #Kubernetes
                </span>
                <span className="rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 font-medium">
                  #ArgoCD
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all" />
          </div>

          {/* ── 2. Geofenced Smart Attendance ── */}
          <div className="rounded-3xl border border-border/80 bg-card/80 p-7 sm:p-9 shadow-card hover:border-primary/40 transition-all hover:shadow-elevated relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                  <MapPin className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-mono text-primary border-primary/30"
                >
                  GPS & Dynamic QR
                </Badge>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground">Geofenced Clock-In</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Students check in within a verified 50-meter host office geofence. Eliminates
                attendance fraud and buddy clocking.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-4 space-y-2.5 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Location Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Inside Perimeter
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Office Target</span>
                <span className="font-mono text-foreground font-semibold">TechCorp Westlands</span>
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">GPS Accuracy</span>
                <span className="font-bold text-primary">± 3.2 meters</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full bg-accent/15 blur-2xl" />
          </div>

          {/* ── 3. Dual-Track Supervision ── */}
          <div className="rounded-3xl border border-border/80 bg-card/80 p-7 sm:p-9 shadow-card hover:border-primary/40 transition-all hover:shadow-elevated relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-5" />
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                >
                  Synchronous Review
                </Badge>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground">
                Dual-Track Supervision
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Connects on-site industry mentors and visiting university faculty into a concurrent
                review loop with distinct permissions.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 relative z-10">
              <div className="rounded-xl border border-border/60 bg-background/80 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-foreground">Industry Mentor</span>
                </div>
                <span className="text-muted-foreground">Weekly Technical Sign-Off</span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/80 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent" />
                  <span className="font-medium text-foreground">Faculty Assessor</span>
                </div>
                <span className="text-muted-foreground">Academic Rubric Grading</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full bg-emerald-500/10 blur-2xl" />
          </div>

          {/* ── 4. Defense-Ready Dossier Compiler ── */}
          <div className="rounded-3xl border border-border/80 bg-card/80 p-7 sm:p-9 shadow-card hover:border-primary/40 transition-all hover:shadow-elevated relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileCheck2 className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  1-Click Export
                </Badge>
              </div>

              <h3 className="font-display text-xl font-bold text-foreground">
                Defense-Ready Dossier
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Instant compile of weekly entries, supervisor ratings, and institutional cover
                sheets into official defense PDF or Word dossiers.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-4 space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <FileText className="size-4 text-primary" />
                <span>Standardized Dossier Format</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Includes CUE syllabus rubric, dual signature certificates, and attendance hour
                tallies.
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-primary font-medium">
                <span>PDF / Word / ZIP bundles</span>
                <span>Auto-Formatted</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-12 -right-12 size-40 rounded-full bg-primary/10 blur-2xl" />
          </div>

          {/* ── 5. Dean & HOD Analytics (Spans 2 columns on lg) ── */}
          <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-card/80 p-7 sm:p-9 shadow-card hover:border-primary/40 transition-all hover:shadow-elevated relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TrendingUp className="size-5" />
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Faculty Oversight
                </Badge>
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground">
                Institutional Cohort Oversight & Governance
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                Deans and industrial attachment coordinators track hundreds of students across
                multiple partner employers on a single live dashboard with automated audit alerts.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
              <div className="rounded-xl border border-border/60 bg-background/80 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Active Cohort Placement
                </span>
                <p className="text-xl font-bold text-foreground">412 Students</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Across 86 Host Orgs
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/80 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Delayed Mentor Sign-offs
                </span>
                <p className="text-xl font-bold text-foreground">2 Flagged</p>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Automated SMS / Email ping
                </span>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/80 p-3.5 space-y-1">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Defense Clearance Rate
                </span>
                <p className="text-xl font-bold text-foreground">99.4%</p>
                <span className="text-[10px] text-primary font-medium">Board Ready</span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-primary/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
