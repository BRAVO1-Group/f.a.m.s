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
import { AuditTrailPanel } from "@/components/dashboard/audit-trail-panel";
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
// 4. UNIVERSITY & SYSTEM ADMIN DASHBOARD (Faculty Dean / Coordinator)
// ─────────────────────────────────────────────────────────────────────────────
export function UniversityAdminDashboard({
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
      toast.warning("Empty Form Warning", {
        description: "Please fill in the Field Mentor's Full Name, Official Email, and Job Title.",
      });
      return;
    }

    addSupervisor({
      full_name: supFormName.trim(),
      email: supFormEmail.trim(),
      phone: supFormPhone.trim() || "+254 700 000 000",
      type: "organization",
      title: supFormTitle.trim(),
      organization_name: supFormOrgOrUni,
      faculty_department: supFormDept.trim() || "Engineering",
    });

    setSupervisorsList(getStoredSupervisors());
    setCreateSupervisorOpen(false);

    toast.success("Field Mentor Account Created!", {
      description: `${supFormName} is now provisioned as a Field Mentor for ${supFormOrgOrUni}.`,
    });

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
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── Clean Dean Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
            {greeting}, {name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            University of Nairobi · School of Computing &amp; Informatics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setCreateSupervisorOpen(true)}
            size="sm"
            className="rounded-xl font-semibold text-xs h-9"
          >
            Create Field Mentor
          </Button>
          <Button
            onClick={() => handleOpenAssignModal("student-4")}
            size="sm"
            variant="outline"
            className="rounded-xl font-semibold text-xs h-9"
          >
            Assign Mentors
          </Button>
        </div>
      </div>

      {/* ── Institutional Metrics KPI Cards ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Enrolled Cohort"
          value={universityCohort.length}
          meta="Active candidates"
        />
        <KpiCard
          label="Supervisor Roster"
          value={supervisorsList.length}
          meta={`${orgSupervisors.length} host · ${uniSupervisors.length} faculty`}
        />
        <KpiCard
          label="Dual-Supervision"
          value={`${Math.round((dualAssignedCount / universityCohort.length) * 100)}%`}
          meta={`${dualAssignedCount} of ${universityCohort.length} paired`}
        />
        <KpiCard
          label="RBAC Tier"
          value="Tier 4"
          meta="Governance active"
        />
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
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
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
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Missing Academic
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {student.daysLogged} / {student.targetDays}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isDualAssigned ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {isDualAssigned ? "Dual-Supervised" : "Needs Allocation"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenAssignModal(student.studentId)}
                            className="text-xs h-7.5"
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
                  Field Mentor Accounts (Student Host Organizations)
                </CardTitle>
                <CardDescription>
                  Academic Supervisors provision Field Mentor accounts strictly for the host organizations where students are placed (peer Academic Supervisor accounts are not created here)
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setCreateSupervisorOpen(true)}
                className="text-xs h-8.5 shrink-0"
              >
                <Plus className="mr-1.5 size-3.5" />
                Create Field Mentor Account
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
                      className="border-border/60 shadow-none transition-colors flex flex-col justify-between"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-9 rounded-lg">
                              <AvatarFallback className="rounded-lg bg-muted text-foreground text-xs font-semibold">
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

                          <Badge variant="secondary" className="text-[10px] font-medium shrink-0">
                            {isOrg ? "Host Org" : "University"}
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
                            <Mail className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{sup.email}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Phone className="size-3 text-muted-foreground shrink-0" />
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
                      <TableHead>Assigned Field Mentor</TableHead>
                      <TableHead>Assigned Faculty Assessor</TableHead>
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
                              <span className="font-medium text-foreground">
                                {orgSup.full_name}
                              </span>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {academicSup ? (
                              <span className="font-medium text-foreground">
                                {academicSup.full_name}
                              </span>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isComplete ? "secondary" : "outline"}
                              className="text-xs"
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
                              <span className="font-mono text-xs font-semibold text-foreground">
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
          MODAL: CREATE FIELD MENTOR ACCOUNT (FOR STUDENT'S HOST ORGANIZATION ONLY)
      ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={createSupervisorOpen} onOpenChange={setCreateSupervisorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Create Field Mentor Account
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Academic Supervisors do not create accounts for peer Academic Supervisors. Provision a Field Mentor account strictly for the host organization where a student is placed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSupervisor} className="space-y-4 py-2">
            {/* Select Student to Auto-Bind Their Host Organization */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Placed Student Intern *</Label>
              <Select
                value={assignStudentId}
                onValueChange={(val) => {
                  setAssignStudentId(val);
                  const st = universityCohort.find((c) => c.studentId === val);
                  if (st) {
                    setSupFormOrgOrUni(st.company);
                  }
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select placed student" />
                </SelectTrigger>
                <SelectContent>
                  {universityCohort.map((s) => (
                    <SelectItem key={s.studentId} value={s.studentId}>
                      {s.name} ({s.regNo}) · {s.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Student&apos;s Host Organization *</Label>
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

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Host Department *</Label>
                <Input
                  placeholder="e.g. Product Engineering"
                  value={supFormDept}
                  onChange={(e) => setSupFormDept(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Field Mentor Full Name *</Label>
              <Input
                placeholder="e.g. Eng. Kevin Otieno"
                value={supFormName}
                onChange={(e) => setSupFormName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Field Mentor Official Email *</Label>
                <Input
                  type="email"
                  placeholder="mentor@company.com"
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
              <Label className="text-xs font-semibold">Workplace Designation / Title *</Label>
              <Input
                placeholder="e.g. Lead Software Architect & Field Mentor"
                value={supFormTitle}
                onChange={(e) => setSupFormTitle(e.target.value)}
                required
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
                Create Field Mentor Account
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
                  className="text-[9px] border-warning/40 text-warning bg-warning/10"
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
                  className="text-[9px] border-info/40 text-info-foreground bg-info/10"
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

      {/* ── Live Institutional Audit Trail ── */}
      <AuditTrailPanel role={(role as AppRole) || "uni_admin"} />
    </div>
  );
}
