import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  FileBarChart,
  GraduationCap,
  ShieldCheck,
  Sparkles,
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
    icon: Sparkles,
    title: "AI writing assistant",
    body: "Turn rough notes into professional, well-structured activity descriptions.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based security",
    body: "Students, supervisors, organizations and university admins each see only what they should.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-hero">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold">InternTrack</span>
        </div>
        <Button asChild size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      <section className="bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 text-primary-foreground lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <Badge className="border-0 bg-primary-foreground/15 text-primary-foreground">
              Education Technology
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight lg:text-5xl">
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
          </div>

          <Card className="self-center border-0 shadow-elevated">
            <CardContent className="space-y-4 p-6">
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Built for every role
              </p>
              {[
                "Students record and submit daily activities",
                "Supervisors approve, reject and give feedback",
                "Organizations monitor their interns",
                "Universities track participation and completion",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                  <span className="text-sm text-card-foreground">{line}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-semibold">Everything an internship programme needs</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          No more lost logbooks, delayed updates or last-minute report writing.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="shadow-card transition-shadow hover:shadow-elevated">
              <CardContent className="p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                  <f.icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
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
