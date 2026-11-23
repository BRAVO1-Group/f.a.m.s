import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  ClipboardCheck,
  Cpu,
  FileCheck2,
  FlaskConical,
  GraduationCap,
  Landmark,
  Milestone,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import { BrandLogo } from "@/components/ui/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const WALKTHROUGH_STORAGE_KEY = "interntrack_walkthrough_completed_v1";
export const WALKTHROUGH_ROLE_KEY = "interntrack_walkthrough_role_v1";

type WalkthroughOption = {
  id: string;
  label: string;
  subtitle: string;
  highlight: string;
  icon: typeof GraduationCap;
};

type WalkthroughStep = {
  id: string;
  badge: string;
  question: string;
  description: string;
  options: WalkthroughOption[];
};

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "role",
    badge: "Workspace Role",
    question: "Who are you in InternTrack?",
    description:
      "We tailor your dashboard, navigation, and quick actions to match your institutional role.",
    options: [
      {
        id: "student",
        label: "Student Intern",
        subtitle: "Daily logs & check-ins",
        highlight: "Tier 1 · Log daily tasks, clock attendance shifts & track 12-week milestones.",
        icon: GraduationCap,
      },
      {
        id: "supervisor",
        label: "Field Supervisor",
        subtitle: "Host mentor sign-offs",
        highlight: "Tier 2 · Verify intern attendance, approve logbooks & submit industry grades.",
        icon: UserCheck,
      },
      {
        id: "academic",
        label: "Academic Assessor",
        subtitle: "Syllabus & site visits",
        highlight: "Tier 3 · Audit curriculum alignment, log site visits & clear students for defense.",
        icon: BookOpen,
      },
      {
        id: "admin",
        label: "University Admin",
        subtitle: "Pairings & RBAC",
        highlight: "Tier 4 · Provision supervisors, pair dual mentors & govern RBAC compliance.",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: "attachment",
    badge: "Placement Track",
    question: "What type of attachment are you managing?",
    description:
      "Select the primary academic or industry track for your field attachment program.",
    options: [
      {
        id: "industrial",
        label: "Industrial & IT",
        subtitle: "Engineering & software",
        highlight: "Configured for technical deliverables, code/system logs, and engineering rubrics.",
        icon: Cpu,
      },
      {
        id: "clinical",
        label: "Clinical & Lab",
        subtitle: "Health & research",
        highlight: "Configured for supervised practicum shifts, lab rotations, and competency sign-offs.",
        icon: FlaskConical,
      },
      {
        id: "corporate",
        label: "Corporate & Finance",
        subtitle: "Business & operations",
        highlight: "Configured for enterprise projects, departmental rotations, and executive reviews.",
        icon: Briefcase,
      },
      {
        id: "public",
        label: "Community & Public",
        subtitle: "NGO & field practicum",
        highlight: "Configured for field outreach logs, community impact metrics, and site visits.",
        icon: Landmark,
      },
    ],
  },
  {
    id: "workflow",
    badge: "Core Workflow",
    question: "What is your primary daily workflow?",
    description:
      "Choose the module you want prioritized when you open your workspace.",
    options: [
      {
        id: "logbook",
        label: "Digital Logbooks",
        subtitle: "Tasks, tools & skills",
        highlight: "Structured daily entries with skills tagging, challenges, and supervisor feedback.",
        icon: ClipboardCheck,
      },
      {
        id: "attendance",
        label: "Attendance & Clock",
        subtitle: "Verified shift hours",
        highlight: "Real-time check-in/out timestamps toward your 60 required attachment days.",
        icon: CalendarCheck,
      },
      {
        id: "signoff",
        label: "Dual Sign-Offs",
        subtitle: "Approve & feedback",
        highlight: "One-click host mentor verification paired with university faculty oversight.",
        icon: Building2,
      },
      {
        id: "milestones",
        label: "Placement Milestones",
        subtitle: "12-week roadmap",
        highlight: "Decompose placement goals from Onboarding to Final Defense Preparation.",
        icon: Milestone,
      },
    ],
  },
  {
    id: "outcome",
    badge: "Accreditation Goal",
    question: "What outcome are you working toward?",
    description:
      "InternTrack compiles every verified logbook and evaluation toward institutional clearance.",
    options: [
      {
        id: "evaluations",
        label: "Competency Grading",
        subtitle: "Industry & faculty scores",
        highlight: "Standardized rubrics covering technical proficiency, teamwork, and professionalism.",
        icon: Award,
      },
      {
        id: "cohort",
        label: "Cohort Compliance",
        subtitle: "Track all placements",
        highlight: "Live visibility across partner companies, attendance rates, and at-risk interns.",
        icon: Users,
      },
      {
        id: "exports",
        label: "Accredited Dossiers",
        subtitle: "PDF & Word reports",
        highlight: "Instant export of signed logbooks, analytics charts, and executive summaries.",
        icon: FileCheck2,
      },
      {
        id: "clearance",
        label: "Defense Clearance",
        subtitle: "Final faculty sign-off",
        highlight: "Complete dual-supervisor verification ready for university academic defense.",
        icon: ShieldCheck,
      },
    ],
  },
];

