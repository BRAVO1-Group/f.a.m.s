import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
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
            <Link to="/review">Review Queue ({pendingActivities.length})</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-9">
            <Link to="/students">Assigned Interns ({assignedStudents.length})</Link>
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Interns Assigned to TechCorp Kenya Ltd
            </h2>
            <p className="text-xs text-muted-foreground">
              Assigned candidates placed under your company's field supervision by the University
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link to="/students">View Candidate Roster</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {assignedStudents.map((student) => {
            const progressPct = Math.round((student.daysLogged / student.requiredDays) * 100);
            return (
              <Card
                key={student.id}
                className="shadow-card border-border/80 hover:border-primary/40 transition"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {student.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold">{student.name}</CardTitle>
                        <CardDescription className="font-mono text-xs text-muted-foreground">
                          {student.regNo} • {student.degree}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium border-success/40 bg-success/10 text-success"
                    >
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Placement Role
                      </span>
                      <span className="font-semibold text-foreground">{student.role}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {student.department}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Designated Field Mentor
                      </span>
                      <span className="font-semibold text-foreground">{student.mentor}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Academic: {student.academicSupervisor}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Attachment Attendance Pace</span>
                      <span className="font-mono font-semibold text-foreground">
                        {student.daysLogged} / {student.requiredDays} Days ({progressPct}%)
                      </span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/60">
                    <span className="text-[11px] text-muted-foreground">
                      Attendance Rate: <strong>{student.attendanceRate}</strong>
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="text-xs text-primary font-semibold h-7"
                    >
                      <Link to="/review">Review Submissions →</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Submissions Requiring Host Organization Approval ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="flex flex-col items-start justify-between gap-3 pb-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-base font-semibold">
              Submissions Requiring Host Org Sign-Off
            </CardTitle>
            <CardDescription>
              Review technical deliverables submitted by your assigned mentees
            </CardDescription>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link to="/review">Open Full Review Queue</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{act.title}</span>
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        {student?.name ?? "Intern"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Date: {act.activity_date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
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
                      className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                    >
                      <Check className="mr-1 size-3.5" /> Quick Approve
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      <Link to="/review">Review Details →</Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
