import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  GraduationCap,
  Plus,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getStoredSupervisors,
  getStoredInternships,
  assignSupervisors,
  type MockSupervisor,
  type MockInternship,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/assignments")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Supervisor Pairing — InternTrack" },
      {
        name: "description",
        content:
          "Pair students with host organization mentors and university academic supervisors.",
      },
      { property: "og:title", content: "Supervisor Pairing — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AssignmentsPage,
});

export function AssignmentsPage() {
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [internshipsList, setInternshipsList] = useState<MockInternship[]>(getStoredInternships);
  const [assignOpen, setAssignOpen] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState("student-4");
  const [orgSupervisorId, setOrgSupervisorId] = useState("");
  const [academicSupervisorId, setAcademicSupervisorId] = useState("");

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
      company: "TechCorp Kenya Ltd",
      department: "Product Engineering",
    },
    {
      studentId: "student-2",
      regNo: "CS/2021/0088",
      name: "Brian Mwangi",
      course: "BSc. Telecommunications & Networking",
      company: "Safaricom PLC",
      department: "Infrastructure & Cloud",
    },
    {
      studentId: "student-3",
      regNo: "CS/2021/0015",
      name: "Carol Achieng",
      course: "BSc. Data Science & Analytics",
      company: "Kenya Commercial Bank",
      department: "Business Intelligence",
    },
    {
      studentId: "student-4",
      regNo: "CS/2021/0104",
      name: "Kevin Kiprono",
      course: "BSc. Computer Science (Cybersecurity)",
      company: "TechCorp Kenya Ltd",
      department: "InfoSec Operations",
    },
  ];

  const orgSupervisors = supervisorsList.filter((s) => s.type === "organization");
  const uniSupervisors = supervisorsList.filter((s) => s.type === "university");

  const openAssignModal = (id: string) => {
    const intern = internshipsList.find((i) => i.student_id === id);
    setStudentId(id);
    setOrgSupervisorId(intern?.supervisor_id ?? "");
    setAcademicSupervisorId(intern?.academic_supervisor_id ?? "");
    setAssignOpen(true);
  };

  const handleSave = () => {
    if (!studentId) {
      toast.error("Please select a student");
      return;
    }
    assignSupervisors(studentId, orgSupervisorId, academicSupervisorId);
    setSupervisorsList(getStoredSupervisors());
    setInternshipsList(getStoredInternships());
    setAssignOpen(false);

    const student = universityCohort.find((s) => s.studentId === studentId);
    toast.success("Supervisor pairing updated!", {
      description: `Dual-supervision allocated for ${student?.name ?? "student"}.`,
    });
  };

  // Metrics
  const dualAssignedCount = universityCohort.filter((student) => {
    const intern = internshipsList.find((i) => i.student_id === student.studentId);
    return intern?.supervisor_id && intern?.academic_supervisor_id;
  }).length;

  const missingAcademicCount = universityCohort.filter((student) => {
    const intern = internshipsList.find((i) => i.student_id === student.studentId);
    return !intern?.academic_supervisor_id;
  }).length;

  return (
    <div className="space-y-6 antialiased">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-gradient-hero p-6 sm:p-8 text-primary-foreground shadow-elevated">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-white/30 bg-white/10 text-white text-xs font-semibold"
            >
              Mentorship Governance
            </Badge>
            <span className="text-xs text-primary-foreground/75">
              Dual-Track Attachment Oversight
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl tracking-tight">
            Dual-Supervisor Pairing Console
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80 max-w-2xl">
            Pair each candidate with an on-site Host Organization Mentor and a University Academic
            Assessor for accreditation compliance.
          </p>
        </div>

        <Button
          onClick={() => openAssignModal("student-4")}
          className="rounded-xl bg-white text-primary hover:bg-white/90 font-semibold text-xs shadow-sm h-9 shrink-0"
        >
          <UserCheck className="mr-1.5 size-4" />
          Assign Supervisor Pair
        </Button>
      </div>

      {/* ── Allocation Alert if Any Missing ── */}
      {missingAcademicCount > 0 && (
        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/10 text-destructive-foreground rounded-xl"
        >
          <ShieldAlert className="size-4" />
          <AlertTitle className="font-semibold text-sm">
            Pending Faculty Assessor Allocation
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              {missingAcademicCount} candidate(s) require an assigned University Academic Supervisor
              before institutional defense clearance can be scheduled.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openAssignModal("student-4")}
              className="h-7 text-xs border-destructive/30 text-destructive-foreground shrink-0"
            >
              Pair Kevin Kiprono Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Summary Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Placed Candidates
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {universityCohort.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Enrolled attachment cohort</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dual-Supervised Rate
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
                <CheckCircle2 className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {Math.round((dualAssignedCount / universityCohort.length) * 100)}%
            </p>
            <p className="mt-2 text-xs text-success font-medium">
              {dualAssignedCount} of {universityCohort.length} fully paired
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Missing Academic Assessor
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <AlertTriangle className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {missingAcademicCount}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Requires faculty allocation</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Available Supervisors
              </span>
              <span className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Users className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">
              {supervisorsList.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {orgSupervisors.length} Org • {uniSupervisors.length} Faculty
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Candidate Pairing Table ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Candidate Supervisor Allocation Matrix
            </CardTitle>
            <CardDescription>
              Assign and update both host organization mentor and university faculty assessor
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Host Organization</TableHead>
                <TableHead>🏢 Host Org Mentor</TableHead>
                <TableHead>🏛️ University Assessor</TableHead>
                <TableHead>Supervision Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universityCohort.map((student) => {
                const intern = internshipsList.find((i) => i.student_id === student.studentId);
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
                          {student.regNo} • {student.course.split(" ")[1]}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">{student.company}</p>
                      <p className="text-[11px]">{student.department}</p>
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
                          className="text-[10px] text-amber-700 border-amber-300"
                        >
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {academicSup ? (
                        <div>
                          <p className="font-medium text-foreground">{academicSup.full_name}</p>
                          <p className="text-[11px] text-muted-foreground">{academicSup.title}</p>
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
                        {isComplete ? "Dual-Supervised" : "Needs Allocation"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAssignModal(student.studentId)}
                        className="text-xs h-7.5"
                      >
                        Pair Mentors →
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Assign Supervisors Modal ── */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Assign Dual Supervisors
            </DialogTitle>
            <DialogDescription>
              Pair the candidate with a Host Organization Mentor and a University Academic
              Supervisor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Student Candidate *</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose candidate" />
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

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Host Organization Mentor (Field)</Label>
                <Badge
                  variant="outline"
                  className="text-[9px] border-amber-300 text-amber-700 bg-amber-50"
                >
                  Host Company
                </Badge>
              </div>
              <Select value={orgSupervisorId} onValueChange={setOrgSupervisorId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Host Org Mentor" />
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

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">
                  University Academic Supervisor (Faculty)
                </Label>
                <Badge
                  variant="outline"
                  className="text-[9px] border-indigo-300 text-indigo-700 bg-indigo-50"
                >
                  University
                </Badge>
              </div>
              <Select value={academicSupervisorId} onValueChange={setAcademicSupervisorId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select University Supervisor" />
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

            <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Accreditation Mandate:</p>
              <p className="text-[11px]">
                Both mentors will receive logbook review notifications and submit separate
                evaluations prior to degree audit.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAssignOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Supervisor Pair
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
