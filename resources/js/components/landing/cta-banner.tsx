import { ArrowRight, Check, GraduationCap, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero px-6 py-16 sm:px-16 sm:py-20 text-center text-primary-foreground shadow-elevated border border-white/10">
          {/* Subtle Ambient Shapes */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-primary-foreground/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="size-3.5 text-accent" />
              <span>Accreditation Ready in Under 48 Hours</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to eliminate paper logbooks for good?
            </h2>

            <p className="text-base sm:text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Empower your students, industry supervisors, and faculty assessors with an accredited,
              real-time internship operating system.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                asChild
                size="lg"
                className="h-12 w-full sm:w-auto rounded-xl px-8 text-sm font-bold bg-white text-foreground hover:bg-white/90 shadow-elevated"
              >
                <Link to="/auth">
                  Launch Interactive Demo <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full sm:w-auto rounded-xl px-8 text-sm font-semibold border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <a href="#how-it-works">Explore Full Workflow</a>
              </Button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/75 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="size-4" strokeWidth={2.5} />
                Instant Role Switcher
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4" strokeWidth={2.5} />
                Zero Setup Cost
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-4" strokeWidth={2.5} />
                Full Institutional Data Sovereignty
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
