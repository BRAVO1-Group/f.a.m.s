import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  GraduationCap,
  Layers,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustBar } from "@/components/landing/trust-bar";
import { BentoGrid } from "@/components/landing/bento-grid";
import { LifecycleJourney } from "@/components/landing/lifecycle-journey";
import { StakeholderShowcase } from "@/components/landing/stakeholder-showcase";
import { ComplianceSecurity } from "@/components/landing/compliance-security";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaBanner } from "@/components/landing/cta-banner";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  const [viewMode, setViewMode] = useState<"hero" | "docs">("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default: Immersive FAMS Laptop Dive Hero
  if (viewMode === "hero") {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#0b2f20]">
        {/* The FAMS Laptop Dive Hero Experience */}
        <iframe
          src="/index.html"
          className="w-full h-full border-0 select-none block"
          title="FAMS — Field Attachment Management System"
        />

        {/* Floating Quick Action Dock */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setViewMode("docs")}
            className="rounded-full bg-black/70 text-white border-white/20 backdrop-blur-md hover:bg-black/90 hover:text-white text-xs shadow-lg transition-all"
          >
            <Layers className="size-3.5 mr-1.5" />
            Platform Specs &amp; Workflow
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500 text-xs shadow-lg font-semibold"
          >
            <Link to="/auth">
              Launch App <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Extended Institutional Platform Breakdown
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Floating Return Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          size="sm"
          onClick={() => setViewMode("hero")}
          className="rounded-full bg-emerald-700 text-white hover:bg-emerald-600 shadow-elevated text-xs font-semibold px-4 py-2"
        >
          ← Return to Interactive Hero
        </Button>
      </div>

      {/* ── Top Announcement Bar ── */}
      <div className="relative z-40 border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-xs font-medium text-foreground backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="flex size-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-primary">FAMS 2026 Live:</span>
          <span className="hidden sm:inline text-muted-foreground">
            Field Attachment Management System for universities, students, host organisations and
            supervisors.
          </span>
          <Link
            to="/auth"
            className="ml-1 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Launch Interactive Demo <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* ── Navigation Header ── */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode("hero")}
              className="flex items-center gap-3 group text-left cursor-pointer"
              aria-label="FAMS home"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
                <GraduationCap className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight text-foreground">
                  FAMS
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Field Attachment Management System
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <button
              type="button"
              onClick={() => setViewMode("hero")}
              className="transition hover:text-foreground cursor-pointer font-medium"
            >
              Interactive Hero
            </button>
            <a className="transition hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition hover:text-foreground" href="#roles">
              Stakeholders
            </a>
            <a className="transition hover:text-foreground" href="#how-it-works">
              Workflow
            </a>
            <a className="transition hover:text-foreground" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Button variant="ghost" asChild size="sm" className="text-xs font-semibold">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-xl px-4 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              <Link to="/auth">
                Launch Workspace <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground p-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card px-5 py-4 space-y-3">
            <nav className="flex flex-col space-y-2.5 text-sm font-medium">
              <button
                type="button"
                onClick={() => {
                  setViewMode("hero");
                  setMobileMenuOpen(false);
                }}
                className="text-left text-muted-foreground hover:text-foreground py-1 font-semibold"
              >
                Interactive Hero
              </button>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground py-1"
              >
                Features
              </a>
              <a
                href="#roles"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground py-1"
              >
                Stakeholders
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground py-1"
              >
                Workflow
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground py-1"
              >
                FAQ
              </a>
            </nav>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-center">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="w-full justify-center">
                <Link to="/auth">Launch Workspace</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ── Secondary Hero Section ── */}
        <section className="relative isolate overflow-hidden bg-grid-pattern pt-14 pb-20 sm:pt-22 sm:pb-28">
          <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-36 top-20 -z-10 size-[36rem] rounded-full bg-accent/15 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-2xs">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Field Attachment Management System • Higher Education Accredited</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem] lg:leading-[1.08]">
                Where internship experience becomes{" "}
                <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                  verified proof
                </span>
                .
              </h1>

              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                FAMS connects universities, students, host organisations and supervisors into one
                unified digital attachment management platform.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => setViewMode("hero")}
                  className="h-12 w-full rounded-xl px-7 text-sm font-bold shadow-elevated sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Experience Laptop Dive Hero <Sparkles className="ml-2 size-4" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 w-full rounded-xl px-7 text-sm font-semibold sm:w-auto"
                >
                  <Link to="/auth">
                    Launch Demo App <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Partner & Institutional Trust Bar ── */}
        <TrustBar />

        {/* ── Core Value Pillars (Bento Grid) ── */}
        <BentoGrid />

        {/* ── 4-Stage Placement Lifecycle ── */}
        <LifecycleJourney />

        {/* ── Stakeholder Perspectives Showcase ── */}
        <StakeholderShowcase />

        {/* ── Compliance, Governance & Accreditation ── */}
        <ComplianceSecurity />

        {/* ── FAQ Section ── */}
        <FaqSection />

        {/* ── High-Impact Conversion CTA Banner ── */}
        <CtaBanner />
      </main>

      {/* ── Modern Footer ── */}
      <LandingFooter />
    </div>
  );
}
