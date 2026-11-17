import { cn } from "@/lib/utils";

interface UniSupervisorViewProps {
  focusedCard: string | null;
  rubricAnimated: boolean;
  certified: boolean;
  onCertify: () => void;
}

export function UniSupervisorView({
  focusedCard,
  rubricAnimated,
  certified,
  onCertify,
}: UniSupervisorViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-3.5" style={{ transformStyle: "preserve-3d" }}>
      {/* Hero Header */}
      <div className="z-layer-mid it-hero-gradient rounded-2xl p-4 sm:p-5 text-white shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[11px] font-semibold">
              🏛️ Academic &amp; Field Rubrics
            </span>
            <span className="text-[11px] text-white/75">University of Nairobi • Dept. of Software Engineering</span>
          </div>
          <h2 className="mt-1.5 text-xl font-extrabold tracking-tight">Performance Evaluations &amp; Grading</h2>
          <p className="text-xs text-white/85 mt-0.5">
            Conduct verified mid-term reviews, certify milestone phases, and record final academic exit assessments.
          </p>
        </div>
        <button
          type="button"
          onClick={onCertify}
          className="it-hero-btn px-3.5 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-sm hover:bg-zinc-100 transition shrink-0"
        >
          🏅 Conduct New Evaluation
        </button>
      </div>

      {/* 4 Evaluation KPI Cards */}
      <div className="grid grid-cols-4 gap-3 z-layer-mid">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Total Evaluations</div>
          <div className="text-2xl font-extrabold text-zinc-900 mt-1">{certified ? 2 : 1}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Signed assessments on file</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Average Overall Score</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">4.8 / 5.0</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Distinction-tier performance</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Job Offer Endorsements</div>
          <div className="text-2xl font-extrabold text-zinc-900 mt-1">{certified ? 2 : 1}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Full-time conversion recommended</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Defense Ready</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{certified ? "4 of 4" : "3 of 4"}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Graduation clearance unlocked</div>
        </div>
      </div>

      {/* Split: Rubric + Milestone Certification */}
      <div className="grid grid-cols-12 gap-3.5 flex-1" style={{ transformStyle: "preserve-3d" }}>
        <div
          className={cn(
            "col-span-7 bg-white border border-zinc-200 rounded-2xl p-4 z-layer-pop flex flex-col justify-between",
            focusedCard === "uni-card-rubric" && "card-3d-focus",
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <div>
              <span className="text-xs font-extrabold text-zinc-900">Academic Assessor Rubric — Final Assessment</span>
              <p className="text-[11px] text-zinc-500">
                Candidate: <strong>Alice Wanjiku (CS/2021/0042)</strong> • TechCorp Kenya Ltd
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 text-xs font-extrabold">
              A (Distinction) • 4.8/5.0
            </span>
          </div>

          <div className="space-y-2.5 my-2">
            {[
              { label: "1. Technical Engineering & Architecture", score: "5.0 / 5.0", targetWidth: "100%", bar: "bg-indigo-600", text: "text-indigo-600" },
              { label: "2. Workplace Punctuality & Attendance Audit", score: "5.0 / 5.0", targetWidth: "100%", bar: "bg-indigo-600", text: "text-indigo-600" },
              { label: "3. Technical Documentation & Logbook Rigor", score: "4.5 / 5.0", targetWidth: "90%", bar: "bg-emerald-500", text: "text-emerald-600" },
              { label: "4. Oral Defense & Problem Solving", score: "5.0 / 5.0", targetWidth: "100%", bar: "bg-indigo-600", text: "text-indigo-600" },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-[11px] font-semibold text-zinc-900 mb-1">
                  <span>{row.label}</span>
                  <span className={cn("font-mono font-bold", row.text)}>{row.score}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-700", row.bar)}
                    style={{ width: rubricAnimated ? row.targetWidth : "30%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
            <span className="text-[11px] font-semibold text-zinc-500">
              Recommendation: <strong className="text-emerald-600">Full Time Offer</strong>
            </span>
            <button
              type="button"
              onClick={onCertify}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition"
            >
              <span>{certified ? "✓ Grade A Recorded on Transcript" : "✓ Certify & Record Grade"}</span>
            </button>
          </div>
        </div>

        <div className="col-span-5 bg-white border border-zinc-200 rounded-2xl p-4 z-layer-mid flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-zinc-900 border-b border-zinc-200 pb-2">
              Faculty Milestone Certification
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">Phase 1: Orientation</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Certified ✓
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">Weeks 1–2 • Git, Docker, Architecture</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">Phase 2: Core Modules</span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    certified ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800",
                  )}
                >
                  {certified ? "Certified by Faculty ✓" : "Ready to Certify"}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">Weeks 3–6 • React 19, Tailwind v4, Radix UI</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-[10px] font-mono space-y-1">
            <div className="font-bold text-indigo-950">FACULTY ASSESSOR PERMISSIONS:</div>
            <div className="text-emerald-600 font-bold">✓ assessments:grade (Midterm/Final)</div>
            <div className="text-emerald-600 font-bold">✓ milestones:certify (Phase Sign-off)</div>
            <div className="text-rose-500">🔒 rbac:manage (Uni Admin / Dean only)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
