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
// 2. WORKPLACE SUPERVISOR DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function SupervisorDashboard({ userId, name }: { userId: string; name: string }) {
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("submitted");
  const [reviewModalActivity, setReviewModalActivity] = useState<MockActivity | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");

  const greeting = getGreeting();
  const supervisorsList = getStoredSupervisors();
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];
  const isOrgSupervisor = currentSupervisor?.type === "organization";

  // Host org supervisor assigned student IDs (James Otieno supervises Alice Wanjiku & Kevin Kiprono at TechCorp)
  const assignedStudentIds: string[] =
    currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
      ? currentSupervisor.assigned_student_ids
      : ["student-1", "student-4"];

  useEffect(() => {
    const handler = () => {
      setActivitiesList(getStoredActivities());
    };
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  // Assigned student profiles details
  const assignedStudentsDetails = [
    {
      id: "student-1",
      name: "Alice Wanjiku",
      regNo: "CS/2021/0042",
      role: "Software Engineering Intern",
      department: "Product Engineering",
      company: "TechCorp Kenya Ltd",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science",
      email: "alice@university.ac.ke",
      phone: "+254 712 345 678",
      academicSupervisor: "Dr. Agnes Kimani (agnes.kimani@uonbi.ac.ke)",
      daysLogged: 42,
      requiredDays: 60,
      attendanceRate: "97.5%",
      currentPhase: "Phase 2: Core Engineering & Testing",
      status: "Active • On Track",
      avatarFallback: "AW",
    },
    {
      id: "student-4",
      name: "Kevin Kiprono",
      regNo: "CS/2021/0104",
      role: "Cybersecurity Analyst Intern",
      department: "InfoSec Operations",
      company: "TechCorp Kenya Ltd",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science (Cybersecurity)",
      email: "kevin.kiprono@university.ac.ke",
      phone: "+254 701 445 566",
      academicSupervisor: "Dr. Agnes Kimani (agnes.kimani@uonbi.ac.ke)",
      daysLogged: 18,
      requiredDays: 60,
      attendanceRate: "95.0%",
      currentPhase: "Phase 1: SIEM & Vulnerability Assessment",
      status: "Active • In Progress",
      avatarFallback: "KK",
    },
  ].filter((s) => assignedStudentIds.includes(s.id));

  // Scoped strictly to submissions from assigned students
  const myAssignedActivities = activitiesList.filter((a) =>
    assignedStudentIds.includes(a.student_id),
  );

  const pendingActivities = myAssignedActivities.filter((a) => a.status === "submitted");
  const approvedActivities = myAssignedActivities.filter((a) => a.status === "approved");
  const correctionActivities = myAssignedActivities.filter((a) => a.status === "needs_correction");

  // Activities filtered by student select and status tab
  const displayedActivities = myAssignedActivities.filter((a) => {
    if (selectedStudentFilter !== "all" && a.student_id !== selectedStudentFilter) {
      return false;
    }
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const handleQuickApprove = (act: MockActivity) => {
    const studentObj = assignedStudentsDetails.find((s) => s.id === act.student_id);
    approveOrCorrectActivity(
      act.id,
      "approved",
      userId,
      "Verified and approved by Host Organization Mentor (TechCorp Kenya Ltd).",
    );
    setActivitiesList(getStoredActivities());
    toast.success("Submission Approved", {
      description: `"${act.title}" for ${studentObj?.name ?? "Intern"} has been verified and signed off.`,
    });
  };

  const handleReviewAction = (action: "approved" | "needs_correction") => {
    if (!reviewModalActivity) return;
    const studentObj = assignedStudentsDetails.find((s) => s.id === reviewModalActivity.student_id);
    const defaultFeedback =
      action === "approved"
        ? "Work meets organizational engineering standards. Great implementation and documentation."
        : "Please revise this activity log with additional details on your testing procedures and root cause analysis.";

    approveOrCorrectActivity(
      reviewModalActivity.id,
      action,
      userId,
      reviewFeedback.trim() || defaultFeedback,
    );
    setActivitiesList(getStoredActivities());
    toast.success(action === "approved" ? "Submission Approved" : "Correction Requested", {
      description:
        action === "approved"
          ? `Approved "${reviewModalActivity.title}" for ${studentObj?.name ?? "Intern"}.`
          : `Requested revision from ${studentObj?.name ?? "Intern"} on "${reviewModalActivity.title}".`,
    });
    setReviewModalActivity(null);
    setReviewFeedback("");
  };

  const getStudentName = (studentId: string) => {
    const found = assignedStudentsDetails.find((s) => s.id === studentId);
    return found ? found.name : "Assigned Intern";
  };

  return (
    <div className="space-y-6 antialiased">
      {/* ── Corporate Received Logins Security Notice ── */}
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <Lock className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">
                Corporate Host Organization Account
              </span>
              <Badge
                variant="outline"
                className="text-[11px] font-medium border-primary/30 text-primary"
              >
                🏢 Received Enterprise Logins Only
              </Badge>
              <Badge variant="secondary" className="text-[11px] font-medium">
                Tier 2 • Host Org Supervisor
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Authenticated as <strong>{name}</strong> via pre-provisioned credentials issued by{" "}
              <strong>{currentSupervisor?.organization_name ?? "TechCorp Kenya Ltd"}</strong>.
              Supervisors cannot self-register; candidate access is scoped strictly to your assigned
              interns.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="size-3.5" /> Direct Approval Authority
          </span>
        </div>
      </div>

      {/* ── Supervisor Header ── */}
      <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-white/30 bg-white/10 text-white text-xs font-semibold"
              >
                🏢 Host Organization Field Mentor
              </Badge>
              <span className="text-xs text-primary-foreground/75">
                {currentSupervisor?.organization_name ?? "TechCorp Kenya Ltd"} •{" "}
                {currentSupervisor?.faculty_department ?? "Product Engineering"}
              </span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
              {greeting}, {name}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Supervising {assignedStudentsDetails.length} assigned interns. Review engineering
              logs, verify task deliverables, and sign off submissions.
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
              <Link to="/students">
                <Users className="mr-1.5 size-4" />
                Assigned Interns ({assignedStudentsDetails.length})
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Supervisor KPI Cards (Scoped to Assigned Students) ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Interns
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {assignedStudentsDetails.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Alice Wanjiku & Kevin Kiprono</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Approval
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-warning/15 text-warning-foreground">
                <Clock className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {pendingActivities.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Submissions awaiting your sign-off</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Approved Deliverables
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {approvedActivities.length}
            </p>
            <p className="mt-2 text-xs text-success flex items-center gap-1 font-medium">
              <TrendingUp className="size-3" /> Signed off by Host Org Mentor
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Revisions Requested
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RotateCcw className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {correctionActivities.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Logs flagged for mentee correction</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Assigned Student Details (Candidate Profile & Placement Cards) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" />
              My Assigned Student Interns
            </h2>
            <p className="text-xs text-muted-foreground">
              Comprehensive candidate profiles, placement tracks at TechCorp Kenya Ltd, and
              attachment meters
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link to="/students">View Full Cohort Roster</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {assignedStudentsDetails.map((student) => {
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
                          {student.avatarFallback}
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
                  {/* Placement & Academic info */}
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
                        Academic Assessor
                      </span>
                      <span className="font-semibold text-foreground">Dr. Agnes Kimani</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {student.institution}
                      </span>
                    </div>
                  </div>

                  {/* Progress Meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Attachment Attendance Pace</span>
                      <span className="font-mono font-semibold text-foreground">
                        {student.daysLogged} / {student.requiredDays} Days ({progressPct}%)
                      </span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Attendance: {student.attendanceRate}</span>
                      <span>{student.currentPhase}</span>
                    </div>
                  </div>

                  {/* Contacts & Direct Filter Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-border/60">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3 text-muted-foreground" />
                        {student.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3 text-muted-foreground" />
                        {student.phone}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStudentFilter(student.id);
                        toast.info(`Filtered submissions for ${student.name}`);
                      }}
                      className="text-xs text-primary font-semibold h-7 px-2 hover:bg-primary/10"
                    >
                      Filter Submissions →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Submissions Made by Assigned Interns (Interactive Approval & Feedback System) ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileCheck className="size-5 text-primary" />
                Submissions Made by Assigned Interns
              </CardTitle>
              <CardDescription>
                Review daily technical reports, sign off completed work, or request revisions with
                mentor guidance
              </CardDescription>
            </div>
            {/* Mentee filter selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Filter Mentee:</span>
              <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
                <SelectTrigger className="w-[220px] text-xs h-9">
                  <SelectValue placeholder="All Mentees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assigned Mentees (Alice & Kevin)</SelectItem>
                  <SelectItem value="student-1">Alice Wanjiku (Software Eng.)</SelectItem>
                  <SelectItem value="student-4">Kevin Kiprono (Cybersecurity)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md h-9 text-xs">
              <TabsTrigger value="submitted" className="text-xs flex items-center gap-1.5">
                Pending
                {pendingActivities.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] bg-primary/20 text-primary font-bold"
                  >
                    {pendingActivities.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs flex items-center gap-1.5">
                Approved
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                  {approvedActivities.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="needs_correction" className="text-xs flex items-center gap-1.5">
                Corrections
                {correctionActivities.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                  >
                    {correctionActivities.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All ({myAssignedActivities.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-3">
          {displayedActivities.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-xl border-border/80">
              <CheckCircle2 className="mx-auto size-9 text-muted-foreground/60 mb-2" />
              <p className="font-semibold text-foreground">No submissions in this view</p>
              <p className="text-xs mt-1">
                {activeTab === "submitted"
                  ? "All activities submitted by your assigned mentees have been reviewed and approved."
                  : "Change the status tab or student filter to inspect other logbook entries."}
              </p>
              {selectedStudentFilter !== "all" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedStudentFilter("all")}
                  className="mt-3 text-xs"
                >
                  Clear Mentee Filter
                </Button>
              )}
            </div>
          ) : (
            displayedActivities.map((act) => {
              const studentName = getStudentName(act.student_id);
              return (
                <div
                  key={act.id}
                  className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{act.title}</span>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium border-primary/30 text-primary"
                        >
                          {studentName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Logged: {act.activity_date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant={
                          act.status === "approved"
                            ? "default"
                            : act.status === "needs_correction"
                              ? "destructive"
                              : "secondary"
                        }
                        className={`text-xs capitalize ${
                          act.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : act.status === "needs_correction"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                              : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {act.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Tools and Details */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground mr-1">
                      Tools & Frameworks:
                    </span>
                    {act.tools_used.map((tool) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="text-[11px] font-normal py-0"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>

                  {/* Challenges & Solutions */}
                  {act.challenges && (
                    <div className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1">
                      <div className="text-muted-foreground">
                        <span className="font-medium text-foreground">Challenge Encountered: </span>
                        {act.challenges}
                      </div>
                      {act.solutions && (
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">Solution Applied: </span>
                          {act.solutions}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Supervisor Feedback Note if already approved or corrections requested */}
                  {act.supervisor_feedback && (
                    <div
                      className={`rounded-lg p-2.5 text-xs border ${
                        act.status === "approved"
                          ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200"
                          : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                      }`}
                    >
                      <span className="font-semibold block mb-0.5">
                        {act.status === "approved"
                          ? "✓ Host Org Mentor Feedback:"
                          : "⚠ Revision Feedback to Intern:"}
                      </span>
                      <p className="leading-relaxed">{act.supervisor_feedback}</p>
                      {act.reviewed_at && (
                        <span className="text-[10px] opacity-75 block mt-1">
                          Reviewed: {new Date(act.reviewed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Controls for Supervisor */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReviewModalActivity(act);
                        setReviewFeedback(act.supervisor_feedback || "");
                      }}
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      <MessageSquareCheck className="mr-1.5 size-3.5" />
                      {act.status === "submitted" ? "Review & Feedback" : "Update Feedback"}
                    </Button>

                    {act.status === "submitted" && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickApprove(act)}
                        className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
                      >
                        <Check className="mr-1 size-3.5" />
                        Quick Approve
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* ── Modal Dialog for Detailed Review & Approval/Correction ── */}
      <Dialog
        open={!!reviewModalActivity}
        onOpenChange={(open) => !open && setReviewModalActivity(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Review Intern Logbook Submission
            </DialogTitle>
            <DialogDescription className="text-xs">
              {reviewModalActivity && (
                <>
                  {reviewModalActivity.title} — submitted by{" "}
                  <strong>{getStudentName(reviewModalActivity.student_id)}</strong> on{" "}
                  {reviewModalActivity.activity_date}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {reviewModalActivity && (
            <div className="space-y-3.5 py-2 text-xs">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Task & Technical Description
                </Label>
                <div className="mt-1 rounded-md bg-muted/40 p-2.5 text-muted-foreground leading-relaxed max-h-32 overflow-y-auto">
                  {reviewModalActivity.description}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {reviewModalActivity.tools_used.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>

              {reviewModalActivity.challenges && (
                <div>
                  <Label className="text-xs font-semibold text-foreground">
                    Challenges & Solutions
                  </Label>
                  <p className="mt-1 text-muted-foreground">
                    {reviewModalActivity.challenges}
                    {reviewModalActivity.solutions ? ` — ${reviewModalActivity.solutions}` : ""}
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="mentor-note" className="text-xs font-semibold text-foreground">
                  Mentor Feedback Note & Guidance
                </Label>
                <Textarea
                  id="mentor-note"
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="e.g. Excellent work on the API endpoints and test coverage. Keep up the high standards..."
                  className="text-xs resize-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  This guidance note is saved to the candidate's permanent logbook and visible to
                  their University Academic Supervisor.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleReviewAction("needs_correction")}
              className="text-xs font-semibold border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <RotateCcw className="mr-1.5 size-3.5" />
              Request Revisions
            </Button>
            <Button
              type="button"
              onClick={() => handleReviewAction("approved")}
              className="text-xs font-semibold bg-primary text-primary-foreground"
            >
              <Check className="mr-1.5 size-3.5" />
              Sign Off & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
