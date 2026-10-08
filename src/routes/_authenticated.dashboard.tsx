import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, CalendarCheck, CheckCircle2, ClipboardList, Clock, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — InternTrack" },
      { name: "description", content: "Live internship progress, attendance and approvals." },
      { property: "og:title", content: "Dashboard — InternTrack" },
      { property: "og:description", content: "Track internship progress in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    <Card className="shadow-card">
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

function DashboardPage() {
  const { userId, role, name } = useAppUser();
  const isStudent = role === "student";

  const student = useQuery({
    queryKey: ["dashboard", "student", userId],
    enabled: isStudent,
    queryFn: async () => {
      const [internship, activities, attendance] = await Promise.all([
        supabase
          .from("internships")
          .select("*, organizations(name)")
          .eq("student_id", userId)
          .order("start_date", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("activities")
          .select("id,title,status,activity_date,skills_gained")
          .eq("student_id", userId)
          .order("activity_date", { ascending: false }),
        supabase
          .from("attendance")
          .select("attendance_date,check_in,check_out")
          .eq("student_id", userId),
      ]);
      if (internship.error) throw internship.error;
      if (activities.error) throw activities.error;
      if (attendance.error) throw attendance.error;
      return {
        internship: internship.data,
        activities: activities.data ?? [],
        attendance: attendance.data ?? [],
      };
    },
  });

  const staff = useQuery({
    queryKey: ["dashboard", "staff", userId, role],
    enabled: !isStudent,
    queryFn: async () => {
      const [internships, pending, recent] = await Promise.all([
        supabase.from("internships").select("id,status,student_id"),
        supabase.from("activities").select("id").eq("status", "submitted"),
        supabase
          .from("activities")
          .select("id,title,status,activity_date,student_id")
          .order("activity_date", { ascending: false })
          .limit(8),
      ]);
      if (internships.error) throw internships.error;
      if (pending.error) throw pending.error;
      if (recent.error) throw recent.error;
      return {
        internships: internships.data ?? [],
        pending: pending.data?.length ?? 0,
        recent: recent.data ?? [],
      };
    },
  });

  const loading = isStudent ? student.isLoading : staff.isLoading;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isStudent) {
    const acts = student.data?.activities ?? [];
    const approved = acts.filter((a) => a.status === "approved").length;
    const submitted = acts.filter((a) => a.status === "submitted").length;
    const required = student.data?.internship?.required_days ?? 60;
    const presentDays = (student.data?.attendance ?? []).filter((a) => a.check_in).length;
    const attendanceRate = Math.min(100, Math.round((presentDays / Math.max(required, 1)) * 100));
    const completion = Math.min(100, Math.round((approved / Math.max(required, 1)) * 100));
    const skills = new Set(acts.flatMap((a) => a.skills_gained ?? []));

    const byWeek = new Map<string, number>();
    acts.forEach((a) => {
      const d = new Date(a.activity_date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      byWeek.set(key, (byWeek.get(key) ?? 0) + 1);
    });
    const chart = Array.from(byWeek.entries())
      .slice(0, 10)
      .reverse()
      .map(([day, count]) => ({ day, count }));

    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-elevated">
          <p className="text-sm opacity-80">Welcome back</p>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">{name}</h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">
            {student.data?.internship
              ? `${student.data.internship.position} at ${
                  (student.data.internship as { organizations?: { name?: string } }).organizations
                    ?.name ?? "your organization"
                }`
              : "No internship record yet — an administrator will assign one to you."}
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
              <Link to="/attendance">Check in</Link>
            </Button>
          </div>
        </div>

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
            hint="Unique skills"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Activity volume</CardTitle>
              <CardDescription>Entries recorded per day</CardDescription>
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

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Internship completion</CardTitle>
              <CardDescription>Approved days vs required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{completion}%</span>
                </div>
                <Progress value={completion} className="mt-2" />
              </div>
              <div className="space-y-2 text-sm">
                {acts.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{a.title}</span>
                    <Badge variant="secondary" className="shrink-0 capitalize">
                      {a.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
                {acts.length === 0 ? (
                  <p className="text-muted-foreground">Your recent entries will appear here.</p>
                ) : null}
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/reports">Generate report</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const internships = staff.data?.internships ?? [];
  const active = internships.filter((i) => i.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{ROLE_LABELS[role]} dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitoring internships in real time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Interns"
          value={internships.length}
          hint={`${active} active`}
        />
        <StatCard icon={ClipboardList} label="Pending review" value={staff.data?.pending ?? 0} />
        <StatCard icon={Activity} label="Recent entries" value={staff.data?.recent.length ?? 0} />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={internships.filter((i) => i.status === "completed").length}
        />
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Latest submissions</CardTitle>
            <CardDescription>Newest logbook activity across your interns</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/review">Review queue</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {(staff.data?.recent ?? []).map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
            >
              <span className="truncate font-medium">{a.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{a.activity_date}</span>
                <Badge variant="secondary" className="capitalize">
                  {a.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          ))}
          {(staff.data?.recent.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
