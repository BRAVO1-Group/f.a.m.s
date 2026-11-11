import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  GraduationCap,
  KeyRound,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
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

export default function AssignmentsPage() {
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [internshipsList, setInternshipsList] = useState<MockInternship[]>(getStoredInternships);
  const [assignOpen, setAssignOpen] = useState(false);
  const [credentialModalStudent, setCredentialModalStudent] = useState<{
    student: {
      studentId: string;
      regNo: string;
      name: string;
      course: string;
      company: string;
      department: string;
    };
    orgSup?: MockSupervisor | undefined;
    academicSup?: MockSupervisor | undefined;
  } | null>(null);

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
    toast.success("Organization & Field Supervisor Assigned!", {
      description: `Dual-supervision and pre-provisioned university login bound to ${student?.name ?? "student"}.`,
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
      {/* ── Organization Assignment as Field Supervision Explainer Banner ── */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">
                Organization Assignment as Field Supervision
              </span>
              <Badge
                variant="outline"
                className="text-[11px] font-medium border-primary/30 text-primary"
              >
                Pre-Provisioned University Credentials
              </Badge>
              <Badge variant="secondary" className="text-[11px] font-medium">
                Student-Bound Logins
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              In this system, assigning a student to a host organization is fundamentally{" "}
              <strong>assigning the company's designated Field Supervisor</strong>. The University
              Administrator provisions corporate credentials dispatched directly to the employer
              mentor, strictly tying their login access to that student's logbook.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="size-3.5" /> Direct University Dispatch
          </span>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold sm:text-3xl tracking-tight text-foreground">
              Supervisor &amp; Organization Pairing
            </h1>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary bg-primary/5 font-semibold"
            >
              Dual Mentorship
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pair students with host organization field supervisors and faculty mentors. Field
            supervisors receive pre-provisioned university logins.
          </p>
        </div>

        <Button
          onClick={() => openAssignModal("student-4")}
          size="sm"
          className="rounded-xl font-semibold text-xs h-9 shrink-0 shadow-xs"
        >
          <Plus className="mr-1.5 size-4" />
          Assign Student Pair
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
              Assigning a host organization pairs the company's designated Field Supervisor and
              issues a pre-provisioned university login tied to that candidate
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Host Organization</TableHead>
                <TableHead>🏢 Field Supervisor & University-Issued Login</TableHead>
                <TableHead>🏛️ University Assessor</TableHead>
                <TableHead>Supervision Status</TableHead>
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
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{orgSup.full_name}</p>
                          <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[200px]">
                            {orgSup.email}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            <Lock className="size-2.5" /> Bound to {student.name.split(" ")[0]}
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
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setCredentialModalStudent({ student, orgSup, academicSup })
                          }
                          className="text-xs h-7.5 text-primary hover:bg-primary/10"
                        >
                          <KeyRound className="mr-1 size-3" /> Credentials
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAssignModal(student.studentId)}
                          className="text-xs h-7.5"
                        >
                          Pair Mentors →
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

      {/* ── Assign Supervisors Modal ── */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              Assign Organization & Dual Supervisors
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Assigning a host organization pairs the company's designated Field Supervisor and
              issues a pre-provisioned university login tied strictly to this student.
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
                <Label className="text-xs font-semibold">
                  Host Organization & Field Supervisor *
                </Label>
                <Badge
                  variant="outline"
                  className="text-[9px] border-amber-300 text-amber-700 bg-amber-50"
                >
                  🏢 University Login Issued
                </Badge>
              </div>
              <Select value={orgSupervisorId} onValueChange={setOrgSupervisorId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Host Organization & Field Supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {orgSupervisors.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id}>
                      {sup.organization_name} • {sup.full_name} ({sup.title})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground pt-0.5">
                Assigning this organization pairs the company's designated Field Supervisor and
                issues a login tied to this intern.
              </p>
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
                  🏛️ University
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

      {/* ── View Dispatched University Credentials Modal ── */}
      <Dialog
        open={!!credentialModalStudent}
        onOpenChange={(open: string) => !open && setCredentialModalStudent(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              University-Dispatched Field Supervisor Login
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              Pre-provisioned corporate credentials generated by the University Administrator and
              tied strictly to this student's placement.
            </DialogDescription>
          </DialogHeader>

          {credentialModalStudent && (
            <div className="space-y-3.5 py-2 text-xs">
              <div className="rounded-lg bg-muted/50 p-3 space-y-1 border border-border/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Assigned Student:</span>
                  <span className="font-bold text-foreground">
                    {credentialModalStudent.student.name} ({credentialModalStudent.student.regNo})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Host Organization:</span>
                  <span className="font-semibold text-foreground">
                    {credentialModalStudent.student.company}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Department:</span>
                  <span>{credentialModalStudent.student.department}</span>
                </div>
              </div>

              <div className="space-y-2 border rounded-lg p-3 bg-card border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground">
                    Field Supervisor Identity
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[10px]"
                  >
                    Active • Pre-Provisioned
                  </Badge>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Supervisor Full Name:
                  </span>
                  <span className="font-semibold text-foreground">
                    {credentialModalStudent.orgSup?.full_name ?? "James Otieno"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Corporate Login Email:
                  </span>
                  <span className="font-mono font-medium text-primary">
                    {credentialModalStudent.orgSup?.email ?? "james.otieno@techcorp.co.ke"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    Initial University Token / Passphrase:
                  </span>
                  <span className="font-mono text-muted-foreground">Attach2026!TechCorp#Kenya</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                <Lock className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Scoping Guarantee:</strong> When this field supervisor logs in,
                  they will only have visibility and approval authority over{" "}
                  <strong>{credentialModalStudent.student.name}</strong>. They cannot self-register
                  or modify general university databases.
                </span>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const text = `InternTrack Field Supervisor Credentials\nOrganization: ${credentialModalStudent.student.company}\nSupervisor: ${credentialModalStudent.orgSup?.full_name ?? "James Otieno"}\nLogin: ${credentialModalStudent.orgSup?.email ?? "james.otieno@techcorp.co.ke"}\nAssigned Student: ${credentialModalStudent.student.name} (${credentialModalStudent.student.regNo})`;
                    navigator.clipboard?.writeText(text);
                    toast.success("Dispatched credentials copied to clipboard!");
                  }}
                  className="w-full text-xs font-semibold"
                >
                  <Copy className="mr-1.5 size-3.5" />
                  Copy Dispatched Credentials
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
