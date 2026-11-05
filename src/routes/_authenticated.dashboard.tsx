import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileBarChart,
  FileCheck,
  Filter,
  GraduationCap,
  Laptop,
  Layers,
  MapPin,
  MessageSquareCheck,
  Milestone,
  Plus,
  Search,
  ShieldAlert,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useAppUser } from "@/lib/app-user";
import { ROLE_LABELS, setDemoUser, type AppRole } from "@/lib/auth";
import {
  activities as initialActivities,
  attendance as initialAttendance,
  internships,
  milestones,
  evaluations,
  organizations,
  DEMO_USERS,
  type MockActivity,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { role?: string; user?: string } => ({
    role: typeof search.role === "string" ? search.role : undefined,
    user: typeof search.user === "string" ? search.user : undefined,
  }),
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
  const search = Route.useSearch();

  useEffect(() => {
    if (search.role) {
      const normalized = search.role.toLowerCase().replace("-", "_");
      const match =
        DEMO_USERS.find((u) => u.role === normalized) ||
        DEMO_USERS.find((u) => u.roles?.includes(normalized as AppRole));
      if (match && match.id !== userId) {
        setDemoUser(match.id);
        window.dispatchEvent(new Event("demo-auth-change"));
      }
    } else if (search.user && search.user !== userId) {
      const match = DEMO_USERS.find((u) => u.id === search.user);
      if (match) {
        setDemoUser(match.id);
        window.dispatchEvent(new Event("demo-auth-change"));
      }
    }
  }, [search.role, search.user, userId]);

  const switcherBar = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Demo Persona:
        </span>
        <Badge
          variant="outline"
          className="text-xs font-semibold border-primary/30 text-primary bg-primary/5"
        >
          {ROLE_LABELS[role]} ({name.split(" ")[0]})
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {DEMO_USERS.map((u) => {
          const active = u.id === userId;
          return (
            <Button
              key={u.id}
              size="sm"
              variant={active ? "default" : "outline"}
              onClick={() => {
                setDemoUser(u.id);
                window.dispatchEvent(new Event("demo-auth-change"));
              }}
              className={`h-7.5 rounded-lg text-xs font-semibold transition ${
                active ? "shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {u.role === "student" && "🎓 Student (Alice)"}
              {u.role === "supervisor" && "👔 Supervisor (James)"}
              {u.role === "org_admin" && "🏢 Org Admin (Fatuma)"}
              {u.role === "uni_admin" && "🏛️ Uni Dean (Dr. Kamau)"}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {switcherBar}
      {role === "student" && <StudentDashboard userId={userId} name={name} />}
      {role === "supervisor" && <SupervisorDashboard userId={userId} name={name} />}
      {role === "org_admin" && <OrgAdminDashboard userId={userId} name={name} />}
      {role !== "student" && role !== "supervisor" && role !== "org_admin" && (
        <UniversityAdminDashboard userId={userId} name={name} role={role} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function StudentDashboard({ userId, name }: { userId: string; name: string }) {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [activityFilter, setActivityFilter] = useState<"all" | "approved" | "submitted">("all");
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(initialActivities);

  const greeting = getGreeting();
  const myInternship = internships.find((i) => i.student_id === userId);
  const acts = activitiesList.filter((a) => a.student_id === userId);
  const myAttendance = initialAttendance.filter((a) => a.student_id === userId);

  const approvedCount = acts.filter((a) => a.status === "approved").length;
  const submittedCount = acts.filter((a) => a.status === "submitted").length;
  const requiredDays = myInternship?.required_days ?? 60;
  const presentDays = myAttendance.filter((a) => a.check_in).length;
  const attendanceRate = Math.min(100, Math.round((presentDays / Math.max(requiredDays, 1)) * 100));
  const completionRate = Math.min(
    100,
    Math.round((approvedCount / Math.max(requiredDays, 1)) * 100),
  );

  const uniqueSkills = Array.from(new Set(acts.flatMap((a) => a.skills_gained)));
  const estimatedHours = presentDays * 8;

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

  const weeklyHoursData = [
    { week: "Wk 5", hours: 40, target: 40 },
    { week: "Wk 6", hours: 38.5, target: 40 },
    { week: "Wk 7", hours: 42, target: 40 },
    { week: "Wk 8", hours: 40, target: 40 },
    { week: "Wk 9 (Now)", hours: 32, target: 40 },
  ];

  const activeMilestone =
    milestones.find((m) => m.student_id === userId && m.status === "in_progress") || milestones[0];
  const completedTasksCount = activeMilestone?.tasks.filter((t) => t.completed).length ?? 0;
  const totalTasksCount = activeMilestone?.tasks.length ?? 1;
  const milestoneProgress = Math.round((completedTasksCount / totalTasksCount) * 100);

  const myEvaluation = evaluations.find((e) => e.student_id === userId);

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
                Target Defense: Sept 30, 2026
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
              <span className="font-display text-3xl font-bold tracking-tight">{presentDays}</span>
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
                <span className="text-xs text-muted-foreground">{activeMilestone.target_week}</span>
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
                    <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
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
              <Avatar className="size-11">
                <AvatarFallback className="bg-accent/20 text-accent-foreground font-bold">
                  JO
                </AvatarFallback>
              </Avatar>
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

// ─────────────────────────────────────────────────────────────────────────────
// 2. WORKPLACE SUPERVISOR DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function SupervisorDashboard({ userId, name }: { userId: string; name: string }) {
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(initialActivities);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<MockActivity | null>(null);

  const greeting = getGreeting();
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
              supervisor_feedback: "Verified and signed off via rapid approval.",
            }
          : a,
      ),
    );
    toast.success("Submission approved successfully!", {
      description: `"${title}" has been signed off.`,
    });
  };

  const handleDetailedApprove = () => {
    if (!selectedActivity) return;
    setActivitiesList((prev) =>
      prev.map((a) =>
        a.id === selectedActivity.id
          ? {
              ...a,
              status: "approved",
              reviewed_by: userId,
              reviewed_at: new Date().toISOString(),
              supervisor_feedback: feedbackNote || "Excellent progress and execution.",
            }
          : a,
      ),
    );
    toast.success("Approved with feedback note!", {
      description: `Sent review to student for "${selectedActivity.title}".`,
    });
    setSelectedActivity(null);
    setFeedbackNote("");
  };

  return (
    <div className="space-y-6 antialiased">
      {/* ── Supervisor Header ── */}
      <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-white/30 bg-white/10 text-white text-xs font-semibold"
              >
                Workplace Supervisor Control Hub
              </Badge>
              <span className="text-xs text-primary-foreground/70">
                TechCorp Kenya Ltd • Product Engineering
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Review daily engineering logs, sign off deliverables, and monitor competency
              milestones.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm"
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
                Mentee Reports
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Supervisor KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Mentees
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {activeInterns.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">All in good academic standing</p>
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
            <p className="mt-2 text-xs text-muted-foreground">Submissions requiring sign-off</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mentee Attendance
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CalendarCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">96.5%</p>
            <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="size-3" /> Average 8.1 hrs / day logged
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Milestones Signed
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-info/10 text-info">
                <Milestone className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">8</p>
            <p className="mt-2 text-xs text-muted-foreground">Verified phase deliverables</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Pending Submissions Quick Action Tray with Dialog ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base font-semibold">Pending Logbook Review Queue</CardTitle>
            <CardDescription>
              Review and sign off on submitted daily entries with single-click verification
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold rounded-lg">
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
                  <Badge variant="secondary" className="text-xs font-medium">
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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedActivity(act)}
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      Review & Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Review Logbook Entry</DialogTitle>
                      <DialogDescription>
                        {act.title} — submitted by Alice Wanjiku
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2 text-xs">
                      <div>
                        <span className="font-semibold text-foreground">Task Description:</span>
                        <p className="mt-1 text-muted-foreground leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {act.tools_used.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <Separator />
                      <div>
                        <label className="font-semibold text-foreground block mb-1">
                          Mentor Feedback & Guidance Note:
                        </label>
                        <textarea
                          rows={3}
                          value={feedbackNote}
                          onChange={(e) => setFeedbackNote(e.target.value)}
                          placeholder="e.g. Excellent work on the API endpoints. Let's make sure edge cases are covered..."
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleDetailedApprove}
                        className="w-full bg-primary text-primary-foreground text-xs font-semibold"
                      >
                        Sign Off & Approve Entry
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}

          {pendingActivities.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto size-8 text-success mb-2" />
              All mentee entries have been verified and approved!
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Mentee Roster & Performance Table (shadcn Table) ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Supervised Intern Cohort</CardTitle>
          <CardDescription>Performance, attendance pace, and milestone clearance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intern Name</TableHead>
                <TableHead>Position & Dept</TableHead>
                <TableHead>Target Days</TableHead>
                <TableHead>Pace</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInternships.map((intern) => {
                const studentName =
                  intern.student_id === "student-1"
                    ? "Alice Wanjiku"
                    : intern.student_id === "student-2"
                      ? "Mark Mwangi"
                      : "Faith Muthoni";
                const progressPct =
                  intern.status === "completed" ? 100 : intern.student_id === "student-1" ? 70 : 65;
                const loggedDays =
                  intern.status === "completed" ? 60 : intern.student_id === "student-1" ? 42 : 39;
                return (
                  <TableRow key={intern.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {studentName
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{intern.position}</p>
                      <p>{intern.department}</p>
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {loggedDays} / {intern.required_days}
                    </TableCell>
                    <TableCell className="w-36">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                          <span>{progressPct}%</span>
                        </div>
                        <Progress value={progressPct} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={intern.status === "active" ? "default" : "secondary"}
                        className={`text-xs capitalize ${
                          intern.status === "active"
                            ? "bg-success/10 text-success border-success/30"
                            : ""
                        }`}
                      >
                        {intern.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost" className="text-xs text-primary">
                        <Link to="/review">Review Logs →</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ORGANIZATION ADMIN DASHBOARD (Host Company Admin / HR)
// ─────────────────────────────────────────────────────────────────────────────
function OrgAdminDashboard({ userId, name }: { userId: string; name: string }) {
  const greeting = getGreeting();
  const company = organizations[0]; // TechCorp Kenya Ltd

  const deptAllocations = [
    {
      dept: "Product Engineering",
      mentor: "James Otieno",
      interns: 4,
      capacity: 4,
      attendance: "97.2%",
      status: "Optimal",
    },
    {
      dept: "Infrastructure & DevOps",
      mentor: "Grace Muthoni",
      interns: 3,
      capacity: 4,
      attendance: "94.5%",
      status: "1 Slot Open",
    },
    {
      dept: "Data & Analytics",
      mentor: "Brian Njoroge",
      interns: 3,
      capacity: 3,
      attendance: "98.0%",
      status: "Optimal",
    },
    {
      dept: "Cybersecurity & Governance",
      mentor: "David Kibet",
      interns: 2,
      capacity: 4,
      attendance: "92.0%",
      status: "2 Slots Open",
    },
  ];

  return (
    <div className="space-y-6 antialiased">
      {/* ── Header ── */}
      <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-white/30 bg-white/10 text-white text-xs font-semibold"
              >
                Host Organization Administration
              </Badge>
              <span className="text-xs text-primary-foreground/70">
                {company.name} • Westlands HQ
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Managing industry attachment placements, mentor allocations, and university
              compliance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm"
            >
              <Link to="/admin">
                <Building2 className="mr-1.5 size-4" />
                Company Settings
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs"
            >
              <Link to="/reports">
                <FileBarChart className="mr-1.5 size-4" />
                MOU Compliance Dossier
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Placed Interns
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">12</p>
            <p className="mt-2 text-xs text-muted-foreground">Across 4 engineering divisions</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Industry Mentors
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <UserCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">5</p>
            <p className="mt-2 text-xs text-muted-foreground">Lead engineers conducting reviews</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hours Contributed
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <Clock className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">1,440</p>
            <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="size-3" /> Real-world project output
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                University MOU Status
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-info/10 text-info">
                <ShieldCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
              Accredited
            </p>
            <p className="mt-2 text-xs text-muted-foreground">MOU valid through Dec 2027</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Department Allocations (shadcn Table) ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Department Capacity & Placement Allocation
          </CardTitle>
          <CardDescription>
            Monitoring mentor assignments and host department utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Host Department</TableHead>
                <TableHead>Lead Mentor</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Attendance Compliance</TableHead>
                <TableHead>Slot Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptAllocations.map((d) => (
                <TableRow key={d.dept}>
                  <TableCell className="font-semibold text-foreground">{d.dept}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.mentor}</TableCell>
                  <TableCell className="text-xs font-mono">
                    {d.interns} / {d.capacity}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {d.attendance}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={d.status === "Optimal" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost" className="text-xs text-primary">
                      <Link to="/admin">Manage →</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. UNIVERSITY & SYSTEM ADMIN DASHBOARD (Faculty Dean / Coordinator)
// ─────────────────────────────────────────────────────────────────────────────
function UniversityAdminDashboard({
  userId,
  name,
  role,
}: {
  userId: string;
  name: string;
  role: string;
}) {
  const greeting = getGreeting();

  const universityCohort = [
    {
      regNo: "CS/2021/0042",
      name: "Alice Wanjiku",
      company: "TechCorp Kenya Ltd",
      mentor: "James Otieno",
      daysLogged: 42,
      targetDays: 60,
      midtermGrade: "A (4.8)",
      compliance: "On Track",
    },
    {
      regNo: "CS/2021/0088",
      name: "Mark Mwangi",
      company: "Safaricom PLC",
      mentor: "Grace Muthoni",
      daysLogged: 39,
      targetDays: 60,
      midtermGrade: "B+ (4.2)",
      compliance: "On Track",
    },
    {
      regNo: "CS/2021/0015",
      name: "Faith Muthoni",
      company: "Kenya Commercial Bank",
      mentor: "Brian Njoroge",
      daysLogged: 60,
      targetDays: 60,
      midtermGrade: "A (4.9)",
      compliance: "Clearance Granted",
    },
    {
      regNo: "CS/2021/0104",
      name: "Kevin Kiprono",
      company: "Apex Telecom Solutions",
      mentor: "Samson Omondi",
      daysLogged: 18,
      targetDays: 60,
      midtermGrade: "Pending",
      compliance: "At Risk (Low Activity)",
    },
  ];

  return (
    <div className="space-y-6 antialiased">
      {/* ── Dean Header ── */}
      <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-white/30 bg-white/10 text-white text-xs font-semibold"
              >
                Institutional Dean & Accreditation Console
              </Badge>
              <span className="text-xs text-primary-foreground/70">
                University of Nairobi • School of Computing
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Institutional oversight across 48 attachment placements, accreditation audits, and
              faculty evaluations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm"
            >
              <Link to="/reports">
                <FileBarChart className="mr-1.5 size-4" />
                Accreditation Dossier (PDF)
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs"
            >
              <Link to="/admin">
                <GraduationCap className="mr-1.5 size-4" />
                Academic Roster
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── At-Risk Alert Banner (shadcn Alert) ── */}
      <Alert
        variant="destructive"
        className="border-destructive/30 bg-destructive/10 text-destructive-foreground rounded-xl"
      >
        <ShieldAlert className="size-4" />
        <AlertTitle className="font-semibold text-sm">Cohort Attendance Risk Alert</AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            1 student flagged: <strong className="text-foreground">Kevin Kiprono</strong> has logged
            only 18 of 60 required days and is behind schedule.
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.info("Dispatched inquiry to host mentor Samson Omondi at Apex Telecom.")
            }
            className="h-7 text-xs border-destructive/30 text-destructive-foreground shrink-0"
          >
            Dispatch Reminder to Mentor
          </Button>
        </AlertDescription>
      </Alert>

      {/* ── Institutional Metric KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Enrolled Placements
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">48</p>
            <p className="mt-2 text-xs text-muted-foreground">BSc. Computer Science cohort</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Host Organizations
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <Building2 className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">18</p>
            <p className="mt-2 text-xs text-muted-foreground">Corporate & industrial partners</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Compliance Accuracy
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <ShieldCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">97.2%</p>
            <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="size-3" /> Verified logbooks & signatures
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Final Clearances
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-info/10 text-info">
                <FileCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">14</p>
            <p className="mt-2 text-xs text-muted-foreground">Ready for academic board defense</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Institutional Placements & Compliance Table (shadcn Table) ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Institutional Placement Accreditation Roster
          </CardTitle>
          <CardDescription>
            Live audit of student progress toward university graduation criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Host Organization</TableHead>
                <TableHead>Industry Mentor</TableHead>
                <TableHead>Days Logged</TableHead>
                <TableHead>Assessment Grade</TableHead>
                <TableHead>Accreditation</TableHead>
                <TableHead className="text-right">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universityCohort.map((student) => (
                <TableRow key={student.regNo}>
                  <TableCell className="font-semibold text-foreground">
                    <div>
                      <p>{student.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{student.regNo}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{student.company}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{student.mentor}</TableCell>
                  <TableCell className="text-xs font-mono">
                    {student.daysLogged} / {student.targetDays}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {student.midtermGrade}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.compliance.includes("Risk")
                          ? "destructive"
                          : student.compliance.includes("Clearance")
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {student.compliance}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost" className="text-xs text-primary">
                      <Link to="/reports">Dossier →</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
