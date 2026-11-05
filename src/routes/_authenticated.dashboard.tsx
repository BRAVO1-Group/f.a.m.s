import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
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
  Info,
  Key,
  Laptop,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquareCheck,
  Milestone,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAppUser } from "@/lib/app-user";
import {
  ROLE_LABELS,
  ROLE_TIERS,
  setDemoUser,
  hasPermission,
  usePermissions,
  type AppRole,
} from "@/lib/auth";
import {
  activities as initialActivities,
  attendance as initialAttendance,
  internships as initialInternships,
  milestones,
  evaluations,
  organizations,
  DEMO_USERS,
  profiles,
  SYSTEM_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getStoredSupervisors,
  addSupervisor,
  getStoredRBAC,
  saveStoredRBAC,
  getStoredInternships,
  assignSupervisors,
  type MockActivity,
  type MockSupervisor,
  type MockInternship,
  type RolePermissionsMap,
  type SupervisorType,
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

  const permissions = usePermissions(role);
  const tierInfo = ROLE_TIERS[role];
  const [rbacModalOpen, setRbacModalOpen] = useState(false);

  const rbacBanner = (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/30 px-4 py-2.5 text-xs shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Active RBAC Clearance:
        </span>
        <Badge variant="outline" className={`font-semibold ${tierInfo.color}`}>
          {tierInfo.level}
        </Badge>
        <span className="text-muted-foreground hidden lg:inline">• {tierInfo.description}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="secondary" className="font-mono text-[11px]">
          {permissions.length} / {SYSTEM_PERMISSIONS.length} Privileges Active
        </Badge>
        <Dialog open={rbacModalOpen} onOpenChange={setRbacModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-primary/20 text-primary hover:bg-primary/5"
            >
              <Key className="mr-1 size-3.5" />
              View RBAC Scope
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                Active RBAC Permissions Matrix — {ROLE_LABELS[role]}
              </DialogTitle>
              <DialogDescription>
                Live role-based access control privileges dynamically enforced for your current
                persona.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 p-3.5 rounded-xl bg-muted/50 border border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">{tierInfo.level}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tierInfo.description}</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs font-semibold shrink-0">
                  {permissions.length} Granted
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4 max-h-[50vh]">
              <div className="space-y-2 py-2">
                {SYSTEM_PERMISSIONS.map((perm) => {
                  const isGranted = permissions.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      className={`flex items-start justify-between p-3 rounded-xl border text-xs transition ${
                        isGranted
                          ? "bg-primary/5 border-primary/20 text-foreground"
                          : "bg-muted/20 border-border/40 opacity-60 text-muted-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-primary">
                            {perm.id}
                          </span>
                          <span className="font-medium text-foreground">{perm.label}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                        <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                          Category: {perm.category}
                        </span>
                      </div>
                      <Badge
                        variant={isGranted ? "default" : "outline"}
                        className="text-[10px] font-semibold shrink-0"
                      >
                        {isGranted ? "Granted" : "Restricted"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button size="sm" onClick={() => setRbacModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {switcherBar}
      {rbacBanner}
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
  const allStoredInternships = getStoredInternships();
  const allStoredSupervisors = getStoredSupervisors();

  const myInternship =
    allStoredInternships.find((i) => i.student_id === userId) ||
    initialInternships.find((i) => i.student_id === userId);

  const orgSupervisor =
    allStoredSupervisors.find((s) => s.id === myInternship?.supervisor_id) ||
    allStoredSupervisors.find((s) => s.type === "organization");

  const academicSupervisor =
    allStoredSupervisors.find((s) => s.id === myInternship?.academic_supervisor_id) ||
    allStoredSupervisors.find((s) => s.type === "university");

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

      {/* ── Assigned Dual Supervisors (RBAC Presentation) ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border/80 shadow-xs bg-card/60 backdrop-blur">
          <CardContent className="p-4 sm:p-4.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Host Industry Mentor
                    </span>
                    <Badge
                      variant="outline"
                      className="border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 text-[10px]"
                    >
                      Host Org
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm text-foreground mt-0.5">
                    {orgSupervisor?.full_name ?? "James Otieno"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {orgSupervisor?.title ?? "Senior Lead Architect"} •{" "}
                    {orgSupervisor?.organization_name ?? orgName}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-mono">
                <Mail className="size-3 text-primary" />
                {orgSupervisor?.email ?? "james.otieno@techcorp.co.ke"}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="size-3 text-primary" />
                {orgSupervisor?.phone ?? "+254 722 001 122"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs bg-card/60 backdrop-blur">
          <CardContent className="p-4 sm:p-4.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Academic Faculty Assessor
                    </span>
                    <Badge
                      variant="outline"
                      className="border-indigo-300 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 text-[10px]"
                    >
                      University
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm text-foreground mt-0.5">
                    {academicSupervisor?.full_name ?? "Dr. Peter Kamau"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {academicSupervisor?.title ?? "Dean of Computing"} •{" "}
                    {academicSupervisor?.faculty_department ?? "School of Computing & Informatics"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-mono">
                <Mail className="size-3 text-primary" />
                {academicSupervisor?.email ?? "dean@university.ac.ke"}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Phone className="size-3 text-primary" />
                {academicSupervisor?.phone ?? "+254 701 234 567"}
              </span>
            </div>
          </CardContent>
        </Card>
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
  const supervisorsList = getStoredSupervisors();
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) || supervisorsList[0];
  const isOrgSupervisor = currentSupervisor?.type === "organization";

  const allInternships = getStoredInternships();
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
                {isOrgSupervisor
                  ? "🏢 Host Organization Field Mentor"
                  : "🏛️ University Academic Supervisor"}
              </Badge>
              <span className="text-xs text-primary-foreground/70">
                {isOrgSupervisor
                  ? `${currentSupervisor?.organization_name ?? "TechCorp Kenya Ltd"} • ${currentSupervisor?.faculty_department ?? "Product Engineering"}`
                  : `University of Nairobi • ${currentSupervisor?.faculty_department ?? "School of Computing"}`}
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

  // ── State synced with in-memory / session storage ──
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [internshipsList, setInternshipsList] = useState<MockInternship[]>(getStoredInternships);
  const [rbacMatrix, setRbacMatrix] = useState<RolePermissionsMap>(getStoredRBAC);

  // Filter & search states
  const [supervisorFilter, setSupervisorFilter] = useState<"all" | "organization" | "university">(
    "all",
  );
  const [supervisorSearch, setSupervisorSearch] = useState("");
  const [rbacSearch, setRbacSearch] = useState("");
  const [rbacCategoryFilter, setRbacCategoryFilter] = useState<string>("all");

  // Dialog states
  const [createSupervisorOpen, setCreateSupervisorOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Create supervisor form state
  const [supFormType, setSupFormType] = useState<SupervisorType>("organization");
  const [supFormName, setSupFormName] = useState("");
  const [supFormEmail, setSupFormEmail] = useState("");
  const [supFormPhone, setSupFormPhone] = useState("");
  const [supFormTitle, setSupFormTitle] = useState("");
  const [supFormOrgOrUni, setSupFormOrgOrUni] = useState("TechCorp Kenya Ltd");
  const [supFormDept, setSupFormDept] = useState("Product Engineering");

  // Assign supervisor form state
  const [assignStudentId, setAssignStudentId] = useState("student-1");
  const [assignOrgSupId, setAssignOrgSupId] = useState("");
  const [assignAcademicSupId, setAssignAcademicSupId] = useState("");

  // Sync with global custom events
  useEffect(() => {
    const handleDataChange = () => {
      setSupervisorsList(getStoredSupervisors());
      setInternshipsList(getStoredInternships());
    };
    const handleRbacChange = () => {
      setRbacMatrix(getStoredRBAC());
    };

    window.addEventListener("internflow-data-change", handleDataChange);
    window.addEventListener("internflow-rbac-change", handleRbacChange);
    return () => {
      window.removeEventListener("internflow-data-change", handleDataChange);
      window.removeEventListener("internflow-rbac-change", handleRbacChange);
    };
  }, []);

  const universityCohort = [
    {
      studentId: "student-1",
      regNo: "CS/2021/0042",
      name: "Alice Wanjiku",
      course: "BSc. Computer Science",
      company: "TechCorp Kenya Ltd",
      daysLogged: 42,
      targetDays: 60,
      midtermGrade: "A (4.8)",
      compliance: "On Track",
    },
    {
      studentId: "student-2",
      regNo: "CS/2021/0088",
      name: "Brian Mwangi",
      course: "BSc. Networking & Security",
      company: "Safaricom PLC",
      daysLogged: 39,
      targetDays: 60,
      midtermGrade: "B+ (4.2)",
      compliance: "On Track",
    },
    {
      studentId: "student-3",
      regNo: "CS/2021/0015",
      name: "Carol Achieng",
      course: "BSc. Data Science",
      company: "Kenya Commercial Bank",
      daysLogged: 60,
      targetDays: 60,
      midtermGrade: "A (4.9)",
      compliance: "Clearance Granted",
    },
    {
      studentId: "student-4",
      regNo: "CS/2021/0104",
      name: "Kevin Kiprono",
      course: "BSc. Computer Science (Cybersecurity)",
      company: "TechCorp Kenya Ltd",
      daysLogged: 18,
      targetDays: 60,
      midtermGrade: "Pending",
      compliance: "At Risk (Low Activity)",
    },
  ];

  // ── Handlers ──
  const handleOpenAssignModal = (studentId: string) => {
    const intern = internshipsList.find((i) => i.student_id === studentId);
    setAssignStudentId(studentId);
    setAssignOrgSupId(intern?.supervisor_id ?? "");
    setAssignAcademicSupId(intern?.academic_supervisor_id ?? "");
    setAssignDialogOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!assignStudentId) {
      toast.error("Please select a student");
      return;
    }
    assignSupervisors(assignStudentId, assignOrgSupId, assignAcademicSupId);
    setSupervisorsList(getStoredSupervisors());
    setInternshipsList(getStoredInternships());
    setAssignDialogOpen(false);
    const student = universityCohort.find((s) => s.studentId === assignStudentId);
    toast.success("Supervisors assigned successfully!", {
      description: `Updated mentorship pair for ${student?.name ?? "student"}.`,
    });
  };

  const handleCreateSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supFormName.trim() || !supFormEmail.trim() || !supFormTitle.trim()) {
      toast.error("Please fill in required fields (Name, Email, Title)");
      return;
    }

    addSupervisor({
      full_name: supFormName.trim(),
      email: supFormEmail.trim(),
      phone: supFormPhone.trim() || "+254 700 000 000",
      type: supFormType,
      title: supFormTitle.trim(),
      organization_name: supFormType === "organization" ? supFormOrgOrUni : "University of Nairobi",
      faculty_department:
        supFormDept.trim() ||
        (supFormType === "organization" ? "Engineering" : "School of Computing"),
    });

    setSupervisorsList(getStoredSupervisors());
    setCreateSupervisorOpen(false);

    toast.success(
      supFormType === "organization"
        ? "Host Organization Mentor created!"
        : "University Academic Supervisor created!",
      {
        description: `${supFormName} is now registered in the institutional supervisor directory.`,
      },
    );

    // Reset form
    setSupFormName("");
    setSupFormEmail("");
    setSupFormPhone("");
    setSupFormTitle("");
  };

  const handleTogglePermission = (targetRole: AppRole, permissionId: string) => {
    setRbacMatrix((prev) => {
      const currentList = prev[targetRole] || [];
      const updated = currentList.includes(permissionId)
        ? currentList.filter((p) => p !== permissionId)
        : [...currentList, permissionId];
      return {
        ...prev,
        [targetRole]: updated,
      };
    });
  };

  const handleSaveRbacMatrix = () => {
    saveStoredRBAC(rbacMatrix);
    toast.success("RBAC Permissions Matrix Saved!", {
      description:
        "Access control privileges have been applied immediately across all roles in this session.",
    });
  };

  const handleResetRbacDefaults = () => {
    setRbacMatrix(DEFAULT_ROLE_PERMISSIONS);
    saveStoredRBAC(DEFAULT_ROLE_PERMISSIONS);
    toast.info("RBAC matrix reset to institutional defaults");
  };

  // Filtered supervisors
  const filteredSupervisors = supervisorsList.filter((s) => {
    if (supervisorFilter !== "all" && s.type !== supervisorFilter) return false;
    if (supervisorSearch) {
      const q = supervisorSearch.toLowerCase();
      return (
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.organization_name && s.organization_name.toLowerCase().includes(q)) ||
        (s.faculty_department && s.faculty_department.toLowerCase().includes(q)) ||
        s.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const orgSupervisors = supervisorsList.filter((s) => s.type === "organization");
  const uniSupervisors = supervisorsList.filter((s) => s.type === "university");

  // Filtered RBAC permissions
  const filteredPermissions = SYSTEM_PERMISSIONS.filter((p) => {
    if (rbacCategoryFilter !== "all" && p.category !== rbacCategoryFilter) return false;
    if (rbacSearch) {
      const q = rbacSearch.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate dual-supervised count
  const dualAssignedCount = universityCohort.filter((student) => {
    const intern = internshipsList.find((i) => i.student_id === student.studentId);
    return intern?.supervisor_id && intern?.academic_supervisor_id;
  }).length;

  return (
    <div className="space-y-6 antialiased">
      {/* ── Dean Executive Header ── */}
      <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-white/30 bg-white/10 text-white text-xs font-semibold"
              >
                Institutional Dean & Accreditation Console
              </Badge>
              <span className="text-xs text-primary-foreground/75">
                University of Nairobi • School of Computing & Informatics
              </span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl font-bold sm:text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80 max-w-2xl">
              Institutional governance: manage industry and university supervisors, assign dual
              mentors, enforce role-based access control (RBAC), and review accreditation dossiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => setCreateSupervisorOpen(true)}
              className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm h-9"
            >
              <UserPlus className="mr-1.5 size-4" />
              Create Supervisor Account
            </Button>
            <Button
              onClick={() => handleOpenAssignModal("student-4")}
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs h-9"
            >
              <UserCheck className="mr-1.5 size-4" />
              Assign Supervisors
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-xs h-9"
            >
              <Link to="/reports">
                <FileBarChart className="mr-1.5 size-4" />
                Dossier (PDF)
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── At-Risk Alert Banner ── */}
      <Alert
        variant="destructive"
        className="border-destructive/30 bg-destructive/10 text-destructive-foreground rounded-xl"
      >
        <ShieldAlert className="size-4" />
        <AlertTitle className="font-semibold text-sm">
          Cohort Attendance Risk & Supervisor Allocation Alert
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            1 student flagged: <strong className="text-foreground">Kevin Kiprono</strong> has logged
            only 18 of 60 required days and is currently missing an assigned University Academic
            Supervisor.
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenAssignModal("student-4")}
            className="h-7 text-xs border-destructive/30 text-destructive-foreground shrink-0"
          >
            Assign Academic Assessor Now
          </Button>
        </AlertDescription>
      </Alert>

      {/* ── Institutional Metrics KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Enrolled Cohort
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {universityCohort.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Active placement candidates</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Supervisor Roster
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {supervisorsList.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {orgSupervisors.length} Org Mentors • {uniSupervisors.length} Faculty
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dual-Supervision Rate
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <ShieldCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {Math.round((dualAssignedCount / universityCohort.length) * 100)}%
            </p>
            <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="size-3" /> {dualAssignedCount} of {universityCohort.length}{" "}
              fully paired
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                RBAC Security Tier
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Key className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">Tier 4</p>
            <p className="mt-2 text-xs text-muted-foreground">Institutional Governance Active</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Administration Tabs ── */}
      <Tabs defaultValue="placements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-11 p-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="placements" className="rounded-lg text-xs font-semibold">
            <GraduationCap className="mr-1.5 size-4" />
            Accreditation & Placements
          </TabsTrigger>
          <TabsTrigger value="supervisors" className="rounded-lg text-xs font-semibold">
            <Users className="mr-1.5 size-4" />
            Supervisor Accounts ({supervisorsList.length})
          </TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-lg text-xs font-semibold">
            <UserCheck className="mr-1.5 size-4" />
            Dual-Supervisor Pairing
          </TabsTrigger>
          <TabsTrigger value="rbac" className="rounded-lg text-xs font-semibold">
            <Lock className="mr-1.5 size-4" />
            RBAC Roles & Permissions
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: ACCREDITATION & PLACEMENTS
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="placements" className="space-y-4">
          <Card className="shadow-card border-border/80">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">
                  Institutional Placement & Supervisor Roster
                </CardTitle>
                <CardDescription>
                  Audit student progress toward university attachment defense with assigned mentors
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenAssignModal("student-4")}
                className="text-xs h-8"
              >
                <UserCheck className="mr-1.5 size-3.5" />
                Assign Supervisors
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Details</TableHead>
                    <TableHead>Host Organization</TableHead>
                    <TableHead>Host Industry Mentor</TableHead>
                    <TableHead>University Faculty Assessor</TableHead>
                    <TableHead>Days Logged</TableHead>
                    <TableHead>Pairing Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {universityCohort.map((student) => {
                    const intern = internshipsList.find((i) => i.student_id === student.studentId);
                    const orgSup = supervisorsList.find((s) => s.id === intern?.supervisor_id);
                    const academicSup = supervisorsList.find(
                      (s) => s.id === intern?.academic_supervisor_id,
                    );
                    const isDualAssigned = orgSup && academicSup;

                    return (
                      <TableRow key={student.regNo}>
                        <TableCell className="font-semibold text-foreground">
                          <div>
                            <p>{student.name}</p>
                            <p className="text-[11px] font-mono text-muted-foreground">
                              {student.regNo} • {student.course.split(" ")[1]}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {student.company}
                        </TableCell>
                        <TableCell className="text-xs">
                          {orgSup ? (
                            <div>
                              <p className="font-medium text-foreground">{orgSup.full_name}</p>
                              <p className="text-[11px] text-muted-foreground">{orgSup.title}</p>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-300 text-amber-700 bg-amber-50 text-[10px]"
                            >
                              Pending Mentor
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {academicSup ? (
                            <div>
                              <p className="font-medium text-foreground">{academicSup.full_name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {academicSup.title}
                              </p>
                            </div>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              Missing Academic
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {student.daysLogged} / {student.targetDays}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isDualAssigned ? "default" : "secondary"}
                            className={`text-xs ${
                              isDualAssigned
                                ? "bg-success/10 text-success border-success/30"
                                : "bg-amber-500/10 text-amber-700 border-amber-300"
                            }`}
                          >
                            {isDualAssigned ? "Dual-Supervised" : "Needs Allocation"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenAssignModal(student.studentId)}
                            className="text-xs text-primary hover:text-primary h-7.5"
                          >
                            Reassign →
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: SUPERVISOR MANAGEMENT (ORG & UNIVERSITY)
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="supervisors" className="space-y-4">
          <Card className="shadow-card border-border/80">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">
                  Institutional Supervisor Directory & Account Management
                </CardTitle>
                <CardDescription>
                  Create and manage both Organization Mentors (field) and University Academic
                  Supervisors (faculty)
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setCreateSupervisorOpen(true)}
                className="text-xs h-8.5 shrink-0"
              >
                <Plus className="mr-1.5 size-3.5" />
                Create Supervisor Account
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filter and search bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search supervisors..."
                    value={supervisorSearch}
                    onChange={(e) => setSupervisorSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant={supervisorFilter === "all" ? "default" : "outline"}
                    onClick={() => setSupervisorFilter("all")}
                    className="h-8 text-xs"
                  >
                    All ({supervisorsList.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={supervisorFilter === "organization" ? "default" : "outline"}
                    onClick={() => setSupervisorFilter("organization")}
                    className="h-8 text-xs"
                  >
                    <Building2 className="mr-1.5 size-3" />
                    Host Org Mentors ({orgSupervisors.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={supervisorFilter === "university" ? "default" : "outline"}
                    onClick={() => setSupervisorFilter("university")}
                    className="h-8 text-xs"
                  >
                    <GraduationCap className="mr-1.5 size-3" />
                    Academic Faculty ({uniSupervisors.length})
                  </Button>
                </div>
              </div>

              {/* Grid of supervisors */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSupervisors.map((sup) => {
                  const isOrg = sup.type === "organization";
                  const assignedStudents = universityCohort.filter((c) =>
                    sup.assigned_student_ids.includes(c.studentId),
                  );

                  return (
                    <Card
                      key={sup.id}
                      className="border-border/80 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-9 border">
                              <AvatarFallback
                                className={`text-xs font-semibold ${
                                  isOrg
                                    ? "bg-amber-500/10 text-amber-700"
                                    : "bg-indigo-500/10 text-indigo-700"
                                }`}
                              >
                                {sup.full_name
                                  .split(" ")
                                  .map((p) => p[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm text-foreground leading-tight">
                                {sup.full_name}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                {sup.title}
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold shrink-0 ${
                              isOrg
                                ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                : "border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                            }`}
                          >
                            {isOrg ? "🏢 Host Org" : "🏛️ University"}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/50">
                          <p className="text-foreground/90 font-medium line-clamp-1">
                            {isOrg ? sup.organization_name : "University of Nairobi"}
                          </p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {sup.faculty_department}
                          </p>
                        </div>

                        <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                          <p className="flex items-center gap-1.5">
                            <Mail className="size-3 text-primary shrink-0" />
                            <span className="truncate">{sup.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="size-3 text-primary shrink-0" />
                            <span>{sup.phone}</span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border/50">
                          <span className="text-[11px] text-muted-foreground font-medium block mb-1">
                            Assigned Candidates ({assignedStudents.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {assignedStudents.length > 0 ? (
                              assignedStudents.map((s) => (
                                <Badge
                                  key={s.studentId}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {s.name.split(" ")[0]}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">
                                None assigned yet
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: DUAL-SUPERVISOR PAIRING CONSOLE
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="assignments" className="space-y-4">
          <Card className="shadow-card border-border/80">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">
                  Dual-Supervisor Student Assignment Console
                </CardTitle>
                <CardDescription>
                  Pair each student with a Host Organization Mentor and a University Academic
                  Supervisor
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => handleOpenAssignModal("student-4")}
                className="text-xs h-8"
              >
                <Plus className="mr-1.5 size-3.5" />
                New Assignment Pair
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Candidate</TableHead>
                      <TableHead>Host Organization</TableHead>
                      <TableHead>🏢 Assigned Field Mentor</TableHead>
                      <TableHead>🏛️ Assigned Faculty Assessor</TableHead>
                      <TableHead>Pairing Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {universityCohort.map((student) => {
                      const intern = internshipsList.find(
                        (i) => i.student_id === student.studentId,
                      );
                      const orgSup = supervisorsList.find((s) => s.id === intern?.supervisor_id);
                      const academicSup = supervisorsList.find(
                        (s) => s.id === intern?.academic_supervisor_id,
                      );
                      const isComplete = orgSup && academicSup;

                      return (
                        <TableRow key={student.studentId}>
                          <TableCell className="font-semibold text-foreground">
                            <div>
                              <p>{student.name}</p>
                              <p className="text-[11px] font-mono text-muted-foreground">
                                {student.regNo}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {student.company}
                          </TableCell>
                          <TableCell className="text-xs">
                            {orgSup ? (
                              <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                <span className="font-medium text-foreground">
                                  {orgSup.full_name}
                                </span>
                              </div>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] text-amber-700 border-amber-300"
                              >
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {academicSup ? (
                              <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-indigo-500" />
                                <span className="font-medium text-foreground">
                                  {academicSup.full_name}
                                </span>
                              </div>
                            ) : (
                              <Badge variant="destructive" className="text-[10px]">
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isComplete ? "default" : "secondary"}
                              className={`text-xs ${
                                isComplete
                                  ? "bg-success/10 text-success border-success/30"
                                  : "bg-amber-500/10 text-amber-700 border-amber-300"
                              }`}
                            >
                              {isComplete ? "Dual-Supervised" : "Pending Assessor"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAssignModal(student.studentId)}
                              className="text-xs h-7.5"
                            >
                              Edit Mentors
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: RBAC ROLES & PERMISSIONS MATRIX
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="rbac" className="space-y-4">
          <Card className="shadow-card border-border/80">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">
                  Institutional RBAC Matrix & Role Permissions Controller
                </CardTitle>
                <CardDescription>
                  Define system boundaries, action clearances, and functional permissions across all
                  institutional roles
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetRbacDefaults}
                  className="text-xs h-8"
                >
                  <RefreshCw className="mr-1.5 size-3.5" />
                  Reset Defaults
                </Button>
                <Button size="sm" onClick={handleSaveRbacMatrix} className="text-xs h-8">
                  <ShieldCheck className="mr-1.5 size-3.5" />
                  Save Permissions Matrix
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Role hierarchy cards */}
              <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
                {(Object.keys(ROLE_TIERS) as AppRole[]).map((r) => {
                  const t = ROLE_TIERS[r];
                  const activePermCount = (rbacMatrix[r] || []).length;
                  return (
                    <div
                      key={r}
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        r === role
                          ? "border-primary ring-1 ring-primary/40 bg-primary/5"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-xs">
                          {ROLE_LABELS[r]}
                        </span>
                        <Badge variant="outline" className={`text-[10px] ${t.color}`}>
                          Tier {t.tier}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {activePermCount} Permissions
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* RBAC search & category filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions..."
                    value={rbacSearch}
                    onChange={(e) => setRbacSearch(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                <Select value={rbacCategoryFilter} onValueChange={setRbacCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-56 h-9 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Logbooks & Activity Logging">
                      Logbooks & Activities
                    </SelectItem>
                    <SelectItem value="Attendance & Verification">
                      Attendance & Verification
                    </SelectItem>
                    <SelectItem value="Milestones & Deliverables">
                      Milestones & Deliverables
                    </SelectItem>
                    <SelectItem value="Evaluations & Grading">Evaluations & Grading</SelectItem>
                    <SelectItem value="Supervisors & Placements">
                      Supervisors & Placements
                    </SelectItem>
                    <SelectItem value="RBAC Governance & Access Control">
                      Governance & Access Control
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Matrix Table */}
              <div className="rounded-xl border border-border/80 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="w-72">Permission & Security Scope</TableHead>
                      <TableHead className="text-center">
                        <div>
                          <p>Student</p>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Tier 1
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div>
                          <p>Supervisor</p>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Tier 2
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div>
                          <p>Org Admin</p>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Tier 3
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div>
                          <p>Uni Admin</p>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Tier 4
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div>
                          <p>System Admin</p>
                          <span className="text-[10px] text-muted-foreground font-normal">
                            Tier 5
                          </span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.map((perm) => (
                      <TableRow key={perm.id}>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-primary">
                                {perm.id}
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                                {perm.category.split(" ")[0]}
                              </Badge>
                            </div>
                            <p className="font-medium text-xs text-foreground mt-0.5">
                              {perm.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                          </div>
                        </TableCell>

                        {(
                          [
                            "student",
                            "supervisor",
                            "org_admin",
                            "uni_admin",
                            "system_admin",
                          ] as AppRole[]
                        ).map((r) => {
                          const isChecked = (rbacMatrix[r] || []).includes(perm.id);
                          return (
                            <TableCell key={r} className="text-center">
                              <div className="flex justify-center">
                                <Switch
                                  checked={isChecked}
                                  onCheckedChange={() => handleTogglePermission(r, perm.id)}
                                  aria-label={`Toggle ${perm.id} for ${r}`}
                                />
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: CREATE SUPERVISOR ACCOUNT (ORG & UNIVERSITY)
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={createSupervisorOpen} onOpenChange={setCreateSupervisorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Create Supervisor Account
            </DialogTitle>
            <DialogDescription>
              Register an Organization Mentor (field supervisor) or University Academic Supervisor
              (faculty lecturer).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSupervisor} className="space-y-4 py-2">
            {/* Supervisor Type Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Supervisor Role Type *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={supFormType === "organization" ? "default" : "outline"}
                  onClick={() => {
                    setSupFormType("organization");
                    setSupFormTitle("Senior Lead Architect & Field Mentor");
                  }}
                  className="h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  <Building2 className="size-4" />
                  Host Org Mentor
                </Button>
                <Button
                  type="button"
                  variant={supFormType === "university" ? "default" : "outline"}
                  onClick={() => {
                    setSupFormType("university");
                    setSupFormTitle("Senior Lecturer & Academic Assessor");
                  }}
                  className="h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  <GraduationCap className="size-4" />
                  Academic Supervisor
                </Button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                placeholder={
                  supFormType === "organization"
                    ? "e.g. Eng. Kevin Otieno"
                    : "e.g. Dr. Joyce Chelangat"
                }
                value={supFormName}
                onChange={(e) => setSupFormName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Official Email *</Label>
                <Input
                  type="email"
                  placeholder="name@domain.com"
                  value={supFormEmail}
                  onChange={(e) => setSupFormEmail(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Phone Number</Label>
                <Input
                  placeholder="+254 700 000 000"
                  value={supFormPhone}
                  onChange={(e) => setSupFormPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Designation / Title *</Label>
              <Input
                placeholder="e.g. Lead Software Architect / Senior Lecturer"
                value={supFormTitle}
                onChange={(e) => setSupFormTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            {/* Organization or University Name */}
            {supFormType === "organization" ? (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Host Organization *</Label>
                <Select value={supFormOrgOrUni} onValueChange={setSupFormOrgOrUni}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TechCorp Kenya Ltd">TechCorp Kenya Ltd</SelectItem>
                    <SelectItem value="Safaricom PLC">Safaricom PLC</SelectItem>
                    <SelectItem value="Kenya Commercial Bank">Kenya Commercial Bank</SelectItem>
                    <SelectItem value="Apex Telecom Solutions">Apex Telecom Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Institution / University</Label>
                <Input value="University of Nairobi" disabled className="h-9 text-xs bg-muted/60" />
              </div>
            )}

            {/* Department / Faculty */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                {supFormType === "organization"
                  ? "Host Department"
                  : "Academic Faculty / Department"}
              </Label>
              <Input
                placeholder={
                  supFormType === "organization"
                    ? "e.g. Product Engineering / Cloud Infrastructure"
                    : "e.g. School of Computing & Informatics"
                }
                value={supFormDept}
                onChange={(e) => setSupFormDept(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateSupervisorOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Create & Activate Supervisor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL: ASSIGN SUPERVISORS TO STUDENT
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Assign Dual Supervisors to Student
            </DialogTitle>
            <DialogDescription>
              Pair an intern candidate with their host company mentor and university academic
              assessor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Student selection */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Select Student Candidate *</Label>
              <Select value={assignStudentId} onValueChange={setAssignStudentId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose Student" />
                </SelectTrigger>
                <SelectContent>
                  {universityCohort.map((s) => (
                    <SelectItem key={s.studentId} value={s.studentId}>
                      {s.name} ({s.regNo}) • {s.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Host Organization Supervisor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Host Organization Mentor (Field)</Label>
                <Badge
                  variant="outline"
                  className="text-[9px] border-amber-300 text-amber-700 bg-amber-50"
                >
                  Company
                </Badge>
              </div>
              <Select value={assignOrgSupId} onValueChange={setAssignOrgSupId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose Host Org Mentor" />
                </SelectTrigger>
                <SelectContent>
                  {orgSupervisors.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.full_name} • {sup.organization_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* University Academic Supervisor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">
                  University Academic Supervisor (Faculty)
                </Label>
                <Badge
                  variant="outline"
                  className="text-[9px] border-indigo-300 text-indigo-700 bg-indigo-50"
                >
                  Faculty
                </Badge>
              </div>
              <Select value={assignAcademicSupId} onValueChange={setAssignAcademicSupId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose University Supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {uniSupervisors.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.full_name} • {sup.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Accreditation Requirement:</p>
              <p className="text-[11px]">
                Both supervisors must approve weekly logs and submit evaluations before
                institutional clearance is granted for defense.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveAssignment}>
                Save Supervisor Pair
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