export default function WalkthroughPage() {
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({
    role: "student",
    attachment: "industrial",
    workflow: "logbook",
    outcome: "clearance",
  });

  // Only show walkthrough for first-time users; if already completed, redirect straight to /login
  useEffect(() => {
    try {
      if (localStorage.getItem(WALKTHROUGH_STORAGE_KEY) === "1") {
        router.visit("/login", { replace: true });
        return;
      }
    } catch {
      // ignore storage errors
    }
    const timer = setTimeout(() => setReady(true), 240);
    return () => clearTimeout(timer);
  }, []);

  const totalSteps = WALKTHROUGH_STEPS.length;
  const currentStep = WALKTHROUGH_STEPS[stepIndex]!;
  const selectedId = selections[currentStep.id];
  const selectedOption =
    currentStep.options.find((o) => o.id === selectedId) ?? currentStep.options[0]!;

  function handleSelect(optionId: string) {
    setSelections((prev) => ({
      ...prev,
      [currentStep.id]: optionId,
    }));
  }

  function completeFirstTimeWalkthrough() {
    try {
      localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "1");
      localStorage.setItem(WALKTHROUGH_ROLE_KEY, selections.role || "student");
    } catch {
      // ignore storage errors
    }
    router.visit("/login", { replace: true });
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    } else {
      router.visit("/");
    }
  }

  function handleContinue() {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      completeFirstTimeWalkthrough();
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 sm:p-6 md:p-10 antialiased">
        <div className="w-full max-w-5xl">
          <Card className="overflow-hidden border-border/70 p-0 shadow-elevated">
            <CardContent className="grid p-0 lg:grid-cols-12">
              <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:col-span-7 space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-36 rounded-xl" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/50 p-4">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2.5">
                    <Skeleton className="h-9 w-20 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="hidden lg:col-span-5 lg:block p-5 min-h-[480px]">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-4 sm:p-6 md:p-10 antialiased">
      <div className="w-full max-w-5xl">
        <Card className="overflow-hidden border-border/70 p-0 shadow-elevated">
          <CardContent className="grid p-0 lg:grid-cols-12">
            {/* Left Interactive Onboarding Column */}
            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:col-span-7">
              {/* Top Header & Progress */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <BrandLogo variant="auto" size="md" />
                  <Badge variant="secondary" className="font-mono text-xs">
                    Step {stepIndex + 1} of {totalSteps}
                  </Badge>
                </div>

                {/* Segmented Progress Bar */}
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {WALKTHROUGH_STEPS.map((step, idx) => {
                    const isCompleted = idx < stepIndex;
                    const isActive = idx === stepIndex;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => setStepIndex(idx)}
                        aria-label={`Go to step ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-foreground"
                            : isActive
                              ? "bg-primary"
                              : "bg-border"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Question & Description */}
                <div className="mt-6">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {currentStep.badge}
                  </span>
                  <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {currentStep.question}
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {/* Selectable Option Cards Grid (2x2 on mobile/tablet, 2x2 spacious cards on desktop) */}
              <div className="my-6 rounded-2xl border border-border/60 bg-muted/50 p-3.5 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStep.options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedId === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelect(option.id)}
                        className={`group relative flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#18221B] bg-[#18221B] text-white shadow-md dark:border-primary dark:bg-primary/15"
                            : "border-border/70 bg-background text-foreground hover:border-primary/50 hover:bg-accent/30"
                        }`}
                      >
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isSelected
                              ? "bg-[#9CE840] text-[#141D17]"
                              : "bg-primary/15 text-foreground group-hover:bg-primary/25"
                          }`}
                        >
                          <Icon className="size-5" />
                        </div>

                        <div className="min-w-0 flex-1 pr-5">
                          <p
                            className={`text-sm font-semibold leading-snug ${
                              isSelected ? "text-white" : "text-foreground"
                            }`}
                          >
                            {option.label}
                          </p>
                          <p
                            className={`mt-0.5 text-xs leading-tight ${
                              isSelected ? "text-white/75" : "text-muted-foreground"
                            }`}
                          >
                            {option.subtitle}
                          </p>
                        </div>

                        {isSelected && (
                          <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#9CE840] text-[#141D17]">
                            <Check className="size-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="gap-1.5"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={handleContinue}
                    className="gap-1.5 font-semibold px-6"
                  >
                    <span>
                      {stepIndex === totalSteps - 1 ? "Finish & Continue to Login" : "Continue"}
                    </span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={completeFirstTimeWalkthrough}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition cursor-pointer"
                >
                  Skip setup
                </button>
              </div>
            </div>

            {/* Right Visual & Live Context Column */}
            <div className="relative hidden lg:col-span-5 lg:flex flex-col justify-end overflow-hidden bg-[#18221B]">
              <img
                src="/images/walkthrough-3d-character.jpg"
                alt="InternTrack 3D guide character"
                className="absolute inset-0 h-full w-full object-cover object-center select-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1611] via-[#0E1611]/35 to-transparent" />

              {/* Dynamic Selection Highlight Card */}
              <div className="relative z-10 m-5 rounded-2xl border border-white/15 bg-[#121C15]/85 p-5 text-white backdrop-blur-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CE840]">
                    Selected Configuration
                  </span>
                  <span className="rounded-full bg-[#9CE840]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#9CE840]">
                    First-Time Setup
                  </span>
                </div>
                <p className="mt-1.5 font-display text-base font-bold text-white">
                  {selectedOption.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/80">
                  {selectedOption.highlight}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
