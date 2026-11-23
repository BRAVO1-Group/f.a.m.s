import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
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
  RotateCcw,
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
  FileText,
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
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AuditTrailPanel, recordAuditEvent } from "@/components/dashboard/audit-trail-panel";
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
import { Textarea } from "@/components/ui/textarea";
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
  getStoredActivities,
  saveStoredActivities,
  approveOrCorrectActivity,
  type MockActivity,
  type MockSupervisor,
  type MockInternship,
  type RolePermissionsMap,
  type SupervisorType,
} from "@/lib/mock-data";

import { getGreeting } from "./get-greeting";

// ─────────────────────────────────────────────────────────────────────────────
// 3. ORGANIZATION / COMPANY ROLE DASHBOARD (Received Logins Tied to Assigned Students)
// ─────────────────────────────────────────────────────────────────────────────
export function OrgAdminDashboard({ userId, name }: { userId: string; name: string }) {
  const greeting = getGreeting();
  const company = organizations[0]!; // TechCorp Kenya Ltd
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);

  useEffect(() => {
    const handler = () => {
      setActivitiesList(getStoredActivities());
    };
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  // Assigned students at TechCorp Kenya Ltd (bound to this company login)
  const assignedStudents = [
    {
      id: "student-1",
      name: "Alice Wanjiku",
      regNo: "CS/2021/0042",
      role: "Software Engineering Intern",
      department: "Product Engineering",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science",
      email: "alice@university.ac.ke",
      phone: "+254 712 345 678",
      mentor: "James Otieno",
      academicSupervisor: "Dr. Agnes Kimani",
      daysLogged: 42,
      requiredDays: 60,
      attendanceRate: "97.5%",
      status: "Active • On Track",
    },
    {
      id: "student-4",
      name: "Kevin Kiprono",
      regNo: "CS/2021/0104",
      role: "Cybersecurity Analyst Intern",
      department: "InfoSec Operations",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science (Cybersecurity)",
      email: "kevin.kiprono@university.ac.ke",
      phone: "+254 701 445 566",
      mentor: "James Otieno",
      academicSupervisor: "Dr. Agnes Kimani",
      daysLogged: 18,
      requiredDays: 60,
      attendanceRate: "95.0%",
      status: "Active • In Progress",
    },
  ];

  const assignedStudentIds = assignedStudents.map((s) => s.id);
  const myAssignedActivities = activitiesList.filter((a) =>
    assignedStudentIds.includes(a.student_id),
  );
  const pendingActivities = myAssignedActivities.filter((a) => a.status === "submitted");
  const approvedActivities = myAssignedActivities.filter((a) => a.status === "approved");

  const handleQuickApprove = (act: MockActivity) => {
    const student = assignedStudents.find((s) => s.id === act.student_id);
    approveOrCorrectActivity(
      act.id,
      "approved",
      userId,
      "Verified and approved by Host Organization Field Mentor (TechCorp Kenya Ltd).",
    );
    setActivitiesList(getStoredActivities());
    toast.success("Submission Approved", {
      description: `"${act.title}" for ${student?.name ?? "Intern"} has been verified and signed off.`,
    });
  };

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {company.name} · Westlands HQ · Supervising {assignedStudents.length} assigned interns
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/review">Review Queue ({pendingActivities.length})</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/students">Assigned Interns ({assignedStudents.length})</Link>
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Assigned Interns"
          value={assignedStudents.length}
          meta="Alice Wanjiku & Kevin Kiprono"
        />
        <KpiCard
          label="Pending Approvals"
          value={pendingActivities.length}
          meta="Awaiting sign-off"
        />
        <KpiCard
          label="Approved Deliverables"
          value={approvedActivities.length}
          meta="Signed off by host org"
        />
        <KpiCard
          label="University MOU"
          value="Accredited"
          meta="University of Nairobi"
        />
      </div>

      {/* ── Assigned Student Details (Candidate Profile & Placement Cards) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted text-foreground">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                Interns Assigned to {company.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Candidates placed under your organization&apos;s workplace supervision
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/students">View Candidate Roster</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {assignedStudents.map((student) => {
            const progressPct = Math.round((student.daysLogged / student.requiredDays) * 100);
            const initials = student.name
              .split(" ")
              .map((p) => p[0])
              .join("");

            return (
              <Link
                key={student.id}
                href={`/students/${student.id}`}
                className="group block focus:outline-none"
              >
                <Card className="rounded-xl border border-border/60 bg-card transition-all duration-150 hover:border-foreground/25 hover:shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="size-10 shrink-0 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-muted font-semibold text-xs text-foreground">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground group-hover:text-[#589E10] dark:group-hover:text-primary transition-colors">
                            {student.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono">{student.regNo}</span> · {student.role}
                          </p>
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-[11px] font-medium shrink-0">
                        {student.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{student.department}</span>
                        <span className="font-mono font-medium text-foreground">
                          {student.daysLogged} / {student.requiredDays} days ({progressPct}%)
                        </span>
                      </div>
                      <Progress value={progressPct} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                      <span className="text-muted-foreground">
                        Mentor: {student.mentor} · {student.attendanceRate} attendance
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:translate-x-0.5 transition-transform">
                        Open Student Profile
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Submissions Requiring Host Organization Approval ── */}
      <Card className="border-border/70 rounded-2xl">
        <CardHeader className="flex flex-col items-start justify-between gap-3 p-5 pb-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="font-display text-base font-bold">
              Submissions Requiring Host Org Sign-Off
            </CardTitle>
            <CardDescription>
              Review technical deliverables submitted by your assigned mentees
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/review">Open Full Review Queue</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 p-5 pt-2">
          {pendingActivities.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
              <CheckCircle2 className="mx-auto size-8 text-success mb-2" />
              All submissions from Alice and Kevin have been verified and signed off.
            </div>
          ) : (
            pendingActivities.map((act) => {
              const student = assignedStudents.find((s) => s.id === act.student_id);
              return (
                <div
                  key={act.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/70 p-4 transition hover:border-primary/50"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{act.title}</span>
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {student?.name ?? "Intern"}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {act.activity_date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {act.tools_used.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] py-0">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleQuickApprove(act)}
                      className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold gap-1"
                    >
                      <Check className="size-3.5" /> Quick Approve
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg text-xs font-semibold gap-1"
                    >
                      <Link href="/review">
                        <span>Review Details</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* ── Live Activity & Compliance Audit Trail ── */}
      <AuditTrailPanel role="org_admin" />
    </div>
  );
}
