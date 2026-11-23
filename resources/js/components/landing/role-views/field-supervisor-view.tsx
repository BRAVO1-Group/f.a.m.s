import { cn } from "@/lib/utils";

interface FieldSupervisorViewProps {
  focusedCard: string | null;
  approved: boolean;
  onApprove: () => void;
}

export function FieldSupervisorView({ focusedCard, approved, onApprove }: FieldSupervisorViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-3.5" style={{ transformStyle: "preserve-3d" }}>
      {/* Host Organization Notice Banner */}
      <div className="z-layer-mid rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-indigo-600/15 text-indigo-700 flex items-center justify-center text-base font-bold shrink-0">
            </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-zinc-900">Host Organization Review Queue</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 text-indigo-700 bg-white">
                TechCorp Kenya Ltd
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                Received Enterprise Logins
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Scoped strictly to your assigned student mentees: <strong>Alice Wanjiku</strong> and{" "}
              <strong>Kevin Kiprono</strong>. Sign off daily logs or request revisions.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-lime-500/15 text-lime-700 border border-lime-500/30 shrink-0">
          ️ Direct Sign-off Authority
        </span>
      </div>

      {/* Queue Filter Tabs */}
      <div className="flex items-center justify-between gap-3 z-layer-mid">
        <div className="inline-flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <span className="px-3 py-1 rounded-lg bg-white text-xs font-bold text-zinc-900 shadow-sm flex items-center gap-1.5">
            Pending{" "}
            <span className="px-1.5 py-0 rounded-full bg-indigo-600 text-white text-[10px]">
              {approved ? 1 : 2}
            </span>
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
            Approved{" "}
            <span className="px-1.5 py-0 rounded-full bg-white text-zinc-900 text-[10px]">
              {approved ? 4 : 3}
            </span>
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
            Revisions Requested{" "}
            <span className="px-1.5 py-0 rounded-full bg-amber-500/20 text-amber-800 text-[10px]">1</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium">Assigned Mentees:</span>
          <span className="px-3 py-1 rounded-lg bg-white border border-zinc-200 font-semibold text-zinc-900">
            All Assigned Mentees (Alice &amp; Kevin) ▾
          </span>
        </div>
      </div>

      {/* Main Review Card + Scoped Mentees */}
      <div className="grid grid-cols-12 gap-3.5 flex-1" style={{ transformStyle: "preserve-3d" }}>
        <div
          className={cn(
            "col-span-8 bg-white border border-zinc-200 rounded-2xl p-4 z-layer-pop flex flex-col justify-between",
            focusedCard === "sup-card-review" && "card-3d-focus",
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-2 border-b border-zinc-200 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-zinc-900">
                    Vulnerability assessment on customer portal API
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50">
                    Kevin Kiprono
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-lime-500/30 text-lime-700 bg-lime-50">
                    + Alice Wanjiku
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Logged Date: 2026-09-24 • Hours: 08:30 - 17:00 (8.0 hrs)
                </p>
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                  approved
                    ? "bg-lime-100 text-lime-800 border-lime-400"
                    : "bg-indigo-100 text-indigo-800 border-indigo-300",
                )}
              >
                {approved ? "Approved by Host Org" : "Submitted"}
              </span>
            </div>

            <p className="text-xs text-zinc-900 mt-2.5 leading-relaxed">
              Conducted automated and manual vulnerability assessment using OWASP ZAP and Postman. Identified 2 CORS
              misconfigurations and drafted remediation notes alongside PostgreSQL analytics schema indexing.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {["OWASP ZAP", "Postman", "Burp Suite", "PostgreSQL"].map((tool) => (
                <span key={tool} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-900">
                  {tool}
                </span>
              ))}
            </div>

            <div className="mt-3 space-y-1">
              <label className="text-[11px] font-bold text-zinc-900 flex items-center gap-1">
                <span></span> Mentor Guidance / Engineering Sign-Off Note
              </label>
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 min-h-[48px]">
                <span>
                  Verified CORS remediation and PostgreSQL index benchmarks on staging. Great analytical rigor!
                </span>
                <span className="inline-block w-1.5 h-3.5 bg-indigo-600 align-middle ml-0.5 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onApprove}
                className="px-4 py-1.5 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <span></span>
                <span>{approved ? "Signed Off & Logged" : "Sign Off & Approve"}</span>
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-amber-400 bg-amber-50 text-amber-900 font-semibold text-xs hover:bg-amber-100 transition flex items-center gap-1"
              >
                <span>↺</span>
                <span>Request Revision</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Reviewer: James Otieno (TechCorp)</span>
          </div>
        </div>

        <div className="col-span-4 bg-white border border-zinc-200 rounded-2xl p-4 z-layer-mid flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-xs font-extrabold text-zinc-900 border-b border-zinc-200 pb-2">
              Assigned TechCorp Mentees (2)
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">Alice Wanjiku</span>
                <span className="text-[10px] font-bold text-lime-700 bg-lime-50 px-1.5 py-0.5 rounded">
                  42/60d
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">CS/2021/0042 • Software Eng. Intern</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">Kevin Kiprono</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">18/60d</span>
              </div>
              <p className="text-[10px] text-zinc-500">CS/2021/0104 • Cybersecurity Intern</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[10px] font-mono space-y-1">
            <div className="font-bold text-amber-900">TIER 2 HOST ORG PERMISSIONS:</div>
            <div className="text-lime-600 font-bold">logs:approve (Sign off logs)</div>
            <div className="text-lime-600 font-bold">attendance:audit (Verify hours)</div>
            <div className="text-rose-500">supervisors:assign (Uni Admin only)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
