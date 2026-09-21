import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileBarChart,
  FilePenLine,
  GraduationCap,
  Quote,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternTrack — Smart Internship Logbook & Monitoring" },
      {
        name: "description",
        content:
          "Replace paper internship logbooks with digital daily activity records, attendance tracking, supervisor approvals and automatic reports.",
      },
      { property: "og:title", content: "InternTrack — Smart Internship Logbook & Monitoring" },
      {
        property: "og:description",
        content:
          "A centralized platform for students, supervisors, organizations and universities to track internship progress in real time.",
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
    title: "Digital logbook",
    body: "Daily activities with tools used, skills gained, challenges and evidence — searchable and timestamped.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance tracking",
    body: "Digital check-in and check-out with automatic timestamps and attendance percentage.",
  },
  {
    icon: Users,
    title: "Supervisor review",
    body: "Approve, request corrections and leave feedback on every submitted entry.",
  },
  {
    icon: FileBarChart,
    title: "Automatic reports",
    body: "Weekly, monthly and final internship reports generated from real logbook data.",
  },
  {
    icon: FilePenLine,
    title: "AI writing assistant",
    body: "Turn rough notes into professional, well-structured activity descriptions.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based security",
    body: "Students, supervisors, organizations and university admins each see only what they should.",
  },
];

const FEATURE_ACCENTS = ["bg-info/10 text-info", "bg-success/10 text-success", "bg-warning/15 text-warning-foreground", "bg-accent/15 text-accent-foreground", "bg-primary/10 text-primary", "bg-destructive/10 text-destructive"];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-hero shadow-card">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold">InternTrack</span>
        </div>
        <Button asChild size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      <section className="relative bg-gradient-hero">
        <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full border border-primary-foreground/10" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 text-primary-foreground lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="relative z-10">
            <Badge className="border-0 bg-primary-foreground/15 text-primary-foreground shadow-sm">
              Education Technology
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight lg:text-6xl">
              Smart internship activity management and monitoring
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
              InternTrack replaces the paper logbook with a secure online platform where students
              record daily work, supervisors approve progress, and institutions monitor every
              internship in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth">Create an account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/auth">I already have one</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-3 text-sm text-primary-foreground/70">
              <div className="flex -space-x-2">
                {["JM", "AK", "RN"].map((initials, index) => (
                  <span
                    key={initials}
                    className={`flex size-8 items-center justify-center rounded-full border-2 border-primary/40 text-[10px] font-bold text-primary-foreground ${["bg-info", "bg-success", "bg-warning"][index]}`}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <span>Built for students, supervisors and institutions</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:justify-self-end">
            <div className="absolute -inset-3 rounded-[2rem] bg-primary-foreground/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-primary-foreground/20 bg-card/10 p-2 shadow-elevated backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
                alt="Students collaborating around a laptop"
                className="aspect-[4/3] w-full rounded-[1.1rem] object-cover"
              />
              <div className="absolute inset-x-7 bottom-7 rounded-xl border border-border/60 bg-card/95 p-4 text-card-foreground shadow-elevated backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-sm font-semibold">Week 06 progress</p>
                    <p className="mt-1 text-xs text-muted-foreground">Logbook up to date</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-success/15 text-sm font-bold text-success">84%</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[84%] rounded-full bg-success" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-card-foreground shadow-card sm:flex">
              <CheckCircle2 className="size-4 text-success" />
              <span className="text-xs font-semibold">Supervisor approved</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">One connected workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Everything an internship programme needs</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-right">
            No more lost logbooks, delayed updates or last-minute report writing.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, index) => (
            <Card key={f.title} className="group border-border/70 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
              <CardContent className="p-6">
                <div className={`flex size-11 items-center justify-center rounded-xl ${FEATURE_ACCENTS[index]}`}>
                  <f.icon className="size-5" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-secondary/45">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
          <Quote className="size-8 text-primary/40" />
          <p className="max-w-3xl font-display text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            “The easiest way to turn everyday internship work into a clear record of growth.”
          </p>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">InternTrack</span>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <p className="text-center text-sm text-muted-foreground">
          InternTrack — Smart Internship Activity Management and Monitoring System
        </p>
      </footer>
    </div>
  );
}
