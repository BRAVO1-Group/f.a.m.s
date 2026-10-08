import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternTrack — Your internship, in focus" },
      {
        name: "description",
        content:
          "One clear place to log internship work, track attendance, get supervisor feedback and turn progress into polished reports.",
      },
      { property: "og:title", content: "InternTrack — Your internship, in focus" },
      {
        property: "og:description",
        content:
          "A simpler way for students, supervisors and institutions to stay on top of internship progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
    title: "A logbook you'll keep up with",
    body: "Capture what you worked on, the tools you used and what you learned. Search every entry when report time comes.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    title: "Attendance, without the paper",
    body: "Check in and out in seconds. Your attendance history and progress toward required days stay together.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    title: "Feedback that moves work forward",
    body: "Supervisors can review submissions, approve progress or request a correction with useful feedback.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    title: "Reports from work already done",
    body: "Bring activities, skills and tools into weekly, monthly and final report exports—no last-minute scramble.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80",
    title: "A hand with the hard part",
    body: "Turn rough activity notes into a clearer professional description with the writing assistant.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    title: "One view for every role",
    body: "Students, supervisors, organization admins and universities get tools that fit their part in the programme.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="InternTrack home">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">InternTrack</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a className="transition hover:text-foreground" href="#features">
              Platform
            </a>
            <a className="transition hover:text-foreground" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-foreground" href="#for-everyone">
              Who it's for
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden text-sm font-semibold text-secondary-foreground transition hover:text-foreground sm:inline"
            >
              Demo access
            </Link>
            <Button asChild size="sm" className="rounded-lg bg-primary px-4 text-primary-foreground hover:bg-primary/90">
              <Link to="/auth">
                Get started <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-accent/20 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:pt-28">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <span className="size-1.5 rounded-full bg-primary" />
                INTERNSHIP MANAGEMENT, MADE CLEAR
              </div>
              <h1 className="mt-6 max-w-2xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-[4.35rem]">
                Your internship,
                <span className="block text-primary">in focus.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Keep daily work, attendance and supervisor feedback in one place. Spend less time
                chasing paperwork and more time learning on the job.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-primary px-6 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/auth">
                    Explore InternTrack <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-secondary-foreground transition hover:bg-card"
                >
                  See what you can do <ArrowRight className="size-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["Daily activity log", "Fast supervisor review", "Ready-to-export reports"].map(
                  (label) => (
                    <span key={label} className="inline-flex items-center gap-2">
                      <Check className="size-4 text-primary" strokeWidth={2.5} />
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:justify-self-end">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-2xl" />
              <div className="relative rounded-[1.75rem] border border-border bg-card p-3 shadow-elevated sm:p-5">
                <div className="flex items-center justify-between border-b border-border px-2 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ChartNoAxesColumnIncreasing className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground">Internship overview</p>
                      <p className="text-xs text-muted-foreground">Your progress at a glance</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    PREVIEW
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-4 sm:gap-4">
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-xs font-medium text-muted-foreground">Internship progress</p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="font-display text-3xl font-bold tracking-tight">72%</p>
                      <span className="mb-1 text-xs font-semibold text-primary">On track</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-[72%] rounded-full bg-primary" />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">Week 9 of 12</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-xs font-medium text-muted-foreground">Attendance days</p>
                    <p className="mt-3 font-display text-3xl font-bold tracking-tight">
                      42<span className="ml-1 text-base font-medium text-muted-foreground/60">/ 60</span>
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <CalendarCheck className="size-3.5 text-primary" />
                      Last check-in: Today
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border">
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-xs font-bold text-secondary-foreground">Recent activity</p>
                    <span className="text-[11px] font-medium text-primary">View logbook</span>
                  </div>
                  <div className="space-y-1 px-3 pb-3">
                    <div className="flex items-center gap-3 rounded-xl bg-muted/70 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BookOpen className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">
                          Updated client onboarding flow
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">Today · Product team</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                        <CheckCircle2 className="size-3" /> Approved
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                        <Clock3 className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">
                          Prepared weekly analytics summary
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground">Yesterday · Data team</p>
                      </div>
                      <span className="rounded-full bg-accent/20 px-2 py-1 text-[10px] font-semibold text-accent-foreground">
                        In review
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="size-4 shrink-0" />
                  Your supervisor reviewed a new activity
                  <span className="ml-auto">Just now</span>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs font-semibold text-secondary-foreground shadow-lg sm:flex">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-4" />
                </span>
                Progress is all in one place
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-border bg-card py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Everything, connected
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Less admin. More meaningful progress.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                From the first check-in to the final report, the important details stay together and
                easy to find.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ image, title, body }) => (
                <article
                  key={title}
                  className="group overflow-hidden rounded-2xl border border-border bg-background transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <div className="h-44 overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  A simple rhythm
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Good work deserves a good record.
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  InternTrack makes the day-to-day easier for interns and gives supervisors a
                  clearer picture of progress.
                </p>
                <Button asChild className="mt-7 rounded-xl bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                  <Link to="/auth">
                    See the workspace <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    number: "01",
                    title: "Record",
                    body: "Log activities and attendance as you go.",
                  },
                  {
                    number: "02",
                    title: "Review",
                    body: "Share work and get timely supervisor feedback.",
                  },
                  {
                    number: "03",
                    title: "Reflect",
                    body: "Turn a full record into clear reports.",
                  },
                ].map(({ number, title, body }) => (
                  <article
                    key={number}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    <span className="font-display text-xs font-bold tracking-widest text-primary">
                      {number}
                    </span>
                    <h3 className="mt-8 font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="for-everyone" className="bg-sidebar py-16 text-sidebar-foreground sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sidebar-primary">
                Made for the whole programme
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Everyone sees the progress that matters.
              </h2>
              <p className="mt-4 leading-7 text-sidebar-foreground/75">
                A shared source of truth for interns, supervisors, host organizations and
                universities—without the spreadsheet chase.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 rounded-xl bg-sidebar-primary px-6 text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            >
              <Link to="/auth">
                Get started <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold text-secondary-foreground">
            <GraduationCap className="size-4 text-primary" />
            InternTrack
          </Link>
          <p>Keep the work moving. Keep the progress visible.</p>
          <Link to="/auth" className="font-semibold text-secondary-foreground hover:text-primary">
            Open workspace <ArrowRight className="ml-1 inline size-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
