import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  Sparkles,
  Users,
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
    icon: BookOpen,
    title: "A logbook you'll keep up with",
    body: "Capture what you worked on, the tools you used and what you learned. Search every entry when report time comes.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: CalendarCheck,
    title: "Attendance, without the paper",
    body: "Check in and out in seconds. Your attendance history and progress toward required days stay together.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: ClipboardCheck,
    title: "Feedback that moves work forward",
    body: "Supervisors can review submissions, approve progress or request a correction with useful feedback.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: FileText,
    title: "Reports from work already done",
    body: "Bring activities, skills and tools into weekly, monthly and final report exports—no last-minute scramble.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Sparkles,
    title: "A hand with the hard part",
    body: "Turn rough activity notes into a clearer professional description with the writing assistant.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Users,
    title: "One view for every role",
    body: "Students, supervisors, organization admins and universities get tools that fit their part in the programme.",
    color: "bg-cyan-100 text-cyan-700",
  },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f5] text-slate-900">
      <header className="border-b border-slate-200/80 bg-[#f7f8f5]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="InternTrack home">
            <span className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">InternTrack</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a className="transition hover:text-slate-950" href="#features">
              Platform
            </a>
            <a className="transition hover:text-slate-950" href="#how-it-works">
              How it works
            </a>
            <a className="transition hover:text-slate-950" href="#for-everyone">
              Who it's for
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden text-sm font-semibold text-slate-700 transition hover:text-slate-950 sm:inline"
            >
              Demo access
            </Link>
            <Button asChild size="sm" className="rounded-lg bg-slate-900 px-4 hover:bg-slate-700">
              <Link to="/auth">
                Get started <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:pt-28">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                INTERNSHIP MANAGEMENT, MADE CLEAR
              </div>
              <h1 className="mt-6 max-w-2xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-[4.35rem]">
                Your internship,
                <span className="block text-emerald-700">in focus.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Keep daily work, attendance and supervisor feedback in one place. Spend less time
                chasing paperwork and more time learning on the job.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-slate-900 px-6 text-sm hover:bg-slate-700"
                >
                  <Link to="/auth">
                    Explore InternTrack <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  See what you can do <ArrowRight className="size-4" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {["Daily activity log", "Fast supervisor review", "Ready-to-export reports"].map(
                  (label) => (
                    <span key={label} className="inline-flex items-center gap-2">
                      <Check className="size-4 text-emerald-700" strokeWidth={2.5} />
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:justify-self-end">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-emerald-200/35 blur-2xl" />
              <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-[0_28px_80px_-34px_rgba(15,23,42,0.35)] sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-100 px-2 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                      <ChartNoAxesColumnIncreasing className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Internship overview</p>
                      <p className="text-xs text-slate-500">Your progress at a glance</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    PREVIEW
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-4 sm:gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Internship progress</p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="font-display text-3xl font-bold tracking-tight">72%</p>
                      <span className="mb-1 text-xs font-semibold text-emerald-700">On track</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[72%] rounded-full bg-emerald-600" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">Week 9 of 12</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Attendance days</p>
                    <p className="mt-3 font-display text-3xl font-bold tracking-tight">
                      42<span className="ml-1 text-base font-medium text-slate-400">/ 60</span>
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                      <CalendarCheck className="size-3.5 text-emerald-700" />
                      Last check-in: Today
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between px-4 py-3">
                    <p className="text-xs font-bold text-slate-700">Recent activity</p>
                    <span className="text-[11px] font-medium text-emerald-700">View logbook</span>
                  </div>
                  <div className="space-y-1 px-3 pb-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <BookOpen className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          Updated client onboarding flow
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Today · Product team</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-800">
                        <CheckCircle2 className="size-3" /> Approved
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl p-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <Clock3 className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          Prepared weekly analytics summary
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">Yesterday · Data team</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">
                        In review
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-900">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-700" />
                  Your supervisor reviewed a new activity
                  <span className="ml-auto text-emerald-700">Just now</span>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-lg sm:flex">
                <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="size-4" />
                </span>
                Progress is all in one place
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-slate-200 bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Everything, connected
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Less admin. More meaningful progress.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                From the first check-in to the final report, the important details stay together and
                easy to find.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body, color }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-[#fcfcfb] p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5"
                >
                  <span className={`flex size-11 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  A simple rhythm
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Good work deserves a good record.
                </h2>
                <p className="mt-4 leading-7 text-slate-600">
                  InternTrack makes the day-to-day easier for interns and gives supervisors a
                  clearer picture of progress.
                </p>
                <Button asChild className="mt-7 rounded-xl bg-slate-900 px-5 hover:bg-slate-700">
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
                    icon: BookOpen,
                  },
                  {
                    number: "02",
                    title: "Review",
                    body: "Share work and get timely supervisor feedback.",
                    icon: ClipboardCheck,
                  },
                  {
                    number: "03",
                    title: "Reflect",
                    body: "Turn a full record into clear reports.",
                    icon: FileText,
                  },
                ].map(({ number, title, body, icon: Icon }) => (
                  <article
                    key={number}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold tracking-widest text-emerald-700">
                        {number}
                      </span>
                      <Icon className="size-5 text-slate-400" />
                    </div>
                    <h3 className="mt-8 font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="for-everyone" className="bg-slate-900 py-16 text-white sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Made for the whole programme
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Everyone sees the progress that matters.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                A shared source of truth for interns, supervisors, host organizations and
                universities—without the spreadsheet chase.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 rounded-xl bg-emerald-400 px-6 text-slate-950 hover:bg-emerald-300"
            >
              <Link to="/auth">
                Get started <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-800">
            <GraduationCap className="size-4 text-emerald-700" />
            InternTrack
          </Link>
          <p>Keep the work moving. Keep the progress visible.</p>
          <Link to="/auth" className="font-semibold text-slate-700 hover:text-emerald-700">
            Open workspace <ArrowRight className="ml-1 inline size-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
