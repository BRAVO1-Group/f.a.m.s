import { cn } from "@/lib/utils";

interface StudentViewProps {
  focusedCard: string | null;
  clockedIn: boolean;
  aiPolished: boolean;
  submitted: boolean;
  onClockIn: () => void;
  onAiPolish: () => void;
  onSubmit: () => void;
  onFullFlow: () => void;
}

export function StudentRoleView({
  focusedCard,
  clockedIn,
  aiPolished,
  submitted,
  onClockIn,
  onAiPolish,
  onSubmit,
  onFullFlow,
}: StudentViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-3.5" style={{ transformStyle: "preserve-3d" }}>
      {/* Hero Banner */}
      <div className="z-layer-mid it-hero-gradient rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
              ✨ Active Placement • Week 9 of 12
            </span>
            <span className="text-[11px] text-white/75">Target Defense: Sept 30, 2026</span>
          </div>
          <h2 className="mt-1.5 text-xl sm:text-2xl font-extrabold tracking-tight">Good morning, Alice!</h2>
          <p className="text-xs text-white/90 font-medium mt-0.5">
            Software Engineering Intern • TechCorp Kenya Ltd • Supervised by James Otieno (Host) &amp; Dr. Peter Kamau (Faculty)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onFullFlow}
            className="it-hero-btn px-3.5 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-sm hover:bg-zinc-100 transition flex items-center gap-1.5"
          >
            <span>＋</span>
            <span>Add Today&apos;s Log</span>
          </button>
          <button
            type="button"
            onClick={onClockIn}
            className="px-3.5 py-2 rounded-xl border border-white/30 bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition flex items-center gap-1.5"
          >
            <span>🕒</span>
            <span>{clockedIn ? "✓ Clocked In (08:30 AM)" : "Clock In (08:30 AM)"}</span>
          </button>
        </div>
      </div>

      {/* 4 Student KPI Cards */}
      <div className="grid grid-cols-4 gap-3 z-layer-mid">
        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm transition-all">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Days Completed</span>
            <span className="size-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">📅</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-zinc-900">{clockedIn ? 43 : 42}</span>
            <span className="text-xs text-zinc-500">/ 60 days</span>
          </div>
          <div className="mt-2 w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full transition-all duration-700" style={{ width: clockedIn ? "72%" : "70%" }} />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Total Logged Hours</span>
            <span className="size-6 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">⏱️</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-zinc-900">{clockedIn ? "344.0" : "336.0"}</span>
            <span className="text-xs text-zinc-500">hours</span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-600 font-medium">● 8.0 hrs/day pace</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>Logbook Status</span>
            <span className="size-6 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center">📋</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-zinc-900">{submitted ? 5 : 4}</span>
            <span className="text-xs text-zinc-500">entries</span>
          </div>
          <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
            {submitted ? "2 in supervisor review queue" : "1 draft ready to submit"}
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            <span>RBAC Clearance</span>
            <span className="size-6 rounded-lg bg-indigo-500/15 text-indigo-700 flex items-center justify-center">🛡️</span>
          </div>
          <div className="mt-1.5 space-y-1 text-[10px] font-mono">
            <div className="text-emerald-600 font-bold">✓ logs:create</div>
            <div className="text-emerald-600 font-bold">✓ attendance:record</div>
            <div className="text-rose-500">🔒 logs:approve (Mentor)</div>
          </div>
        </div>
      </div>

      {/* Bottom Split */}
      <div className="grid grid-cols-12 gap-3.5 flex-1" style={{ transformStyle: "preserve-3d" }}>
        <div
          className={cn(
            "col-span-7 bg-white border border-zinc-200 rounded-2xl p-4 z-layer-pop flex flex-col justify-between",
            focusedCard === "stu-card-logbook" && "card-3d-focus",
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-zinc-900">Digital Logbook — Today&apos;s Entry</span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    submitted
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-amber-400 bg-amber-50 text-amber-800",
                  )}
                >
                  {submitted ? "Submitted to James Otieno" : "Draft"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">2026-09-24 · 08:30–17:00 · TechCorp Product Engineering</p>
            </div>
            <button
              type="button"
              onClick={onAiPolish}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center gap-1 hover:bg-indigo-100 transition"
            >
              <span>✨</span>
              <span>{aiPolished ? "✨ AI Polished!" : "Polish with AI"}</span>
            </button>
          </div>

          <div className="my-2.5 space-y-2">
            <div className="text-xs font-bold text-zinc-900 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200">
              Title: <span className="font-semibold">Onboarding Flow UI &amp; REST API Validation</span>
            </div>
            <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 min-h-[74px] text-xs text-zinc-900 leading-relaxed font-normal">
              <span>
                {aiPolished
                  ? "Engineered responsive onboarding wizard UI in React 19 with strict Zod validation and REST API integration. Achieved 92% Jest unit test coverage across country phone formats."
                  : "Working on the onboarding wizard UI components for new user registration using React 19 and Zod schema validation."}
              </span>
              <span className="inline-block w-1.5 h-3.5 bg-indigo-600 align-middle ml-0.5 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-zinc-200 bg-white text-zinc-900">
                React 19
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-zinc-200 bg-white text-zinc-900">
                Tailwind CSS
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-indigo-700">
                UI/UX design
              </span>
              {aiPolished && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 border border-emerald-400/40">
                  + Zod &amp; Jest (92%)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onSubmit}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <span>🚀</span>
              <span>{submitted ? "✓ Sent to Host Supervisor" : "Submit to Field Supervisor"}</span>
            </button>
          </div>
        </div>

        <div
          className={cn(
            "col-span-5 bg-white border border-zinc-200 rounded-2xl p-4 z-layer-mid flex flex-col justify-between",
            focusedCard === "stu-card-milestone" && "card-3d-focus",
          )}
        >
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <span className="text-xs font-extrabold text-zinc-900">Today&apos;s Shift &amp; Milestone</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                Checked In 08:30 AM
              </span>
            </div>

            <div className="mt-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Workplace Location:</span>
                <span className="font-bold text-zinc-900">TechCorp Westlands (On-Site)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Phase 2 Deliverables:</span>
                <span className="font-bold text-indigo-600">
                  {clockedIn ? "3 of 3 tasks (100%)" : "2 of 3 tasks (67%)"}
                </span>
              </div>
            </div>

            <div className="mt-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-zinc-900">
                <span className="size-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
                <span className="line-through text-zinc-500">Implement Radix dialog and tabs in review queue</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-zinc-900">
                <span className="size-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
                <span className="line-through text-zinc-500">Build responsive stats dashboard with Recharts</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-lg border transition-all",
                  clockedIn
                    ? "bg-emerald-50/80 border-emerald-300 text-zinc-900"
                    : "bg-zinc-50 border-zinc-200 text-zinc-900",
                )}
              >
                <span
                  className={cn(
                    "size-4 rounded-full flex items-center justify-center text-[9px] font-bold",
                    clockedIn ? "bg-emerald-600 text-white" : "border border-zinc-400",
                  )}
                >
                  {clockedIn ? "✓" : ""}
                </span>
                <span className="font-semibold">Complete accessibility &amp; screen-reader audit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
