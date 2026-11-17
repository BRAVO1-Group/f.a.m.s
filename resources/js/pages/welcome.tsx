import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import "@/components/landing/fams-stage.css";
import { FAMS_ROLES } from "@/components/landing/fams-roles";
import { FamsPosterScene, type PosterTransitionHandles } from "@/components/landing/fams-poster-scene";
import { AutomotionEngine } from "@/components/landing/automotion-engine";

export default function LandingPage() {
  const [mode, setMode] = useState<"hero" | "case">("hero");
  const [activeRole, setActiveRole] = useState(0);
  const posterHandlesRef = useRef<PosterTransitionHandles | null>(null);

  const handleEnterCase = useCallback(() => {
    setActiveRole(0);
    setMode("case");
  }, []);

  const handleExitCase = useCallback(() => {
    setMode("hero");
    setActiveRole(0);
  }, []);

  const handleSelectRole = useCallback((idx: number) => {
    setActiveRole(idx);
  }, []);

  useEffect(() => {
    let lastWheelTime = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < 800 || Math.abs(e.deltaY) < 18) return;
      lastWheelTime = now;

      if (mode === "hero") {
        if (e.deltaY > 0) {
          posterHandlesRef.current?.toCase();
        }
      } else {
        setActiveRole((prev) =>
          e.deltaY > 0 ? (prev + 1) % FAMS_ROLES.length : (prev - 1 + FAMS_ROLES.length) % FAMS_ROLES.length,
        );
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (mode === "hero") {
        if (["ArrowDown", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          posterHandlesRef.current?.toCase();
        }
      } else {
        if (e.key === "Escape") {
          e.preventDefault();
          posterHandlesRef.current?.toHero();
        } else if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
          e.preventDefault();
          setActiveRole((prev) => (prev + 1) % FAMS_ROLES.length);
        } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
          e.preventDefault();
          setActiveRole((prev) => (prev - 1 + FAMS_ROLES.length) % FAMS_ROLES.length);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mode]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#09090b]">
      <FamsPosterScene
        mode={mode}
        onEnterCase={handleEnterCase}
        onExitCase={handleExitCase}
        handlesRef={posterHandlesRef}
      />

      <AutomotionEngine
        active={mode === "case"}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
      />

      {mode === "case" && (
        <div className="fixed top-3 right-4 z-50 pointer-events-auto">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600/95 hover:bg-indigo-500 px-4 py-2 text-xs font-extrabold text-white border border-indigo-400/40 shadow-xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
            aria-label="Sign In to InternTrack Workspace"
          >
            <span>Sign In</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {mode === "hero" && (
        <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 pointer-events-auto">
          <div className="group relative flex items-center">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-70 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg" />

            <Link
              to="/auth"
              className="relative flex items-center gap-3 rounded-full bg-[#0a1f15]/95 px-5 py-3 sm:px-6 sm:py-3.5 border border-emerald-400/40 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:bg-[#0e2c1e] group-hover:border-emerald-300 group-hover:scale-105 active:scale-98"
              aria-label="Launch Live Workspace — Sign In to InternTrack & Dashboards"
            >
              <div className="relative flex size-2.5 items-center justify-center">
                <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs sm:text-sm font-extrabold tracking-wide text-white">
                    Launch Live Workspace
                  </span>
                  <Sparkles className="size-3.5 text-emerald-300" />
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-300/80 mt-0.5">
                  Sign In &rarr; Direct to Dashboards
                </span>
              </div>

              <div className="flex items-center justify-center size-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-transform duration-300 group-hover:bg-emerald-500 group-hover:text-emerald-950 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
