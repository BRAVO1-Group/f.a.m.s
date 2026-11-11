import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b2f20]">
      {/* ── The Complete FAMS Interactive Hero Experience ── */}
      <iframe
        src="/index.html"
        className="w-full h-full border-0 select-none block"
        title="FAMS — Field Attachment Management System"
        loading="eager"
      />

      {/* ── Emphasized Launch Workspace & Sign-In Call to Action (Repositioned with high visual hierarchy) ── */}
      <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 pointer-events-auto">
        <div className="group relative flex items-center">
          {/* Ambient emerald energy glow behind the CTA */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-70 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg" />

          <Link
            to="/auth"
            className="relative flex items-center gap-3 rounded-full bg-[#0a1f15]/95 px-5 py-3 sm:px-6 sm:py-3.5 border border-emerald-400/40 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:bg-[#0e2c1e] group-hover:border-emerald-300 group-hover:scale-105 active:scale-98"
            aria-label="Launch Live Workspace — Sign In to InternTrack & Dashboards"
          >
            {/* Pulsing Live indicator */}
            <div className="relative flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </div>

            {/* CTA Copy */}
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

            {/* Action pill & arrow */}
            <div className="flex items-center justify-center size-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-transform duration-300 group-hover:bg-emerald-500 group-hover:text-emerald-950 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
