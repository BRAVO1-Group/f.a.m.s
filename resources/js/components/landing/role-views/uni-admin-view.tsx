import { cn } from "@/lib/utils";

interface UniAdminViewProps {
  focusedCard: string | null;
  paired: boolean;
  exported: boolean;
  onPair: () => void;
  onExport: () => void;
}

export function UniAdminView({ focusedCard, paired, exported, onPair, onExport }: UniAdminViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-3" style={{ transformStyle: "preserve-3d" }}>
      {/* At-Risk / Resolved Banner */}
      <div
        className={cn(
          "z-layer-mid rounded-xl border px-4 py-2.5 flex items-center justify-between gap-3 transition-all",
          paired ? "border-emerald-300 bg-emerald-50/95" : "border-rose-300 bg-rose-50/95",
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">{paired ? "✅" : "⚠️"}</span>
          <div>
            <div className={cn("text-xs font-extrabold", paired ? "text-emerald-950" : "text-rose-950")}>
              Pending Faculty Assessor Allocation &amp; Attendance Risk Alert
            </div>
            <p className={cn("text-[11px]", paired ? "text-emerald-800" : "text-rose-800")}>
              {paired ? (
                <>
                  All 4 placement candidates are now <strong>100% Dual-Supervised</strong> with pre-provisioned
                  university credentials bound.
                </>
              ) : (
                <>
                  1 candidate flagged: <strong>Kevin Kiprono (CS/2021/0104)</strong> at TechCorp Kenya Ltd is missing
                  an assigned University Academic Supervisor.
                </>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onPair}
          className={cn(
            "px-3 py-1.5 rounded-lg text-white text-xs font-bold shrink-0 shadow-sm transition",
            paired ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-700 hover:bg-rose-800",
          )}
        >
          {paired ? "✓ 100% Paired" : "Pair Kevin Kiprono Now →"}
        </button>
      </div>

      {/* 4 Institutional Admin KPIs */}
      <div className="grid grid-cols-4 gap-3 z-layer-mid">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Placed Cohort</div>
          <div className="text-2xl font-extrabold text-zinc-900 mt-1">4</div>
          <div className="text-[10px] text-zinc-500">TechCorp, Safaricom, KCB</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Dual-Supervised Rate</div>
          <div className={cn("text-2xl font-extrabold mt-1", paired ? "text-emerald-600" : "text-amber-600")}>
            {paired ? "100%" : "75%"}
          </div>
          <div className={cn("text-[10px] font-semibold", paired ? "text-emerald-700" : "text-amber-700")}>
            {paired ? "4 of 4 fully paired ✓" : "3 of 4 fully paired"}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">Supervisor Roster</div>
          <div className="text-2xl font-extrabold text-zinc-900 mt-1">6</div>
          <div className="text-[10px] text-zinc-500">3 Host Org • 3 Faculty</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-zinc-500">RBAC Governance</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">Tier 4</div>
          <div className="text-[10px] text-emerald-600 font-semibold">13 System Permissions</div>
        </div>
      </div>

      {/* Split: Dual-Supervisor Matrix + RBAC Control Matrix */}
      <div className="grid grid-cols-12 gap-3.5 flex-1" style={{ transformStyle: "preserve-3d" }}>
        <div
          className={cn(
            "col-span-7 bg-white border border-zinc-200 rounded-2xl p-3.5 z-layer-pop flex flex-col justify-between",
            focusedCard === "admin-card-pairing" && "card-3d-focus",
          )}
        >
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <div>
                <h3 className="text-xs font-extrabold text-zinc-900">Candidate Dual-Supervisor Allocation Matrix</h3>
                <p className="text-[10px] text-zinc-500">
                  Pairs Host Org Field Supervisor + University Assessor &amp; dispatches student-bound login
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Dual Mentorship
              </span>
            </div>

            <div className="mt-2 divide-y divide-zinc-200 text-[11px]">
              <div className="py-1.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900">
                    Alice Wanjiku <span className="font-mono text-[10px] text-zinc-500">CS/2021/0042</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">TechCorp Kenya Ltd</div>
                </div>
                <div className="text-[10px]">
                  <div>
                    🏢 James Otieno <span className="text-emerald-600 font-mono">[🔒 Bound]</span>
                  </div>
                  <div>🏛️ Dr. Peter Kamau</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Dual-Supervised
                </span>
              </div>

              <div className="py-1.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900">
                    Brian Mwangi <span className="font-mono text-[10px] text-zinc-500">CS/2021/0088</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">Safaricom PLC</div>
                </div>
                <div className="text-[10px]">
                  <div>
                    🏢 Grace Muthoni <span className="text-emerald-600 font-mono">[🔒 Bound]</span>
                  </div>
                  <div>🏛️ Dr. Joyce Chelangat</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Dual-Supervised
                </span>
              </div>

              <div
                className={cn(
                  "py-2 px-2 rounded-xl border flex items-center justify-between transition-all",
                  paired ? "bg-emerald-50/80 border-emerald-400" : "bg-amber-50/70 border-amber-300",
                )}
              >
                <div>
                  <div className="font-bold text-zinc-900">
                    Kevin Kiprono <span className="font-mono text-[10px] text-zinc-500">CS/2021/0104</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">TechCorp Kenya Ltd (Cybersecurity)</div>
                </div>
                <div className="text-[10px]">
                  <div>
                    🏢 James Otieno <span className="text-emerald-600 font-mono">[🔒 Bound]</span>
                  </div>
                  <div className={cn("font-bold", paired ? "text-emerald-700" : "text-rose-500")}>
                    {paired ? "🏛️ Dr. Joyce Chelangat (Paired)" : "⚠️ Missing Academic Assessor"}
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full font-bold text-[10px]",
                    paired ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900",
                  )}
                >
                  {paired ? "Dual-Supervised" : "Needs Allocation"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
            <span className="text-[10px] font-mono text-zinc-500">
              🔑 Pre-provisioned logins dispatched automatically
            </span>
            <button
              type="button"
              onClick={onPair}
              className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition"
            >
              <span>{paired ? "✓ Paired & Credentials Dispatched" : "+ Pair Mentors & Dispatch Login"}</span>
            </button>
          </div>
        </div>

        <div
          className={cn(
            "col-span-5 bg-white border border-zinc-200 rounded-2xl p-3.5 z-layer-mid flex flex-col justify-between",
            focusedCard === "admin-card-rbac" && "card-3d-focus",
          )}
        >
          <div>
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <span className="text-xs font-extrabold text-zinc-900">RBAC Control Matrix (`rbac:manage`)</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                DEAN ONLY
              </span>
            </div>

            <div className="mt-2 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <div>
                  <div className="font-bold text-zinc-900">Administrative Log Override</div>
                  <div className="text-[9px] font-mono text-zinc-500">logs:override • Arbitrate locked entries</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">ENABLED</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <div>
                  <div className="font-bold text-zinc-900">Assign Dual Supervisors</div>
                  <div className="text-[9px] font-mono text-zinc-500">supervisors:assign • Pair Host + Faculty</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">ENABLED</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 border border-zinc-200 transition-all">
                <div>
                  <div className="font-bold text-zinc-900">Accreditation Dossier Export</div>
                  <div className="text-[9px] font-mono text-zinc-500">accreditation:export • Senate PDF</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                  {exported ? "EXPORTED ✓" : "READY"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onExport}
            className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <span>📄</span>
            <span>{exported ? "✓ Graduation Board Dossier Exported (PDF)" : "Export Certified Graduation Dossier (PDF)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
