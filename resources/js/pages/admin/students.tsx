import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppUser } from "@/lib/app-user";
import {
  getStoredSupervisors,
  getStoredInternships,
  type MockSupervisor,
  type MockInternship,
} from "@/lib/mock-data";

export default function StudentsPage() {
  const { userId, role } = useAppUser();
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [internshipsList, setInternshipsList] = useState<MockInternship[]>(getStoredInternships);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = () => {
      setSupervisorsList(getStoredSupervisors());
      setInternshipsList(getStoredInternships());
    };
    window.addEventListener("internflow-data-change", handler);
    return () => window.removeEventListener("internflow-data-change", handler);
  }, []);

  const universityCohort = [
    {
      studentId: "student-1",
      regNo: "CS/2021/0042",
      name: "Alice Wanjiku",
      course: "BSc. Computer Science",
      institution: "University of Nairobi",
      email: "alice@university.ac.ke",
      phone: "+254 712 345 678",
      company: "TechCorp Kenya Ltd",
      department: "Product Engineering",
      daysLogged: 42,
      targetDays: 60,
      phase: "Phase 2: Core Frontend Modules",
      status: "On Track",
    },
    {
      studentId: "student-2",
      regNo: "CS/2021/0088",
      name: "Brian Mwangi",
      course: "BSc. Telecommunications & Networking",
      institution: "Kenyatta University",
      email: "brian@university.ac.ke",
      phone: "+254 722 998 877",
      company: "Safaricom PLC",
      department: "Infrastructure & Cloud",
      daysLogged: 39,
      targetDays: 60,
      phase: "Phase 2: Network Topologies",
      status: "On Track",
    },
    {
      studentId: "student-3",
      regNo: "CS/2021/0015",
      name: "Carol Achieng",
      course: "BSc. Data Science & Analytics",
      institution: "Strathmore University",
      email: "carol@strathmore.edu",
      phone: "+254 733 112 233",
      company: "Kenya Commercial Bank",
      department: "Business Intelligence",
      daysLogged: 60,
      targetDays: 60,
      phase: "Phase 4: Capstone Defense",
      status: "Clearance Granted",
    },
    {
      studentId: "student-4",
      regNo: "CS/2021/0104",
      name: "Kevin Kiprono",
      course: "BSc. Computer Science (Cybersecurity)",
      institution: "University of Nairobi",
      email: "kevin.kiprono@university.ac.ke",
      phone: "+254 701 445 566",
      company: "TechCorp Kenya Ltd",
      department: "InfoSec Operations",
      daysLogged: 18,
      targetDays: 60,
      phase: "Phase 1: Toolchain Onboarding",
      status: "At Risk (Low Activity)",
    },
  ];

  const isSupervisor = role === "supervisor";
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];

  const assignedStudentIds =
    currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
      ? currentSupervisor.assigned_student_ids
      : ["student-1", "student-4"];

  const scopedCohort = isSupervisor
    ? universityCohort.filter((s) => assignedStudentIds.includes(s.studentId))
    : universityCohort;

  const filtered = scopedCohort.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.regNo.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const avgDaysLogged =
    scopedCohort.length > 0
      ? (
          scopedCohort.reduce((acc, curr) => acc + curr.daysLogged, 0) / scopedCohort.length
        ).toFixed(1)
      : "0";
  const avgPct =
    scopedCohort.length > 0
      ? Math.round(
          scopedCohort.reduce((acc, curr) => acc + (curr.daysLogged / curr.targetDays) * 100, 0) /
            scopedCohort.length,
        )
      : 0;

  return (
    <div className="space-y-6 antialiased">
      {/* ── Corporate Host Org Banner ── */}
      {isSupervisor && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">
                  My Assigned Mentee Cohort
                </span>
                <Badge
                  variant="outline"
                  className="text-[11px] font-medium border-primary/30 text-primary"
                >
                  🏢 {currentSupervisor?.organization_name ?? "TechCorp Kenya Ltd"}
                </Badge>
                <Badge variant="secondary" className="text-[11px] font-medium">
                  Received Enterprise Logins
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Showing candidates directly assigned to your workplace supervision. Supervisors
                access via corporate provisioned logins and cannot self-register.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="size-3.5" /> {scopedCohort.length} Active Mentees
            </span>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-white/30 bg-white/10 text-white text-xs font-semibold"
            >
              Candidate Roster
            </Badge>
            <span className="text-xs text-primary-foreground/75">
              Internship Progress & Supervision
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
            Assigned Student Interns
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80 max-w-2xl">
            Monitor daily activities, track required workplace attendance days, review milestone
            competencies, and conduct supervisory assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm h-9"
          >
            <Link to="/review">
              <BookOpen className="mr-1.5 size-4" />
              Review Submissions Queue
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned Candidates
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {scopedCohort.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Under active supervision</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Completion
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">{avgPct}%</p>
            <p className="mt-2 text-xs text-success font-medium">
              {avgDaysLogged} of 60 days logged avg
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Reviews
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">2</p>
            <p className="mt-2 text-xs text-muted-foreground">Submitted logs awaiting feedback</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Clearance Ready
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <ShieldCheck className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {scopedCohort.filter((s) => s.daysLogged >= 60).length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Completed 60/60 days</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Interns Table ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search intern name, reg number, or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Details</TableHead>
                <TableHead>Placement & Company</TableHead>
                <TableHead>Supervisors Allocation</TableHead>
                <TableHead>Days Completed</TableHead>
                <TableHead>Active Milestone Phase</TableHead>
                <TableHead>Compliance Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => {
                const intern = internshipsList.find((i) => i.student_id === student.studentId);
                const orgSup = supervisorsList.find((s) => s.id === intern?.supervisor_id);
                const academicSup = supervisorsList.find(
                  (s) => s.id === intern?.academic_supervisor_id,
                );
                const pct = Math.min(
                  100,
                  Math.round((student.daysLogged / student.targetDays) * 100),
                );

                return (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8.5">
                          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {student.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{student.name}</p>
                          <p className="text-[11px] font-mono text-muted-foreground">
                            {student.regNo}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{student.company}</p>
                      <p className="text-[11px]">{student.department}</p>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          <span className="text-[11px]">
                            Mentor: {orgSup?.full_name ?? "Assigned"}
                          </span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="size-1.5 rounded-full bg-indigo-500" />
                          <span className="text-[11px]">
                            Faculty: {academicSup?.full_name ?? "Pending Assessor"}
                          </span>
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="w-36">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                          <span>
                            {student.daysLogged}/{student.targetDays} days
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{student.phase}</span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          student.status.includes("Risk")
                            ? "destructive"
                            : student.status.includes("Clearance")
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {student.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-primary"
                        >
                          <Link to="/review" search={{ student: student.studentId }}>
                            Logs →
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                          <Link to="/evaluations">Grade</Link>
                        </Button>
                      </div>
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
