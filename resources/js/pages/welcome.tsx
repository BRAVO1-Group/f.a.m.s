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
import { HeroPreview } from "@/components/landing/hero-preview";
import { TrustBar } from "@/components/landing/trust-bar";
import { BentoGrid } from "@/components/landing/bento-grid";
import { LifecycleJourney } from "@/components/landing/lifecycle-journey";
import { StakeholderShowcase } from "@/components/landing/stakeholder-showcase";
import { ComplianceSecurity } from "@/components/landing/compliance-security";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaBanner } from "@/components/landing/cta-banner";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* ── Top Announcement Bar ── */}
      <div className="relative z-40 border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-xs font-medium text-foreground backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="flex size-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-primary">InternTrack 2.0 Live:</span>
          <span className="hidden sm:inline text-muted-foreground">
            Accredited dual-supervision workflow & automated university defense dossiers.
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
          <Link to="/" className="flex items-center gap-3 group" aria-label="InternTrack home">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <GraduationCap className="size-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                InternTrack
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                Internship Operating System
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
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
        {/* ── Hero Section ── */}
        <section className="relative isolate overflow-hidden bg-grid-pattern pt-14 pb-20 sm:pt-22 sm:pb-28">
          {/* Ambient Background Glows */}
          <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-36 top-20 -z-10 size-[36rem] rounded-full bg-accent/15 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-2xs">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Accredited Higher Education Internship OS • CUE & TVETA Aligned</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem] lg:leading-[1.08]">
                Where internship experience becomes{" "}
                <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                  verified proof
                </span>
                .
              </h1>

              {/* Subheading */}
              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Say goodbye to lost paper logbooks, unverified attendance, and last-minute defense
                panics. InternTrack unites students, workplace mentors, and university faculty
                assessors into one real-time, accredited platform.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full rounded-xl px-7 text-sm font-bold shadow-elevated sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/auth">
                    Try Interactive Demo <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <a
                  href="#features"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-card hover:border-primary/40 sm:w-auto shadow-2xs"
                >
                  <Layers className="size-4 text-muted-foreground" />
                  Explore Capabilities
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="size-4 text-primary" strokeWidth={2.5} />
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-4 text-primary" strokeWidth={2.5} />
                  Pre-configured demo personas
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-4 text-primary" strokeWidth={2.5} />
                  Accredited defense rubric format
                </span>
              </div>
            </div>

            {/* ── Interactive Live Product Sandbox Preview ── */}
            <div id="preview-sandbox" className="relative mt-14 sm:mt-18">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl opacity-70" />

              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-elevated">
                {/* Window Chrome Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-muted/40 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#ef4444]" />
                    <span className="size-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="size-2.5 rounded-full bg-[#10b981]" />
                    <span className="ml-3 hidden text-xs font-mono text-muted-foreground/80 sm:inline">
                      app.interntrack.internal/workspace
                    </span>
                  </div>

                  {/* Sandbox Role Switcher Tabs */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActivePreview("student")}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition font-medium ${
                        activePreview === "student"
                          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <BookOpen className="size-3.5" />
                      Student View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreview("supervisor")}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition font-medium ${
                        activePreview === "supervisor"
                          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <ShieldCheck className="size-3.5" />
                      Supervisor View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreview("university")}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition font-medium ${
                        activePreview === "university"
                          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <GraduationCap className="size-3.5" />
                      University View
                    </button>
                  </div>
                </div>

                {/* Preview Tab Contents */}
                <div className="p-4 sm:p-7 bg-background/50">
                  {/* ────────────────── 1. STUDENT VIEW ────────────────── */}
                  {activePreview === "student" && (
                    <div className="space-y-4 sm:space-y-5">
                      {/* Interactive Simulation Controls Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3.5 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary flex items-center gap-1">
                            <Sparkles className="size-3.5" />
                            Interactive Simulator:
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">
                            Switch entries or test clock-in
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex rounded-lg border border-border bg-card p-0.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() => setSimActiveEntry(1)}
                              className={`rounded-md px-2.5 py-1 font-medium transition ${
                                simActiveEntry === 1
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Sept 23 (API)
                            </button>
                            <button
                              type="button"
                              onClick={() => setSimActiveEntry(2)}
                              className={`rounded-md px-2.5 py-1 font-medium transition ${
                                simActiveEntry === 2
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Sept 24 (Database)
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSimClockedIn(!simClockedIn);
                              if (!simClockedIn) {
                                toast.success(
                                  "Simulated Clock-In recorded! Verified via TechCorp WiFi beacon.",
                                );
                              } else {
                                toast.info(
                                  "Simulated Clock-Out: 8.5 work hours logged for accreditation.",
                                );
                              }
                            }}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                              simClockedIn
                                ? "border-success/40 bg-success/15 text-success"
                                : "border-border bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            <Clock className="size-3" />
                            {simClockedIn ? "Clocked In (08:30)" : "Clock In"}
                          </button>
                        </div>
                      </div>

                      {/* Student Summary Top Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xs shrink-0">
                            AW
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-foreground">
                                Alice Wanjiku
                              </h3>
                              <Badge
                                variant="outline"
                                className="border-[#cbe4d1] bg-[#ecf7ed] text-[#1e5837] dark:border-success/30 dark:bg-success/20 dark:text-success text-xs font-medium rounded-full px-2.5 py-0.5"
                              >
                                Active Placement
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Software Engineering Intern @ TechCorp Kenya Ltd • Week 9 of 12
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs text-muted-foreground">Required Days:</span>
                          <span className="font-bold text-xs sm:text-sm text-foreground">
                            {simVerifiedDays} / 60 ({Math.round((simVerifiedDays / 60) * 100)}%)
                          </span>
                          <div className="h-2 w-24 sm:w-36 overflow-hidden rounded-full bg-[#eae7dd] dark:bg-muted shrink-0">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.round((simVerifiedDays / 60) * 100))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mock Logbook Entry Card */}
                      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-2xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <FileText className="size-4" />
                            </span>
                            <span className="font-bold text-sm text-foreground">
                              {simActiveEntry === 1
                                ? "Today's Activity Entry"
                                : "Daily Activity Entry"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {simActiveEntry === 1
                                ? "• Sept 23, 2026 (08:30 - 17:00)"
                                : "• Sept 24, 2026 (08:30 - 17:00)"}
                            </span>
                          </div>

                          {/* Dynamic Status Badge */}
                          {(simActiveEntry === 1 ? simStatusEntry1 : simStatusEntry2) ===
                          "approved" ? (
                            <Badge className="bg-[#205e42] hover:bg-[#184933] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                              <CheckCircle2 className="size-3.5" />
                              Approved by James Otieno
                            </Badge>
                          ) : (simActiveEntry === 1 ? simStatusEntry1 : simStatusEntry2) ===
                            "pending" ? (
                            <Badge
                              variant="outline"
                              className="border-warning/40 bg-warning/15 text-warning-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                            >
                              <Clock className="size-3.5" />
                              In Review • Awaiting James Otieno
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-destructive/40 bg-destructive/15 text-destructive text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                            >
                              <AlertCircle className="size-3.5" />
                              Revision Requested by Supervisor
                            </Badge>
                          )}
                        </div>

                        {simActiveEntry === 1 ? (
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                              Implemented REST API Endpoints with Zod Validation
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              Built robust authentication & user onboarding endpoints using Node.js
                              and Express. Integrated schema validation with Zod and achieved 90%
                              unit test coverage using Jest.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                              Designed PostgreSQL Schema & Indexing for Analytics Pipeline
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              Drafted entity relationship diagrams and wrote migration scripts in
                              Prisma for time-series attendance records. Benchmarked query execution
                              performance using EXPLAIN ANALYZE on 50,000 synthetic rows.
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Tools & Skills:
                          </span>
                          {(simActiveEntry === 1
                            ? ["Node.js", "Express", "Zod", "Jest", "REST API", "Unit Testing"]
                            : [
                                "PostgreSQL",
                                "Prisma",
                                "Docker",
                                "SQL Optimization",
                                "Data Modeling",
                              ]
                          ).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Supervisor Feedback Bubble */}
                        <div className="rounded-xl border border-[#d6e7dc] dark:border-primary/20 bg-[#f4f8f4] dark:bg-primary/10 p-3.5 sm:p-4 text-xs text-foreground mt-3">
                          <div className="flex items-center gap-2 font-semibold text-[#154d35] dark:text-primary">
                            <MessageSquareCheck className="size-4" />
                            <span>Mentor Feedback — James Otieno (Senior Staff Engineer)</span>
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground italic leading-relaxed">
                            "{simActiveEntry === 1 ? simFeedbackEntry1 : simFeedbackEntry2}"
                          </p>
                        </div>

                        {/* Simulation hint */}
                        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                          <span>
                            Tip: Switch to <strong>Supervisor View</strong> above to approve or
                            update feedback for Alice!
                          </span>
                          <button
                            type="button"
                            onClick={() => setActivePreview("supervisor")}
                            className="font-semibold text-primary underline underline-offset-2 hover:opacity-80"
                          >
                            Open Supervisor View →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ────────────────── 2. SUPERVISOR VIEW ────────────────── */}
                  {activePreview === "supervisor" && (
                    <div className="space-y-4 sm:space-y-5">
                      {/* Supervisor Top Bar (Field Supervisor dispatched by University) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-xs shrink-0">
                            JO
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-foreground">
                                James Otieno
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-xs border-primary/30 bg-primary/10 text-primary"
                              >
                                Field Supervisor (TechCorp Kenya Ltd)
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              University Dispatched Logins • Reviewing assigned intern:{" "}
                              <strong>Alice Wanjiku</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            1 Pending Review
                          </Badge>
                        </div>
                      </div>

                      {/* Review Cards Grid */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Alice Wanjiku's Submission Card */}
                        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-primary">
                                Alice Wanjiku • Sept 24 Log
                              </p>
                              <h4 className="text-sm font-semibold text-foreground mt-0.5">
                                Designed PostgreSQL Schema & Indexing
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Submitted today at 17:00 • Prisma & EXPLAIN ANALYZE
                              </p>
                            </div>
                            <Badge
                              variant={simStatusEntry2 === "approved" ? "default" : "outline"}
                              className={`text-[11px] ${
                                simStatusEntry2 === "approved"
                                  ? "bg-[#205e42] text-white"
                                  : simStatusEntry2 === "needs_correction"
                                    ? "border-destructive/40 text-destructive bg-destructive/10"
                                    : "border-warning/40 text-warning-foreground bg-warning/10"
                              }`}
                            >
                              {simStatusEntry2 === "approved"
                                ? "Approved"
                                : simStatusEntry2 === "needs_correction"
                                  ? "Revision Requested"
                                  : "In Review"}
                            </Badge>
                          </div>

                          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Student Log Summary:{" "}
                            </span>
                            Drafted ER diagrams and wrote migration scripts in Prisma.
                          </div>

                          {/* Quick Interactive Actions */}
                          <div className="space-y-2 pt-1 border-t border-border/60">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] text-muted-foreground font-medium">
                                Supervisor Action:
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSimStatusEntry2("needs_correction");
                                    setSimFeedbackEntry2(
                                      "Please attach query benchmark execution times and foreign key diagrams.",
                                    );
                                    toast.error(
                                      "Revision requested: Alice has been notified via email & dashboard.",
                                    );
                                  }}
                                  className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                                >
                                  Request Revision
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSimStatusEntry2("approved");
                                    if (simStatusEntry2 !== "approved") {
                                      setSimVerifiedDays((prev) => Math.min(60, prev + 1));
                                    }
                                    toast.success(
                                      "Approved by James Otieno! Digitally stamped for University clearance.",
                                    );
                                  }}
                                  className="h-7 text-xs bg-primary text-primary-foreground font-semibold"
                                >
                                  Quick Approve
                                </Button>
                              </div>
                            </div>

                            {/* Quick Feedback Presets */}
                            <div>
                              <p className="text-[11px] text-muted-foreground mb-1 font-medium">
                                Quick Feedback Presets (updates student view live):
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  "Great database normalization!",
                                  "Solid indexing strategy on logs table.",
                                  "Ready for staging migration.",
                                ].map((preset) => (
                                  <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                      setSimFeedbackEntry2(preset);
                                      toast.success("Mentor feedback updated on Alice's logbook!");
                                    }}
                                    className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-foreground hover:bg-muted transition"
                                  >
                                    {preset}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Assigned Student (Mark Mwangi) */}
                        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-primary">
                                Mark Mwangi • Sept 24 Log
                              </p>
                              <h4 className="text-sm font-semibold text-foreground mt-0.5">
                                Firewall Configuration & VLAN Isolation
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                Submitted today at 16:45 • Cisco CLI, Wireshark
                              </p>
                            </div>
                            <Badge
                              variant={simMarkApproved ? "default" : "outline"}
                              className={`text-[11px] ${
                                simMarkApproved
                                  ? "bg-[#205e42] text-white"
                                  : "border-warning/40 text-warning-foreground bg-warning/10"
                              }`}
                            >
                              {simMarkApproved ? "Approved" : "In Review"}
                            </Badge>
                          </div>

                          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              Student Log Summary:{" "}
                            </span>
                            Configured subnets for engineering department & verified packet drop
                            logs.
                          </div>

                          <div className="flex items-center justify-between border-t border-border/60 pt-3">
                            <span className="text-[11px] text-muted-foreground">
                              Tools: Cisco IOS, Wireshark
                            </span>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSimMarkApproved(true);
                                toast.success(
                                  "Signed off for Mark Mwangi (Firewall configuration & VLAN isolation)",
                                );
                              }}
                              className="h-7 text-xs bg-primary text-primary-foreground font-semibold"
                            >
                              {simMarkApproved ? "Approved" : "Quick Approve"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ────────────────── 3. UNIVERSITY VIEW ────────────────── */}
                  {activePreview === "university" && (
                    <div className="space-y-4 sm:space-y-5">
                      {/* University Header */}
                      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-foreground">
                                Cohort Compliance & Accreditation Dashboard
                              </h3>
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                96% On Track
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              University of Nairobi • Department of Computer Science • Dean's Office
                              & Faculty Oversight
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                toast.success(
                                  "Accredited Logbook PDF generated with university stamp (Simulated preview).",
                                );
                              }}
                              className="h-8 text-xs font-semibold"
                            >
                              <FileCheck className="mr-1.5 size-3.5 text-primary" />
                              Export PDF Summary
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Stat Metrics Grid */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                          <p className="text-xs text-muted-foreground">Average Attendance</p>
                          <p className="font-display text-2xl font-bold mt-1 text-foreground">
                            94.8%
                          </p>
                          <p className="text-[11px] text-success mt-1 flex items-center gap-1 font-medium">
                            <TrendingUp className="size-3" /> +3.2% vs last term
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                          <p className="text-xs text-muted-foreground">Verified Logbook Entries</p>
                          <p className="font-display text-2xl font-bold mt-1 text-foreground">
                            1,420
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Across 18 host organizations
                          </p>
                        </div>
                        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                          <p className="text-xs text-muted-foreground">
                            Pending Mid-Term Clearances
                          </p>
                          <p className="font-display text-2xl font-bold mt-1 text-foreground">3</p>
                          <p className="text-[11px] text-warning mt-1 font-medium">
                            Automated reminders dispatched
                          </p>
                        </div>
                      </div>

                      {/* Institutional Student Placement Spotlight Card */}
                      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                          <div>
                            <span className="text-xs font-bold text-primary">
                              Student Placement Spotlight:
                            </span>
                            <h4 className="text-sm font-semibold text-foreground">
                              Alice Wanjiku (BSc CS • UoN-CS-2023-0491)
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                toast.success(
                                  "Mid-Term Audit Passed: 100% of Alice's submitted entries verified by TechCorp Kenya Ltd.",
                                );
                              }}
                              className="h-7 text-xs bg-primary text-primary-foreground font-semibold"
                            >
                              Run Mid-Term Audit
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 text-xs">
                          <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                            <span className="text-muted-foreground block text-[11px]">
                              Field Supervisor (Dispatched):
                            </span>
                            <span className="font-semibold text-foreground">
                              James Otieno @ TechCorp
                            </span>
                          </div>
                          <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                            <span className="text-muted-foreground block text-[11px]">
                              Faculty Advisor:
                            </span>
                            <span className="font-semibold text-foreground">
                              Dr. Agnes Kimani (UoN)
                            </span>
                          </div>
                          <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                            <span className="text-muted-foreground block text-[11px]">
                              Accreditation Progress:
                            </span>
                            <span className="font-semibold text-primary">
                              {simVerifiedDays} of 60 Days Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulation Sandbox Footer Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-muted/20 px-4 py-2.5 sm:px-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-primary" />
                    <span>
                      Interactive sandbox: Live bidirectional state simulation between student,
                      supervisor, and university.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition"
                  >
                    <RotateCcw className="size-3" />
                    Reset Simulation
                  </button>
                </div>
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

              {/* Feature 4 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-elevated">
                <div className="flex size-12 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheck className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  Supervisor Feedback Loop
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Give mentors a clean review queue. One-click approvals, inline constructive
                  criticism, and structured rubric evaluations keep interns growing.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span>Weekly sign-off velocity</span>
                  <ChevronRight className="size-3" />
                </div>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-elevated">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  Accredited Report Generation
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Export weekly logs, attendance summaries, supervisor signatures, and competency
                  assessments into a pristine PDF dossier ready for academic grading.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span>Zero end-of-term stress</span>
                  <ChevronRight className="size-3" />
                </div>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-elevated">
                <div className="flex size-12 items-center justify-center rounded-xl bg-warning/10 text-warning-foreground">
                  <Award className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  Competency & Skill Matrix
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Map real-world tasks to tangible skills. Build a verified portfolio showing your
                  practical experience across modern tech stacks and workflows.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary">
                  <span>Verified portfolio ready</span>
                  <ChevronRight className="size-3" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stakeholder Persona Tabs ── */}
        <section id="roles" className="border-y border-border bg-card/60 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                Tailored Workflows
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                A shared source of truth for everyone
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Designed specifically for the tri-party relationship between the intern, industry
                mentor, and academic coordinator.
              </p>

              {/* Persona Tab Buttons */}
              <div className="mt-8 flex w-full flex-col rounded-xl border border-border bg-background p-1.5 shadow-xs sm:inline-flex sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() => setActiveRoleTab("students")}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition sm:w-auto sm:text-sm ${
                    activeRoleTab === "students"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Students & Interns
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleTab("supervisors")}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition sm:w-auto sm:text-sm ${
                    activeRoleTab === "supervisors"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For Workplace Supervisors
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleTab("universities")}
                  className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition sm:w-auto sm:text-sm ${
                    activeRoleTab === "universities"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For University Coordinators
                </button>
              </div>
            </div>

            {/* Persona Content Area */}
            <div className="mt-12 rounded-2xl border border-border bg-background p-6 sm:p-10 shadow-elevated">
              {activeRoleTab === "students" && (
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/5"
                    >
                      Student Experience
                    </Badge>
                    <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                      Focus on learning, not administrative busywork.
                    </h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      Capture daily breakthroughs, tag technologies used, and build an ongoing
                      timeline of your placement that turns directly into your final academic
                      defense.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-foreground">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Log daily achievements in under 2 minutes with markdown support
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Instant attendance clock-in with daily hour tracking
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Clear visibility into supervisor feedback and milestone deadlines
                      </li>
                    </ul>
                    <div className="mt-8">
                      <Button asChild className="rounded-xl">
                        <Link to="/dashboard" search={{ role: "student" }}>
                          Experience Student Demo →
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Student Testimonial
                    </p>
                    <blockquote className="mt-4 text-base italic text-foreground leading-relaxed">
                      "InternTrack took all the pain out of my final submission. Instead of spending
                      my last weekend hunting down signatures, I downloaded a verified 40-page PDF
                      report that my lecturer graded an A."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                        AW
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Alice Wanjiku</p>
                        <p className="text-xs text-muted-foreground">
                          Software Intern @ TechCorp Kenya
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === "supervisors" && (
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/5"
                    >
                      Supervisor Experience
                    </Badge>
                    <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                      Mentor effectively without losing hours to paperwork.
                    </h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      Review weekly submissions in a unified queue. Approve entries with a single
                      click, leave targeted technical feedback, and complete mid-term evaluations
                      effortlessly.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-foreground">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Batch review student logbooks in under 5 minutes per week
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Structured evaluation rubrics for technical, punctuality, and
                        problem-solving skills
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Official digital verification timestamped for university compliance
                      </li>
                    </ul>
                    <div className="mt-8">
                      <Button asChild className="rounded-xl">
                        <Link to="/dashboard" search={{ role: "supervisor" }}>
                          Experience Supervisor Demo →
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Industry Supervisor Testimonial
                    </p>
                    <blockquote className="mt-4 text-base italic text-foreground leading-relaxed">
                      "I mentor 4 engineering interns each semester. InternTrack turned hours of
                      paper signing into a 5-minute Friday morning check. The students get immediate
                      feedback, and our team stays aligned."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-accent/20 text-accent-foreground font-bold flex items-center justify-center">
                        JO
                      </div>
                      <div>
                        <p className="text-sm font-semibold">James Otieno</p>
                        <p className="text-xs text-muted-foreground">
                          Lead Engineer @ TechCorp Kenya Ltd
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === "universities" && (
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div>
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary bg-primary/5"
                    >
                      Academic Administration
                    </Badge>
                    <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                      Complete visibility and automated accreditation audits.
                    </h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      Track hundreds of placements across different companies in real time. Flag
                      attendance drops before they become problems, and download audit-ready
                      compliance dossiers.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-foreground">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Centralized department analytics across all active placements
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Early-warning alerts for low attendance or lagging logbook submissions
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="size-5 text-primary shrink-0" />
                        Institutional exports ready for academic board review & grading
                      </li>
                    </ul>
                    <div className="mt-8">
                      <Button asChild className="rounded-xl">
                        <Link to="/dashboard" search={{ role: "uni_admin" }}>
                          Experience University Admin Demo →
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Faculty Dean Testimonial
                    </p>
                    <blockquote className="mt-4 text-base italic text-foreground leading-relaxed">
                      "For the first time, our department has complete, real-time insight into what
                      our 200+ computing students are actually doing on attachment. It raised our
                      verification rate to 100%."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                        PK
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Dr. Peter Kamau</p>
                        <p className="text-xs text-muted-foreground">
                          Dean, School of Computing & Informatics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 4-Stage Placement Journey ── */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                Clear Progression
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                How an internship unfolds with InternTrack
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                From Day 1 onboarding to your final capstone presentation.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                  01
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">Setup & Placement Match</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Connect your placement with your university supervisor and company mentor.
                  Establish required days and learning objectives.
                </p>
              </div>

              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                  02
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">
                  Daily Logging & Check-Ins
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Clock in your daily attendance. Document tools used, architectural decisions,
                  challenges faced, and solutions designed.
                </p>
              </div>

              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                  03
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">Weekly Mentor Feedback</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Supervisors review submitted entries, leave actionable feedback notes, and verify
                  milestones as deliverables are completed.
                </p>
              </div>

              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm">
                  04
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">
                  Accredited Final Dossier
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Export complete verified dossiers with supervisor evaluations, grade summaries,
                  and full attendance records ready for graduation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section (Radix Accordion) ── */}
        <section id="faq" className="border-t border-border bg-card/40 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="text-center">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                Common Questions
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Everything you need to know about adopting InternTrack.
              </p>
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-semibold text-base">
                    Does InternTrack replace the official physical university logbook?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Yes. InternTrack is built to fulfill academic accreditation standards. The
                    generated PDF dossier adheres to standard university formats, complete with date
                    stamps, supervisor signatures, hours calculations, and milestone completion
                    sign-offs.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-semibold text-base">
                    What happens if a supervisor does not approve entries immediately?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    InternTrack keeps entries in a clean "Submitted / Pending Review" state.
                    Supervisors receive weekly summary reminders and can approve multiple entries
                    simultaneously in under two minutes through the batch review queue.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-semibold text-base">
                    Can students export their logbooks for personal job applications?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Absolutely! In addition to academic reports, students can export a verified
                    competency portfolio summarizing the tools used, hours logged, and key projects
                    executed during their placement to share with future employers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-semibold text-base">
                    How do demo accounts work in this environment?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Our live environment is fully functional with preloaded mock personas. You can
                    instantly switch between Alice (Student Intern), James (Field Supervisor), and
                    Dr. Peter Kamau (University Dean) with zero account creation required.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* ── High-Impact Conversion CTA Banner ── */}
        <CtaBanner />
      </main>

      {/* ── Modern Footer ── */}
      <LandingFooter />
    </div>
  );
}
