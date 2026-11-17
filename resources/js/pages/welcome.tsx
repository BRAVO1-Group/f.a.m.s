import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

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
    <div className="relative h-screen w-screen overflow-hidden bg-[#0b2f20]">
      {/* ── The Complete FAMS Interactive Hero Experience ── */}
      <iframe
        src="/index.html"
        className="block h-full w-full select-none border-0"
        title="FAMS — Field Attachment Management System"
        loading="eager"
      />

      {/* ── Emphasized Launch Workspace & Sign-In Call to Action ── */}
      <div className="pointer-events-auto fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
        <div className="group relative flex items-center">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-70 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg" />

          <Link
            to="/auth"
            className="relative flex items-center gap-3 rounded-full border border-emerald-400/40 bg-[#0a1f15]/95 px-5 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-300 group-hover:bg-[#0e2c1e] active:scale-98 sm:px-6 sm:py-3.5"
            aria-label="Launch Live Workspace — Sign In to InternTrack & Dashboards"
          >
            <div className="relative flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xs font-extrabold tracking-wide text-white sm:text-sm">
                  Launch Live Workspace
                </span>
                <Sparkles className="size-3.5 text-emerald-300" />
              </div>
              <span className="mt-0.5 font-mono text-[10px] font-medium text-emerald-300/80">
                Sign In &rarr; Direct to Dashboards
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
