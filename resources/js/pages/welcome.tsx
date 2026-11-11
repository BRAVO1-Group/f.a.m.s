import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      {/* ── Floating Launch Workspace Action ── */}
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        <Button
          asChild
          size="sm"
          className="rounded-full bg-emerald-600/90 text-white hover:bg-emerald-500 border border-emerald-400/30 text-xs shadow-lg font-semibold backdrop-blur-md transition-all hover:scale-105"
        >
          <Link to="/auth">
            <Sparkles className="size-3.5 mr-1 text-emerald-200" />
            Launch Live Workspace <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
