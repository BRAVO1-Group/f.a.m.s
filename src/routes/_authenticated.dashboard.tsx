import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  Compass,
  Milestone,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS } from "@/lib/auth";
import { activities, attendance, internships, milestones } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — InternTrack" },
      {
        name: "description",
        content: "Live internship progress, attendance, milestones, and approvals.",
      },
      { property: "og:title", content: "Dashboard — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="shadow-xs">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold leading-tight">{value}</p>
          {hint ? <p className="truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

const COMPETENCIES = [
  { domain: "Frontend & UI Design", progress: 92, skills: "React 19, Tailwind CSS v4, Radix UI" },
  {
    domain: "State & Architecture",
    progress: 84,
    skills: "TanStack Router, Async State, TypeScript",
  },
  { domain: "Agile & Collaboration", progress: 88, skills: "Sprint Standups, Code Reviews, Jira" },
  {
    domain: "Testing & Quality Assurance",
    progress: 76,
    skills: "Vitest, a11y Auditing, DevTools",
  },
];

function DashboardPage() {
  const { userId, role, name } = useAppUser();
  const isStudent = role === "student";

  if (isStudent) {
    const myInternship = internships.find((i) => i.student_id === userId);
    const acts = activities.filter((a) => a.student_id === userId);
    const myAttendance = attendance.filter((a) => a.student_id === userId);

    const approved = acts.filter((a) => a.status === "approved").length;
    const submitted = acts.filter((a) => a.status === "submitted").length;
    const required = myInternship?.required_days ?? 60;
    const presentDays = myAttendance.filter((a) => a.check_in).length;
    const attendanceRate = Math.min(100, Math.round((presentDays / Math.max(required, 1)) * 100));
    const completion = Math.min(100, Math.round((approved / Math.max(required, 1)) * 100));
    const skills = new Set(acts.flatMap((a) => a.skills_gained));

    const byDay = new Map<string, number>();
    acts.forEach((a) => {
      const d = new Date(a.activity_date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    });
    const chart = Array.from(byDay.entries())
      .slice(0, 10)
      .reverse()
      .map(([day, count]) => ({ day, count }));

    const orgName = myInternship
      ? (["TechCorp Kenya Ltd", "Safaricom PLC", "Kenya Commercial Bank"][
          ["org-1", "org-2", "org-3"].indexOf(myInternship.organization_id)
        ] ?? "TechCorp Kenya Ltd")
      : null;

    return (
      <div className="space-y-6">
        {/* Welcome Hero Banner */}
        <div className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated">
          <p className="text-sm opacity-80">Welcome back</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">{name}</h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">
            {myInternship
              ? `${myInternship.position} at ${orgName}`
              : "Software Engineering Intern at TechCorp Kenya Ltd"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to="/logbook">Add today's activity</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/milestones">View 12-week roadmap</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/attendance">Check in</Link>
            </Button>
          </div>
        </div>

        {/* 4 Primary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Activity}
            label="Activities"
            value={acts.length}
            hint={`${approved} approved`}
          />
          <StatCard
            icon={Clock}
            label="Awaiting review"
            value={submitted}
            hint="Submitted entries"
          />
          <StatCard
            icon={CalendarCheck}
            label="Attendance"
            value={`${attendanceRate}%`}
            hint={`${presentDays} of ${required} days`}
          />
          <StatCard
            icon={CheckCircle2}
            label="Skills gained"
            value={skills.size}
            hint="Unique competencies"
          />
        </div>

        {/* Chart & Progress Section */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-xs lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Activity Volume</CardTitle>
              <CardDescription>Logbook entries recorded per calendar day</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              {chart.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activities recorded yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ opacity: 0.1 }} />
                    <Bar dataKey="count" fill="var(--color-chart-2)" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Internship Completion</CardTitle>
              <CardDescription>Approved days vs curriculum target</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold text-foreground">{completion}%</span>
                </div>
                <Progress value={completion} className="mt-2" />
              </div>
              <div className="space-y-2 text-sm">
                {acts.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-foreground font-medium">{a.title}</span>
                    <Badge variant="secondary" className="shrink-0 capitalize text-[10px]">
                      {a.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/reports">Generate formal dossier</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Competency Progression Matrix */}
        <Card className="shadow-xs border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Target className="size-4.5 text-primary" />
                  Competency Progression Matrix
                </CardTitle>
                <CardDescription>
                  Skill mastery benchmarks evaluated against academic accreditation standards
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link to="/milestones">Full Roadmap →</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {COMPETENCIES.map((c) => (
                <div
                  key={c.domain}
                  className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{c.domain}</span>
                    <span className="font-bold text-primary">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-2" />
                  <p className="text-[11px] text-muted-foreground truncate">{c.skills}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Staff / Supervisor / Admin dashboard
  const allInternships = internships;
  const active = allInternships.filter((i) => i.status === "active").length;
  const pending = activities.filter((a) => a.status === "submitted").length;
  const recent = activities
    .slice()
    .sort((a, b) => (a.activity_date < b.activity_date ? 1 : -1))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{ROLE_LABELS[role]} Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitoring active interns, milestones, and daily submissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/milestones">Milestones Roadmap</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/review">Review Queue ({pending})</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Interns"
          value={allInternships.length}
          hint={`${active} currently active`}
        />
        <StatCard
          icon={ClipboardList}
          label="Pending Review"
          value={pending}
          hint="Require sign-off"
        />
        <StatCard
          icon={Milestone}
          label="Roadmap Phases"
          value={milestones.length}
          hint="Active curriculum"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Placements"
          value={allInternships.filter((i) => i.status === "completed").length}
        />
      </div>

      <Card className="shadow-xs">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">Latest Submissions</CardTitle>
            <CardDescription>Newest logbook activity awaiting review</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/review">Go to review queue</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {recent.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
            >
              <div className="min-w-0">
                <span className="font-medium text-foreground">{a.title}</span>
                <p className="text-xs text-muted-foreground truncate max-w-md">{a.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{a.activity_date}</span>
                <Badge
                  variant={a.status === "approved" ? "default" : "secondary"}
                  className="capitalize text-[10px]"
                >
                  {a.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
