import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileBarChart,
  FileCheck,
  GraduationCap,
  Layers,
  MapPin,
  MessageSquareCheck,
  Milestone,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS } from "@/lib/auth";
import {
  activities as initialActivities,
  attendance as initialAttendance,
  internships,
  milestones,
  evaluations,
  type MockActivity,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — InternTrack" },
      {
        name: "description",
        content: "Real-time internship progress, attendance tracking, and supervisor reviews.",
      },
      { property: "og:title", content: "Dashboard — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const { userId, role, name } = useAppUser();
  const isStudent = role === "student";

  // State for simulated interactions
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [activityFilter, setActivityFilter] = useState<"all" | "approved" | "submitted">("all");
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(initialActivities);

  const greeting = getGreeting();

  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT DASHBOARD
  // ───────────────────────────────────────────────────────────────────────────
  if (isStudent) {
    const myInternship = internships.find((i) => i.student_id === userId);
    const acts = activitiesList.filter((a) => a.student_id === userId);
    const myAttendance = initialAttendance.filter((a) => a.student_id === userId);

    const approvedCount = acts.filter((a) => a.status === "approved").length;
    const submittedCount = acts.filter((a) => a.status === "submitted").length;
    const requiredDays = myInternship?.required_days ?? 60;
    const presentDays = myAttendance.filter((a) => a.check_in).length;
    const attendanceRate = Math.min(
      100,
      Math.round((presentDays / Math.max(requiredDays, 1)) * 100),
    );
    const completionRate = Math.min(
      100,
      Math.round((approvedCount / Math.max(requiredDays, 1)) * 100),
    );

    // Unique skills set
    const uniqueSkills = Array.from(new Set(acts.flatMap((a) => a.skills_gained)));
    const estimatedHours = presentDays * 8;

    // Daily activity volume chart data
    const byDay = new Map<string, number>();
    acts.forEach((a) => {
      const d = new Date(a.activity_date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    });
    const activityChartData = Array.from(byDay.entries())
      .slice(0, 10)
      .reverse()
      .map(([day, count]) => ({ day, entries: count, hours: count * 4 }));

    // Weekly hours data
    const weeklyHoursData = [
      { week: "Wk 5", hours: 40, target: 40 },
      { week: "Wk 6", hours: 38.5, target: 40 },
      { week: "Wk 7", hours: 42, target: 40 },
      { week: "Wk 8", hours: 40, target: 40 },
      { week: "Wk 9 (Now)", hours: 32, target: 40 },
    ];

    // Current active milestone
    const activeMilestone =
      milestones.find((m) => m.student_id === userId && m.status === "in_progress") ||
      milestones[0];
    const completedTasksCount = activeMilestone?.tasks.filter((t) => t.completed).length ?? 0;
    const totalTasksCount = activeMilestone?.tasks.length ?? 1;
    const milestoneProgress = Math.round((completedTasksCount / totalTasksCount) * 100);

    // Latest evaluation
    const myEvaluation = evaluations.find((e) => e.student_id === userId);

    // Filtered activities
    const filteredActivities = acts.filter((a) => {
      if (activityFilter === "all") return true;
      return a.status === activityFilter;
    });

    const handleClockToggle = () => {
      if (isCheckedIn) {
        setIsCheckedIn(false);
        toast.info("Clocked out for today", {
          description: "Shift duration recorded: 8 hours. Don't forget to draft today's log entry!",
        });
      } else {
        setIsCheckedIn(true);
        toast.success("Clocked in successfully!", {
          description: "Shift started at 08:30 AM • Location: TechCorp Westlands HQ.",
        });
      }
    };

    const orgName = myInternship
      ? (["TechCorp Kenya Ltd", "Safaricom PLC", "Kenya Commercial Bank"][
          ["org-1", "org-2", "org-3"].indexOf(myInternship.organization_id)
        ] ?? "TechCorp Kenya Ltd")
      : "TechCorp Kenya Ltd";

    return (
      <div className="space-y-6 antialiased">
        {/* ── Welcome Header Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute right-40 -bottom-20 size-60 rounded-full bg-primary-foreground/10 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Sparkles className="size-3.5 text-emerald-300" />
                  Active Placement • Week 9 of 12
                </span>
                <span className="text-xs text-primary-foreground/70 hidden sm:inline">
                  Ends Sept 30, 2026
                </span>
              </div>

              <h1 className="mt-3 font-display text-2xl font-bold sm:text-4xl tracking-tight">
                {greeting}, {name.split(" ")[0]}!
              </h1>

              <p className="mt-2 text-sm sm:text-base text-primary-foreground/90 font-medium">
                {myInternship?.position || "Software Engineering Intern"} • {orgName}
              </p>

              <p className="mt-1 text-xs sm:text-sm text-primary-foreground/70">
                Department of Product Engineering • Supervised by James Otieno
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="default"
                className="rounded-xl bg-white text-primary hover:bg-white/90 shadow-sm font-semibold"
              >
                <Link to="/logbook">
                  <Plus className="mr-1.5 size-4" />
                  Add Today's Log
                </Link>
              </Button>
              <Button
                size="default"
                variant="outline"
                onClick={handleClockToggle}
                className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur font-semibold"
              >
                <Clock className="mr-1.5 size-4" />
                {isCheckedIn ? "Clock Out" : "Clock In"}
              </Button>
              <Button
                asChild
                size="default"
                variant="outline"
                className="rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 font-semibold"
              >
                <Link to="/reports">
                  <FileBarChart className="mr-1.5 size-4" />
                  Export PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Executive KPI Cards (4 Cards) ── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Card 1: Days Completed */}
          <Card className="shadow-card border-border/80 transition-all hover:border-primary/40 hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Days Completed
                </span>
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarCheck className="size-4.5" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight">
                  {presentDays}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  / {requiredDays} days
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress to clearance</span>
                  <span className="font-semibold text-foreground">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              <p className="mt-3 text-[11px] text-success flex items-center gap-1 font-medium">
                <TrendingUp className="size-3" />
                On track for graduation verification
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Logged Hours */}
          <Card className="shadow-card border-border/80 transition-all hover:border-primary/40 hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Logged Hours
                </span>
                <span className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                  <Clock className="size-4.5" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight">
                  {estimatedHours}.0
                </span>
                <span className="text-sm font-medium text-muted-foreground">hours</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Average <span className="font-semibold text-foreground">8.0 hrs</span> per recorded
                day
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                40 hrs logged this week
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Verification Rate */}
          <Card className="shadow-card border-border/80 transition-all hover:border-primary/40 hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Approved Activities
                </span>
                <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                  <FileCheck className="size-4.5" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight">
                  {approvedCount}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  of {acts.length} logged
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-success/30 bg-success/10 text-success text-xs font-medium"
                >
                  {submittedCount} in review queue
                </Badge>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                0 revision requests from supervisor
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Verified Skills */}
          <Card className="shadow-card border-border/80 transition-all hover:border-primary/40 hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Verified Skills
                </span>
                <span className="flex size-9 items-center justify-center rounded-xl bg-info/10 text-info">
                  <Award className="size-4.5" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight">
                  {uniqueSkills.length}
                </span>
                <span className="text-sm font-medium text-muted-foreground">competencies</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {uniqueSkills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
                {uniqueSkills.length > 3 && (
                  <span className="text-[10px] text-muted-foreground font-medium self-center">
                    +{uniqueSkills.length - 3} more
                  </span>
                )}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Portfolio export ready</p>
            </CardContent>
          </Card>
        </div>

        {/* ── Today's Attendance & Shift Status ── */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-card border-border/80 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Today's Shift Status</CardTitle>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isCheckedIn ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${isCheckedIn ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`}
                  />
                  {isCheckedIn ? "Checked In" : "Off Duty"}
                </span>
              </div>
              <CardDescription>Live attendance tracker for Sept 24, 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Arrival timestamp:</span>
                  <span className="font-semibold">{isCheckedIn ? "08:30 AM" : "—"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Expected departure:</span>
                  <span className="font-semibold">17:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" />
                    Location mode:
                  </span>
                  <span className="font-medium text-foreground">TechCorp Westlands (On-Site)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleClockToggle}
                  variant={isCheckedIn ? "outline" : "default"}
                  className="w-full text-xs font-semibold rounded-xl"
                >
                  <Clock className="mr-1.5 size-3.5" />
                  {isCheckedIn ? "Record Clock-Out" : "Record Clock-In"}
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="text-xs font-semibold rounded-xl shrink-0"
                >
                  <Link to="/attendance">History</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Milestone Progress Card */}
          <Card className="shadow-card border-border/80 lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/25 bg-primary/5 text-primary text-xs"
                  >
                    {activeMilestone.phase}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activeMilestone.target_week}
                  </span>
                </div>
                <CardTitle className="mt-1 text-base font-semibold">
                  {activeMilestone.title}
                </CardTitle>
              </div>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="text-xs text-primary font-semibold"
              >
                <Link to="/milestones">
                  View Roadmap <ChevronRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {activeMilestone.description}
              </p>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Phase Deliverables Completed</span>
                  <span className="font-semibold text-foreground">
                    {completedTasksCount} of {totalTasksCount} tasks ({milestoneProgress}%)
                  </span>
                </div>
                <Progress value={milestoneProgress} className="h-2" />
              </div>

              <div className="space-y-2">
                {activeMilestone.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs"
                  >
                    <span
                      className={`flex size-4.5 shrink-0 items-center justify-center rounded-md ${
                        task.completed
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-transparent"
                      }`}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span
                      className={
                        task.completed
                          ? "line-through text-muted-foreground"
                          : "font-medium text-foreground"
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Analytics & Submission Charts ── */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-card border-border/80 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Activity & Hours Velocity</CardTitle>
                <CardDescription>
                  Tracking daily output over the current placement term
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="entries" className="w-full">
                <div className="flex items-center justify-between pb-4">
                  <TabsList className="h-8">
                    <TabsTrigger value="entries" className="text-xs px-3">
                      Daily Entries
                    </TabsTrigger>
                    <TabsTrigger value="hours" className="text-xs px-3">
                      Weekly Hours
                    </TabsTrigger>
                  </TabsList>
                  <span className="text-xs text-muted-foreground">Last updated today</span>
                </div>

                <TabsContent value="entries" className="mt-0 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis
                        allowDecimals={false}
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.75rem",
                          boxShadow: "0 8px 24px -12px rgba(0,0,0,0.2)",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="entries"
                        name="Entries"
                        fill="var(--color-primary)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="hours" className="mt-0 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weeklyHoursData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 50]} fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        name="Logged Hours"
                        stroke="var(--color-chart-2)"
                        fill="var(--color-chart-2)"
                        fillOpacity={0.25}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Supervisor & Placement Profile */}
          <Card className="shadow-card border-border/80 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Supervisor & Mentor</CardTitle>
              <CardDescription>Direct point of contact for sign-offs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
                <div className="flex size-11 items-center justify-center rounded-full bg-accent/20 text-accent-foreground font-bold">
                  JO
                </div>
                <div>
                  <h4 className="font-semibold text-sm">James Otieno</h4>
                  <p className="text-xs text-muted-foreground">Senior Staff Engineer</p>
                  <p className="text-[11px] text-primary mt-0.5">james.otieno@techcorp.co.ke</p>
                </div>
              </div>

              {myEvaluation && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Mid-Term Grade</span>
                    <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                      {myEvaluation.grade} ({myEvaluation.overall_score}/5.0)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{myEvaluation.comments}"
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Next Weekly Review:</span>
                <span className="font-semibold text-foreground">Friday at 16:00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Recent Logbook Submissions Feed ── */}
        <Card className="shadow-card border-border/80">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Recent Logbook Entries</CardTitle>
              <CardDescription>Daily tasks submitted for mentor verification</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setActivityFilter("all")}
                  className={`rounded-md px-2.5 py-1 transition ${
                    activityFilter === "all"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  All ({acts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter("approved")}
                  className={`rounded-md px-2.5 py-1 transition ${
                    activityFilter === "approved"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  Approved ({approvedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActivityFilter("submitted")}
                  className={`rounded-md px-2.5 py-1 transition ${
                    activityFilter === "submitted"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  In Review ({submittedCount})
                </button>
              </div>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-xs font-semibold rounded-lg"
              >
                <Link to="/logbook">View Full Logbook</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {filteredActivities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-xs space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <BookOpen className="size-3.5" />
                    </span>
                    <h4 className="font-semibold text-sm text-foreground">{act.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{act.activity_date}</span>
                    <Badge
                      variant={act.status === "approved" ? "default" : "secondary"}
                      className={`text-xs capitalize ${
                        act.status === "approved"
                          ? "bg-success text-success-foreground hover:bg-success/90"
                          : ""
                      }`}
                    >
                      {act.status === "approved" ? (
                        <>
                          <CheckCircle2 className="mr-1 size-3" /> Approved
                        </>
                      ) : (
                        "Pending Review"
                      )}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {act.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {act.tools_used.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {act.supervisor_feedback && (
                    <span className="text-[11px] text-primary flex items-center gap-1 font-medium italic">
                      <MessageSquareCheck className="size-3" />
                      Feedback from James Otieno attached
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No log entries match the selected filter.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STAFF / SUPERVISOR / ADMIN DASHBOARD
  // ───────────────────────────────────────────────────────────────────────────
  const allInternships = internships;
  const activeInterns = allInternships.filter((i) => i.status === "active");
  const pendingActivities = activitiesList.filter((a) => a.status === "submitted");
  const completedInternships = allInternships.filter((i) => i.status === "completed");

  const handleQuickApprove = (actId: string, title: string) => {
    setActivitiesList((prev) =>
      prev.map((a) =>
        a.id === actId
          ? {
              ...a,
              status: "approved",
              reviewed_by: userId,
              reviewed_at: new Date().toISOString(),
              supervisor_feedback: "Approved via quick review.",
            }
          : a,
      ),
    );
    toast.success("Log entry approved!", {
      description: `"${title}" has been signed off.`,
    });
  };

  return (
    <div className="space-y-6 antialiased">
      {/* ── Supervisor / Admin Header ── */}
      <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/30 bg-white/10 text-white text-xs">
                {ROLE_LABELS[role]} Control Center
              </Badge>
              <span className="text-xs text-primary-foreground/70">Academic Term 2026/2027</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Monitoring active placements, verifying logbook milestones, and conducting
              evaluations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs"
            >
              <Link to="/review">
                <FileCheck className="mr-1.5 size-4" />
                Review Queue ({pendingActivities.length})
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs"
            >
              <Link to="/reports">
                <FileBarChart className="mr-1.5 size-4" />
                Cohort Reports
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Staff KPI Metric Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Supervised Interns
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {allInternships.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{activeInterns.length} active</span>{" "}
              placements across 3 organizations
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Reviews
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground">
                <Clock className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {pendingActivities.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Submissions awaiting sign-off</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cohort Attendance
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CalendarCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">95.4%</p>
            <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="size-3" /> Zero attendance infractions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed Placements
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-info/10 text-info">
                <GraduationCap className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {completedInternships.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Accredited & defended</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Pending Submissions Quick Action Tray ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Immediate Review Queue</CardTitle>
            <CardDescription>
              Review and sign off on submitted daily logbook entries
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link to="/review">Open Full Queue</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingActivities.map((act) => (
            <div
              key={act.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">{act.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    Alice Wanjiku
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                  <span>Date: {act.activity_date}</span>
                  <span>•</span>
                  <span>Tools: {act.tools_used.join(", ")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleQuickApprove(act.id, act.title)}
                  className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                >
                  <Check className="mr-1 size-3.5" />
                  Quick Approve
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg text-xs font-semibold"
                >
                  <Link to="/review">Review</Link>
                </Button>
              </div>
            </div>
          ))}

          {pendingActivities.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto size-8 text-success mb-2" />
              All logbook entries have been reviewed and approved!
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Active Intern Roster ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Supervised Cohort Roster</CardTitle>
          <CardDescription>Live status of students under your supervision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {allInternships.map((intern) => {
              const studentName =
                intern.student_id === "student-1"
                  ? "Alice Wanjiku"
                  : intern.student_id === "student-2"
                    ? "Mark Mwangi"
                    : "Faith Muthoni";
              const progressPct =
                intern.status === "completed" ? 100 : intern.student_id === "student-1" ? 70 : 65;
              return (
                <div
                  key={intern.id}
                  className="rounded-xl border border-border bg-card p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{studentName}</h4>
                      <p className="text-xs text-muted-foreground">{intern.position}</p>
                    </div>
                    <Badge
                      variant={intern.status === "active" ? "default" : "secondary"}
                      className={`text-[10px] capitalize ${
                        intern.status === "active"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : ""
                      }`}
                    >
                      {intern.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Term Progress</span>
                      <span className="font-semibold text-foreground">{progressPct}%</span>
                    </div>
                    <Progress value={progressPct} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2">
                    <span>Department: {intern.department}</span>
                    <Link to="/review" className="text-primary font-medium hover:underline">
                      Logs →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
