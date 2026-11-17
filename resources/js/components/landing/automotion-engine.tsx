import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { FAMS_ROLES, type FamsCameraPose } from "./fams-roles";
import { ThreeDStageCanvas, type Packet3D } from "./three-d-stage-canvas";
import { StudentRoleView } from "./role-views/student-view";
import { FieldSupervisorView } from "./role-views/field-supervisor-view";
import { UniSupervisorView } from "./role-views/uni-supervisor-view";
import { UniAdminView } from "./role-views/uni-admin-view";

const ROLE_DURATION = 9500;

interface AutomotionEngineProps {
  active: boolean;
  activeRole: number;
  onSelectRole: (idx: number, manual?: boolean) => void;
}

export function AutomotionEngine({
  active,
  activeRole,
  onSelectRole,
}: AutomotionEngineProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [autoMotion, setAutoMotion] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  // Pointer choreography state
  const [pointer, setPointer] = useState({ left: 480, top: 260, label: "Clicking + Add Today's Log", clicking: false, rippleKey: 0 });

  // Interactive role state
  const [clockedIn, setClockedIn] = useState(false);
  const [aiPolished, setAiPolished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rubricAnimated, setRubricAnimated] = useState(false);
  const [certified, setCertified] = useState(false);
  const [paired, setPaired] = useState(false);
  const [exported, setExported] = useState(false);

  const rigRef = useRef<HTMLDivElement | null>(null);
  const camStateRef = useRef<FamsCameraPose>({ rx: 7, ry: -9, rz: 0.4, scale: 0.96, tx: 0, ty: 0 });
  const packetsRef = useRef<Packet3D[]>([]);
  const stepStartRef = useRef<number>(Date.now());
  const dragOriginRef = useRef({ startX: 0, startY: 0, rx: 7, ry: -9 });

  const spawnPacket = useCallback((from: number, to: number) => {
    packetsRef.current.push({ from, to, t: 0 });
  }, []);

  const applyCameraTransform = useCallback((pose: FamsCameraPose) => {
    camStateRef.current = pose;
    const rig = rigRef.current;
    if (!rig || typeof window === "undefined") return;
    const vhFit = Math.min(1, Math.max(0.64, (window.innerHeight - 115) / 660));
    const vwFit = Math.min(1, Math.max(0.6, (window.innerWidth - 48) / 1180));
    const finalScale = +(pose.scale * Math.min(vhFit, vwFit)).toFixed(3);
    rig.style.transform = `translate3d(${pose.tx}px, ${pose.ty}px, 0px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${finalScale})`;
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (active) applyCameraTransform(camStateRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, applyCameraTransform]);

  // Trigger role choreography when active & role changes
  useEffect(() => {
    const role = FAMS_ROLES[activeRole] ?? FAMS_ROLES[0]!;
    stepStartRef.current = Date.now();
    setFocusedCard(null);
    applyCameraTransform(role.baseCamera);

    // Reset role demo states
    setClockedIn(false);
    setAiPolished(false);
    setSubmitted(false);
    setApproved(false);
    setRubricAnimated(false);
    setCertified(false);
    setPaired(false);
    setExported(false);

    if (!active || !autoMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedulePointer = (left: number, top: number, label: string, click = false) => {
      setPointer((prev) => ({ ...prev, left, top, label, clicking: false }));
      if (click) {
        timers.push(
          setTimeout(() => {
            setPointer((prev) => ({ ...prev, clicking: true, rippleKey: prev.rippleKey + 1 }));
            timers.push(setTimeout(() => setPointer((prev) => ({ ...prev, clicking: false })), 220));
          }, 620),
        );
      }
    };

    if (activeRole === 0) {
      timers.push(
        setTimeout(() => {
          setFocusedCard("stu-card-milestone");
          applyCameraTransform({ rx: 9, ry: -12, rz: 0.6, scale: 0.99, tx: -12, ty: -6 });
          schedulePointer(930, 120, "Punching Daily Attendance (attendance:record)", true);
          timers.push(
            setTimeout(() => {
              setClockedIn(true);
              spawnPacket(0, 1);
            }, 650),
          );
        }, 900),
      );
      timers.push(
        setTimeout(() => {
          setFocusedCard("stu-card-logbook");
          applyCameraTransform({ rx: 6, ry: -5, rz: 0.2, scale: 1.0, tx: 14, ty: -10 });
          schedulePointer(580, 355, "Polishing Log with AI Assistant", true);
          timers.push(
            setTimeout(() => {
              setAiPolished(true);
            }, 650),
          );
        }, 3600),
      );
      timers.push(
        setTimeout(() => {
          schedulePointer(570, 520, "Submitting Logbook (logs:create)", true);
          timers.push(
            setTimeout(() => {
              setSubmitted(true);
              spawnPacket(0, 1);
            }, 650),
          );
        }, 6400),
      );
    } else if (activeRole === 1) {
      timers.push(
        setTimeout(() => {
          setFocusedCard("sup-card-review");
          applyCameraTransform({ rx: 7.5, ry: 10, rz: -0.5, scale: 0.99, tx: 10, ty: -8 });
          schedulePointer(440, 445, "Writing Host Org Engineering Feedback", false);
        }, 1000),
      );
      timers.push(
        setTimeout(() => {
          schedulePointer(315, 520, "Approving Mentee Deliverable (logs:approve)", true);
          timers.push(
            setTimeout(() => {
              setApproved(true);
              spawnPacket(1, 2);
            }, 650),
          );
        }, 4600),
      );
    } else if (activeRole === 2) {
      timers.push(
        setTimeout(() => {
          setFocusedCard("uni-card-rubric");
          applyCameraTransform({ rx: 8.5, ry: -9, rz: 0.4, scale: 0.99, tx: 12, ty: -8 });
          schedulePointer(480, 390, "Scoring Standardized 5-Point Rubric", false);
          setRubricAnimated(true);
        }, 900),
      );
      timers.push(
        setTimeout(() => {
          schedulePointer(585, 520, "Recording Official Grade A (assessments:grade)", true);
          timers.push(
            setTimeout(() => {
              setCertified(true);
              spawnPacket(2, 3);
            }, 650),
          );
        }, 4800),
      );
    } else if (activeRole === 3) {
      timers.push(
        setTimeout(() => {
          setFocusedCard("admin-card-pairing");
          applyCameraTransform({ rx: 7.5, ry: 9, rz: -0.4, scale: 0.99, tx: 12, ty: -8 });
          schedulePointer(555, 520, "Pairing Dual Mentors & Binding Login (supervisors:assign)", true);
          timers.push(
            setTimeout(() => {
              setPaired(true);
              spawnPacket(3, 0);
            }, 650),
          );
        }, 1400),
      );
      timers.push(
        setTimeout(() => {
          setFocusedCard("admin-card-rbac");
          applyCameraTransform({ rx: 7, ry: -8, rz: 0.3, scale: 0.99, tx: -14, ty: -8 });
          schedulePointer(915, 520, "Exporting Dean Accreditation Dossier (accreditation:export)", true);
          timers.push(
            setTimeout(() => {
              setExported(true);
              spawnPacket(3, 0);
            }, 650),
          );
        }, 5400),
      );
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [active, activeRole, autoMotion, applyCameraTransform, spawnPacket]);

  // Continuous progress & role advance loop
  useEffect(() => {
    if (!active || !autoMotion || isDragging) return;
    let rafId = 0;

    const tick = () => {
      const elapsed = Date.now() - stepStartRef.current;
      if (elapsed >= ROLE_DURATION) {
        onSelectRole((activeRole + 1) % FAMS_ROLES.length, false);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, activeRole, autoMotion, isDragging, onSelectRole]);

  // 3D Orbit Dragging
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - dragOriginRef.current.startX;
      const dy = e.clientY - dragOriginRef.current.startY;
      const newRy = Math.max(-28, Math.min(28, dragOriginRef.current.ry + dx * 0.08));
      const newRx = Math.max(-14, Math.min(24, dragOriginRef.current.rx - dy * 0.08));
      applyCameraTransform({
        ...camStateRef.current,
        rx: newRx,
        ry: newRy,
      });
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, applyCameraTransform]);

  // Spacebar toggles auto-motion when active
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setAutoMotion((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const role = FAMS_ROLES[activeRole] ?? FAMS_ROLES[0]!;

  return (
    <div id="s2-3d-engine" className={cn(active && "fams-is-case")} aria-hidden={!active}>
      <ThreeDStageCanvas
        active={active}
        activeRole={activeRole}
        camStateRef={camStateRef}
        packetsRef={packetsRef}
      />

      {/* Center 3D Perspective Stage */}
      <main
        className="relative z-20 flex-1 flex items-center justify-center px-4 py-2 stage-viewport"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button, a")) return;
          dragOriginRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            rx: camStateRef.current.rx,
            ry: camStateRef.current.ry,
          };
          setIsDragging(true);
        }}
      >
        <div
          ref={rigRef}
          className={cn("camera-rig w-full max-w-[1180px]", isDragging && "dragging", exploded && "exploded")}
          style={{ transform: "rotateX(7deg) rotateY(-9deg) rotateZ(0.4deg) scale(0.96)" }}
        >
          {/* Floating 3D Capability Callout */}
          <div className="z-layer-hud absolute -top-4 right-6 z-50 bg-zinc-950/95 border-2 border-indigo-400/60 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 max-w-md pointer-events-none">
            <div className="size-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-base font-bold shrink-0">
              {role.hudIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-400/30">
                  {role.hudPerm}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">● EXCLUSIVE ACTION</span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">{role.hudTitle}</p>
            </div>
          </div>

          {/* 3D Workstation Bezel */}
          <div className="laptop-3d-body">
            <div className="bg-zinc-950 px-4 py-2 rounded-t-xl border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-500" />
                <span className="size-2.5 rounded-full bg-amber-500" />
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <div className="ml-3 flex items-center gap-1.5 bg-zinc-900 border border-white/10 px-3 py-0.5 rounded-md text-[11px] font-mono text-indigo-300/90">
                  <span>🔒</span>
                  <span>{role.url}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="text-indigo-300/80">
                  RBAC SESSION: <strong className="text-white">{role.windowTier}</strong>
                </span>
                <span className="text-zinc-600">|</span>
                <span className="text-emerald-400/90">DRAG STAGE TO ORBIT 3D</span>
              </div>
            </div>

            {/* App Shell */}
            <div
              id="app-screen-shell"
              className={cn(
                "grid grid-cols-12 min-h-[590px] max-h-[590px] rounded-b-xl overflow-visible relative",
                isDark && "dark-theme",
              )}
              style={{
                background: "var(--it-bg)",
                color: "var(--it-ink)",
                transformStyle: "preserve-3d",
                transition: "background 0.25s ease, color 0.25s ease",
              }}
            >
              {/* Simulated 3D Spatial Pointer */}
              <div
                id="sim-pointer"
                className={cn("absolute z-50 flex items-start", pointer.clicking && "clicking")}
                style={{ left: `${pointer.left}px`, top: `${pointer.top}px` }}
              >
                <div className="relative">
                  <svg
                    className="size-6 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
                    viewBox="0 0 24 24"
                    fill="#4f46e5"
                    stroke="#ffffff"
                    strokeWidth="2"
                  >
                    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
                  </svg>
                  {pointer.rippleKey > 0 && (
                    <div
                      key={pointer.rippleKey}
                      className="click-ripple absolute -top-2 -left-2 size-9 rounded-full border-2 border-indigo-500"
                    />
                  )}
                </div>
                <div className="ml-1 mt-3 px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[10px] font-mono font-bold shadow-xl border border-indigo-400/50 whitespace-nowrap">
                  {pointer.label}
                </div>
              </div>

              {/* Left Monochromatic Zinc Sidebar */}
              <aside
                className="col-span-3 lg:col-span-2 flex flex-col justify-between rounded-bl-xl z-layer-base select-none transition-colors duration-200"
                style={{
                  background: "var(--it-sidebar)",
                  color: "var(--it-sidebar-ink)",
                  borderRight: "1px solid var(--it-sidebar-border)",
                }}
              >
                <div>
                  <div
                    className="flex items-center gap-2.5 px-4 py-3.5"
                    style={{ borderBottom: "1px solid var(--it-sidebar-border)" }}
                  >
                    <div className="size-8 rounded-lg it-accent-gradient flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                      <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                        <path d="M22 10v6" />
                        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-none tracking-tight" style={{ color: "var(--it-sidebar-active-ink)" }}>
                        InternTrack
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0 rounded"
                          style={{ border: "1px solid var(--it-sidebar-border)", color: "var(--it-muted)" }}
                        >
                          {role.tier}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "var(--it-muted)" }}>
                          {role.short}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 py-3 space-y-3 text-xs">
                    {role.navGroups.map((group) => (
                      <div key={group.cat} className="space-y-1">
                        <p className="px-2.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--it-muted)", opacity: 0.75 }}>
                          {group.cat}
                        </p>
                        {group.items.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
                            style={
                              item.active
                                ? {
                                    background: "var(--it-sidebar-active)",
                                    color: "var(--it-sidebar-active-ink)",
                                    fontWeight: 700,
                                    boxShadow: "inset 2.5px 0 0 var(--it-primary)",
                                  }
                                : { color: "var(--it-sidebar-ink)", opacity: 0.78 }
                            }
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{ background: item.active ? "var(--it-primary)" : "var(--it-muted)" }}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="p-3 rounded-bl-xl"
                  style={{ borderTop: "1px solid var(--it-sidebar-border)", background: "rgba(79,70,229,0.04)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: "rgba(79,70,229,0.14)",
                        color: "var(--it-primary)",
                        border: "1px solid rgba(79,70,229,0.28)",
                      }}
                    >
                      {role.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--it-sidebar-active-ink)" }}>
                        {role.name}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: "var(--it-muted)" }}>
                        {role.roleLabel}
                      </p>
                    </div>
                  </div>
                  <div
                    className="mt-2 pt-2 flex items-center gap-1.5 text-[10px]"
                    style={{ borderTop: "1px solid var(--it-sidebar-border)", color: "var(--it-muted)" }}
                  >
                    <span>↪</span>
                    <span>Sign out</span>
                  </div>
                </div>
              </aside>

              {/* Right Workspace */}
              <section
                className="col-span-9 lg:col-span-10 flex flex-col justify-between p-4 sm:p-5 overflow-visible relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="flex items-center justify-between pb-3 mb-1 border-b border-zinc-200 z-layer-base">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-zinc-500">Active Institutional Persona:</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {role.scopeBadge}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm">
                    <span className="size-6 rounded-full bg-indigo-600/15 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                      {role.initials}
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">{role.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-indigo-700">
                      {role.roleLabel}
                    </span>
                    <span className="text-[10px] text-zinc-500">▾</span>
                  </div>
                </div>

                {activeRole === 0 && (
                  <StudentRoleView
                    focusedCard={focusedCard}
                    clockedIn={clockedIn}
                    aiPolished={aiPolished}
                    submitted={submitted}
                    onClockIn={() => {
                      setClockedIn(true);
                      spawnPacket(0, 1);
                    }}
                    onAiPolish={() => setAiPolished(true)}
                    onSubmit={() => {
                      setSubmitted(true);
                      spawnPacket(0, 1);
                    }}
                    onFullFlow={() => {
                      setAiPolished(true);
                      setTimeout(() => {
                        setSubmitted(true);
                        spawnPacket(0, 1);
                      }, 500);
                    }}
                  />
                )}
                {activeRole === 1 && (
                  <FieldSupervisorView
                    focusedCard={focusedCard}
                    approved={approved}
                    onApprove={() => {
                      setApproved(true);
                      spawnPacket(1, 2);
                    }}
                  />
                )}
                {activeRole === 2 && (
                  <UniSupervisorView
                    focusedCard={focusedCard}
                    rubricAnimated={rubricAnimated}
                    certified={certified}
                    onCertify={() => {
                      setRubricAnimated(true);
                      setCertified(true);
                      spawnPacket(2, 3);
                    }}
                  />
                )}
                {activeRole === 3 && (
                  <UniAdminView
                    focusedCard={focusedCard}
                    paired={paired}
                    exported={exported}
                    onPair={() => {
                      setPaired(true);
                      spawnPacket(3, 0);
                    }}
                    onExport={() => {
                      setExported(true);
                      spawnPacket(3, 0);
                    }}
                  />
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom 4-Role Handoff Matrix */}
      <footer className="relative z-30 w-full max-w-[1360px] mx-auto pb-3 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 bg-zinc-900/90 border border-indigo-500/25 p-2.5 rounded-2xl backdrop-blur-xl shadow-xl text-xs">
          {[
            {
              idx: 0,
              title: "🎓 1. Student Intern",
              badge: "Tier 1",
              badgeClass: "bg-indigo-500/20 text-indigo-300",
              desc: "Only role that punches daily attendance, drafts logbooks with AI Polish & checks milestone tasks.",
            },
            {
              idx: 1,
              title: "🏢 2. Field Supervisor",
              badge: "Tier 2 Host",
              badgeClass: "bg-emerald-500/20 text-emerald-300",
              desc: "Pre-provisioned login bound to assigned company interns. Signs off daily technical logs or requests revisions.",
            },
            {
              idx: 2,
              title: "🏛️ 3. Uni Supervisor",
              badge: "Tier 3 Faculty",
              badgeClass: "bg-sky-500/20 text-sky-300",
              desc: "Certifies academic milestone phases across companies & grades official Mid-Term/Final rubrics.",
            },
            {
              idx: 3,
              title: "⚖️ 4. Uni Admin (Dean)",
              badge: "Tier 4 Dean",
              badgeClass: "bg-purple-500/20 text-purple-300",
              desc: "Creates supervisor accounts, pairs dual mentors (`supervisors:assign`), governs RBAC & exports dossiers.",
            },
          ].map((card) => {
            const isAct = activeRole === card.idx;
            return (
              <div
                key={card.idx}
                onClick={() => onSelectRole(card.idx, true)}
                className={cn(
                  "cursor-pointer p-2.5 rounded-xl border transition flex flex-col justify-between",
                  isAct ? "border-indigo-400/60 bg-indigo-500/15" : "border-white/10 bg-white/5 hover:bg-white/10",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">{card.title}</span>
                  <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded", card.badgeClass)}>{card.badge}</span>
                </div>
                <p className={cn("text-[11px] mt-1", isAct ? "text-zinc-300" : "text-zinc-400")}>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
