import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  ArrowLeft,
  Award,
  CalendarCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { recordAuditEvent } from "@/components/dashboard/audit-trail-panel";
import { useAppUser } from "@/lib/app-user";
import {
  approveOrCorrectActivity,
  getStoredActivities,
  getStoredEvaluations,
  saveStoredEvaluations,
  type MockActivity,
  type MockEvaluation,
} from "@/lib/mock-data";

type StudentRecord = {
  id: string;
  name: string;
  regNo: string;
  role: string;
  department: string;
  company: string;
  degree: string;
  institution: string;
  email: string;
  phone: string;
  mentor: string;
  academicSupervisor: string;
  daysLogged: number;
  requiredDays: number;
  attendanceRate: string;
  todayCheckIn: string;
  todayCheckOut: string;
  attendanceVerified: boolean;
  conductRating: "Exemplary Conduct" | "Professional & Punctual" | "Satisfactory" | "Needs Guidance";
  conductNotes: string;
  strengths: string[];
  weeklyReviewWeek: number;
  weeklyReviewStatus: "Completed" | "Due Today";
  lastWeeklySummary: string;
};

const STUDENT_DIRECTORY: Record<string, StudentRecord> = {
  "student-1": {
    id: "student-1",
    name: "Alice Wanjiku",
    regNo: "CS/2021/0042",
    role: "Software Engineering Intern",
    department: "Product Engineering",
    company: "TechCorp Solutions Uganda Ltd",
    degree: "BSc. Computer Science",
    institution: "Makerere University",
    email: "alice@university.ac.ug",
    phone: "+256 784 512 900",
    mentor: "Eng. James Otieno",
    academicSupervisor: "Dr. Sarah Namukasa",
    daysLogged: 42,
    requiredDays: 60,
    attendanceRate: "97.5%",
    todayCheckIn: "08:52 AM",
    todayCheckOut: "05:06 PM",
    attendanceVerified: true,
    conductRating: "Exemplary Conduct",
    conductNotes:
      "Disciplined, adheres to organization security policies, collaborates proactively in daily standups.",
    strengths: ["REST API Design", "Query Optimization", "Automated Testing", "Problem Solving"],
    weeklyReviewWeek: 7,
    weeklyReviewStatus: "Completed",
    lastWeeklySummary:
      "Completed authentication service ahead of schedule with clean unit test coverage.",
  },
  "student-4": {
    id: "student-4",
    name: "Kevin Kiprono",
    regNo: "CS/2021/0104",
    role: "Cybersecurity Analyst Intern",
    department: "InfoSec Operations",
    company: "TechCorp Solutions Uganda Ltd",
    degree: "BSc. Computer Science (Cybersecurity)",
    institution: "Makerere University",
    email: "kevin.kiprono@university.ac.ug",
    phone: "+256 701 445 566",
    mentor: "Eng. James Otieno",
    academicSupervisor: "Dr. Sarah Namukasa",
    daysLogged: 18,
    requiredDays: 60,
    attendanceRate: "95.0%",
    todayCheckIn: "09:01 AM",
    todayCheckOut: "05:00 PM",
    attendanceVerified: false,
    conductRating: "Professional & Punctual",
    conductNotes:
      "Follows SOC escalation protocols carefully, respectful with senior engineers, keen attention to detail.",
    strengths: ["SIEM Log Triage", "Vulnerability Scanning", "Incident Documentation"],
    weeklyReviewWeek: 3,
    weeklyReviewStatus: "Due Today",
    lastWeeklySummary:
      "Assisted with firewall rule audit and documented 14 endpoint compliance checks.",
  },
};

export default function StudentDetailPage() {
  const { userId, name: currentUserName } = useAppUser();
  const { props } = usePage<{ studentId?: string }>();
  const studentKey =
    props.studentId && STUDENT_DIRECTORY[props.studentId] ? props.studentId : "student-1";

  const [student, setStudent] = useState<StudentRecord>(STUDENT_DIRECTORY[studentKey]!);
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [evalList, setEvalList] = useState<MockEvaluation[]>(getStoredEvaluations);
  const [newStrength, setNewStrength] = useState("");
  const [logComments, setLogComments] = useState<Record<string, string>>({});

  // Confirm Dialogs
  const [confirmVerifyShift, setConfirmVerifyShift] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<{
    act: MockActivity;
    status: "approved" | "needs_correction";
  } | null>(null);
  const [confirmGradeOpen, setConfirmGradeOpen] = useState(false);

  // Grading Form State
  const [gradingForm, setGradingForm] = useState({
    period: "Mid-Term" as "Mid-Term" | "Final Assessment",
    technical: "5",
    conductAndEthics: "5",
    attendanceAndPunctuality: "5",
    problemSolving: "5",
    recommendation: "full_time_offer" as
      | "full_time_offer"
      | "commendation"
      | "satisfactory"
      | "needs_improvement",
    mentorComments: "",
  });

  useEffect(() => {
    setStudent(STUDENT_DIRECTORY[studentKey]!);
  }, [studentKey]);

  useEffect(() => {
    const sync = () => {
      setActivitiesList(getStoredActivities());
      setEvalList(getStoredEvaluations());
    };
    window.addEventListener("internflow-activities-change", sync);
    window.addEventListener("internflow-data-change", sync);
    return () => {
      window.removeEventListener("internflow-activities-change", sync);
      window.removeEventListener("internflow-data-change", sync);
    };
  }, []);

  const studentActivities = activitiesList.filter((a) => a.student_id === student.id);
  const studentEvals = evalList.filter((e) => e.student_id === student.id);
  const progressPct = Math.round((student.daysLogged / student.requiredDays) * 100);
  const initials = student.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  function executeVerifyShift() {
    setStudent((prev) => ({
      ...prev,
      attendanceVerified: true,
      daysLogged: prev.attendanceVerified ? prev.daysLogged : prev.daysLogged + 1,
    }));
    setConfirmVerifyShift(false);
    recordAuditEvent({
      actor: currentUserName || "Field Mentor",
      actorRole: "Field Mentor",
      action: "Verified Daily Workplace Attendance Shift",
      target: `${student.name} · ${student.todayCheckIn} – ${student.todayCheckOut}`,
      category: "attendance",
      scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    });
    toast.success(`Shift verified for ${student.name}`);
  }

  function handleAddStrength(e: React.FormEvent) {
    e.preventDefault();
    const val = newStrength.trim();
    if (!val) {
      toast.warning("Empty Form Warning", {
        description: "Please type an observed student strength before clicking Add Strength.",
      });
      return;
    }
    if (!student.strengths.includes(val)) {
      setStudent((prev) => ({ ...prev, strengths: [...prev.strengths, val] }));
      recordAuditEvent({
        actor: currentUserName || "Field Mentor",
        actorRole: "Field Mentor",
        action: "Documented Observed Student Strength",
        target: `${student.name} · Competency: ${val}`,
        category: "supervision",
        scopes: ["supervisor", "org_admin", "uni_admin", "system_admin"],
      });
      toast.success(`Added "${val}" to ${student.name}'s strengths`);
    }
    setNewStrength("");
  }

  function handleSaveConductAndWeeklyReview(e: React.FormEvent) {
    e.preventDefault();
    if (!student.conductNotes.trim() || !student.lastWeeklySummary.trim()) {
      toast.warning("Empty Form Warning", {
        description:
          "Please fill in both Workplace Conduct Notes and the Weekly Review Summary before saving.",
      });
      return;
    }
    setStudent((prev) => ({ ...prev, weeklyReviewStatus: "Completed" }));
    recordAuditEvent({
      actor: currentUserName || "Field Mentor",
      actorRole: "Field Mentor",
      action: `Signed Week ${student.weeklyReviewWeek} Conduct & Weekly Review`,
      target: `${student.name} · Rating: ${student.conductRating}`,
      category: "supervision",
      scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    });
    toast.success(`Saved Week ${student.weeklyReviewWeek} review & conduct assessment`);
  }

  function executeLogbookDecision() {
    if (!pendingDecision) return;
    const { act, status } = pendingDecision;
    const commentText =
      (logComments[act.id] ?? "").trim() ||
      (status === "approved"
        ? `Signed and verified by Field Mentor (${currentUserName}).`
        : "Please expand on the technical steps and resubmit.");

    approveOrCorrectActivity(act.id, status, userId, commentText);
    setActivitiesList(getStoredActivities());
    setLogComments((prev) => ({ ...prev, [act.id]: "" }));
    setPendingDecision(null);

    recordAuditEvent({
      actor: currentUserName || "Field Mentor",
      actorRole: "Field Mentor",
      action:
        status === "approved"
          ? "Signed & Commented on Student Logbook"
          : "Returned Logbook Entry for Revision",
      target: `${student.name} · ${act.title}`,
      category: "logbook",
      scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    });

    toast.success(
      status === "approved"
        ? `Signed off "${act.title}"`
        : `Returned "${act.title}" for revision`,
    );
  }

  function executeSaveGrade() {
    const t = Number(gradingForm.technical);
    const c = Number(gradingForm.conductAndEthics);
    const a = Number(gradingForm.attendanceAndPunctuality);
    const ps = Number(gradingForm.problemSolving);
    const score = Number(((t + c + a + ps) / 4).toFixed(1));

    let letter = "A (Distinction)";
    if (score < 3.0) letter = "C (Pass)";
    else if (score < 4.0) letter = "B (Credit)";
    else if (score < 4.5) letter = "B+ (Very Good)";

    const newEval: MockEvaluation = {
      id: `eval-${Date.now()}`,
      student_id: student.id,
      supervisor_id: userId || "supervisor-1",
      internship_id: "intern-1",
      evaluation_date: new Date().toISOString().slice(0, 10),
      period: gradingForm.period,
      ratings: {
        technical: t,
        punctuality: a,
        communication: c,
        problem_solving: ps,
      },
      overall_score: score,
      grade: letter,
      recommendation: gradingForm.recommendation,
      comments:
        gradingForm.mentorComments.trim() ||
        `Strengths: ${student.strengths.join(", ")} · Conduct: ${student.conductRating}.`,
      supervisor_name: currentUserName || "Eng. James Otieno",
    };

    const updated = [newEval, ...evalList];
    setEvalList(updated);
    saveStoredEvaluations(updated);
    setConfirmGradeOpen(false);

    recordAuditEvent({
      actor: currentUserName || "Field Mentor",
      actorRole: "Field Mentor",
      action: `Submitted ${gradingForm.period} Field Mentor Grading Form`,
      target: `${student.name} · Grade: ${letter} (${score}/5.0)`,
      category: "supervision",
      scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    });

    toast.success(`Recorded ${gradingForm.period} grade (${letter}) for ${student.name}`);
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Student Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Avatar className="size-11 rounded-xl">
            <AvatarFallback className="rounded-xl bg-muted font-semibold text-sm text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {student.name}
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                {student.regNo}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {student.conductRating}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {student.role} · {student.department} · {student.company}
            </p>
          </div>
        </div>

        {/* Switch between assigned students */}
        <div className="flex items-center gap-2">
          {Object.values(STUDENT_DIRECTORY).map((s) => (
            <Button
              key={s.id}
              asChild
              size="sm"
              variant={s.id === student.id ? "default" : "outline"}
              className="h-8 text-xs"
            >
              <Link href={`/students/${s.id}`}>{s.name.split(" ")[0]}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Attendance Verification & Placement Summary */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-5 rounded-xl border border-border/60">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CalendarCheck className="size-4 text-muted-foreground" />
              Workplace Attendance &amp; Shift Check
            </CardTitle>
            <CardDescription>
              Verify daily check-in/out hours and monitor 60-day completion pace
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3.5">
              <div>
                <p className="text-muted-foreground">Today&apos;s Recorded Shift</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                  {student.todayCheckIn} – {student.todayCheckOut}
                </p>
              </div>
              {student.attendanceVerified ? (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="size-3.5" /> Shift Verified
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setConfirmVerifyShift(true)}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  <Check className="size-3.5" />
                  Verify Shift
                </Button>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Cumulative Attendance ({student.attendanceRate} rate)
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {student.daysLogged} / {student.requiredDays} days ({progressPct}%)
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-3">
              <div>
                <span className="text-muted-foreground block">University:</span>
                <span className="font-medium text-foreground">{student.institution}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Academic Assessor:</span>
                <span className="font-medium text-foreground">{student.academicSupervisor}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Conduct at Organization, Strengths & Weekly Review */}
        <Card className="lg:col-span-7 rounded-xl border border-border/60">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="size-4 text-muted-foreground" />
              Workplace Conduct, Student Strengths &amp; Weekly Review
            </CardTitle>
            <CardDescription>
              Assess the student&apos;s conduct at the organization and document observed strengths
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-4 text-xs">
            {/* Observed Student Strengths */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-muted-foreground" />
                Identified Student Strengths
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {student.strengths.map((str) => (
                  <Badge key={str} variant="secondary" className="text-xs font-normal">
                    {str}
                  </Badge>
                ))}
              </div>
              <form onSubmit={handleAddStrength} className="flex items-center gap-2 pt-1">
                <Input
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="Add observed strength (e.g. Database Optimization)..."
                  className="h-8 text-xs"
                />
                <Button type="submit" size="sm" variant="outline" className="h-8 text-xs gap-1">
                  <Plus className="size-3.5" /> Add Strength
                </Button>
              </form>
            </div>

            {/* Conduct & Weekly Review Form */}
            <form
              onSubmit={handleSaveConductAndWeeklyReview}
              className="space-y-3 border-t border-border/50 pt-3"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Conduct at Organization</Label>
                  <Select
                    value={student.conductRating}
                    onValueChange={(v) =>
                      setStudent({
                        ...student,
                        conductRating: v as StudentRecord["conductRating"],
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exemplary Conduct">Exemplary Conduct</SelectItem>
                      <SelectItem value="Professional & Punctual">
                        Professional &amp; Punctual
                      </SelectItem>
                      <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                      <SelectItem value="Needs Guidance">Needs Guidance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Conduct &amp; Attitude Notes</Label>
                  <Input
                    value={student.conductNotes}
                    onChange={(e) => setStudent({ ...student, conductNotes: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">
                  Week {student.weeklyReviewWeek} Supervisory Review Summary
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={student.lastWeeklySummary}
                    onChange={(e) =>
                      setStudent({ ...student, lastWeeklySummary: e.target.value })
                    }
                    className="h-8 text-xs flex-1"
                  />
                  <Button type="submit" size="sm" className="h-8 text-xs font-medium shrink-0">
                    <ClipboardCheck className="mr-1.5 size-3.5" />
                    Save Review
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Student Logbooks & Field Mentor Comments */}
      <Card className="rounded-xl border border-border/60">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <MessageSquareText className="size-4 text-muted-foreground" />
            {student.name}&apos;s Logbook Entries &amp; Field Mentor Comments
          </CardTitle>
          <CardDescription>
            Review daily technical logs, write field mentor comments, and sign off or return for
            revision
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-3">
          {studentActivities.length === 0 ? (
            <EmptyState
              title="No Logbook Entries Submitted Yet"
              description="This student has not submitted any logbook entries yet."
            />
          ) : (
            studentActivities.map((act) => (
              <div
                key={act.id}
                className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{act.title}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {act.activity_date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                  <Badge
                    variant={act.status === "approved" ? "default" : "secondary"}
                    className="capitalize text-xs"
                  >
                    {act.status.replace("_", " ")}
                  </Badge>
                </div>

                {act.supervisor_comment && (
                  <p className="rounded-lg bg-muted/50 p-2.5 text-xs text-foreground/90">
                    <span className="font-semibold">Field Mentor Comment: </span>
                    {act.supervisor_comment}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <Input
                    value={logComments[act.id] ?? ""}
                    onChange={(e) =>
                      setLogComments((prev) => ({ ...prev, [act.id]: e.target.value }))
                    }
                    placeholder={`Write field mentor comment on "${act.title}"...`}
                    className="h-8 text-xs flex-1"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!(logComments[act.id] ?? "").trim()) {
                          toast.warning("Empty Form Warning", {
                            description:
                              "Please write your Field Mentor comment before signing off on this logbook entry.",
                          });
                          return;
                        }
                        setPendingDecision({ act, status: "approved" });
                      }}
                      className="h-8 text-xs font-medium gap-1"
                    >
                      <Check className="size-3.5" />
                      Sign &amp; Comment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!(logComments[act.id] ?? "").trim()) {
                          toast.warning("Empty Form Warning", {
                            description:
                              "Please enter revision instructions so the student knows what to update.",
                          });
                          return;
                        }
                        setPendingDecision({ act, status: "needs_correction" });
                      }}
                      className="h-8 text-xs font-medium gap-1"
                    >
                      <RotateCcw className="size-3.5" />
                      Revision
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* SECTION 4: Field Mentor Student Grading Form */}
      <Card className="rounded-xl border border-border/60">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Award className="size-4 text-muted-foreground" />
            Field Mentor Grading Form for {student.name}
          </CardTitle>
          <CardDescription>
            Evaluate technical competence, organization conduct, attendance, and problem solving
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Stage</Label>
              <Select
                value={gradingForm.period}
                onValueChange={(v) =>
                  setGradingForm({
                    ...gradingForm,
                    period: v as "Mid-Term" | "Final Assessment",
                  })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                  <SelectItem value="Final Assessment">Final Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Technical (1-5)</Label>
              <Select
                value={gradingForm.technical}
                onValueChange={(v) => setGradingForm({ ...gradingForm, technical: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "4", "3", "2", "1"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} / 5
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Org Conduct (1-5)</Label>
              <Select
                value={gradingForm.conductAndEthics}
                onValueChange={(v) => setGradingForm({ ...gradingForm, conductAndEthics: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "4", "3", "2", "1"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} / 5
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Attendance (1-5)</Label>
              <Select
                value={gradingForm.attendanceAndPunctuality}
                onValueChange={(v) =>
                  setGradingForm({ ...gradingForm, attendanceAndPunctuality: v })
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "4", "3", "2", "1"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} / 5
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Problem Solving (1-5)</Label>
              <Select
                value={gradingForm.problemSolving}
                onValueChange={(v) => setGradingForm({ ...gradingForm, problemSolving: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["5", "4", "3", "2", "1"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} / 5
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              value={gradingForm.mentorComments}
              onChange={(e) =>
                setGradingForm({ ...gradingForm, mentorComments: e.target.value })
              }
              placeholder="Write official Field Mentor grading remarks & recommendation..."
              className="h-9 text-xs flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (!gradingForm.mentorComments.trim()) {
                  toast.warning("Empty Form Warning", {
                    description:
                      "Please write your Field Mentor grading remarks before submitting the grade.",
                  });
                  return;
                }
                setConfirmGradeOpen(true);
              }}
              className="h-9 text-xs font-semibold shrink-0"
            >
              Submit &amp; Sign Grade
            </Button>
          </div>

          {studentEvals.length > 0 && (
            <div className="space-y-2 border-t border-border/50 pt-3">
              <p className="text-xs font-medium text-muted-foreground">Recorded Grades</p>
              {studentEvals.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-foreground">{ev.period}</span> ·{" "}
                    <span className="font-mono text-muted-foreground">{ev.evaluation_date}</span>
                    <p className="text-muted-foreground mt-0.5">{ev.comments}</p>
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {ev.grade} ({ev.overall_score}/5.0)
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yes / No Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmVerifyShift}
        onOpenChange={setConfirmVerifyShift}
        title="Verify Today's Workplace Attendance?"
        description={`Confirm that ${student.name} completed today's workplace shift (${student.todayCheckIn} – ${student.todayCheckOut})?`}
        confirmLabel="Yes, Verify Shift"
        cancelLabel="No, Cancel"
        onConfirm={executeVerifyShift}
      />

      <ConfirmDialog
        open={Boolean(pendingDecision)}
        onOpenChange={(open) => {
          if (!open) setPendingDecision(null);
        }}
        title={
          pendingDecision?.status === "approved"
            ? "Sign Off & Approve Logbook Entry?"
            : "Return Logbook Entry for Revision?"
        }
        description={
          pendingDecision
            ? `Are you sure you want to ${
                pendingDecision.status === "approved" ? "sign off on" : "return"
              } "${pendingDecision.act.title}" for ${student.name}?`
            : ""
        }
        confirmLabel={
          pendingDecision?.status === "approved" ? "Yes, Sign & Approve" : "Yes, Return Entry"
        }
        cancelLabel="No, Cancel"
        onConfirm={executeLogbookDecision}
      />

      <ConfirmDialog
        open={confirmGradeOpen}
        onOpenChange={setConfirmGradeOpen}
        title="Submit Official Field Mentor Grade?"
        description={`Are you sure you want to record and sign this ${gradingForm.period} grading form for ${student.name}?`}
        confirmLabel="Yes, Sign & Submit Grade"
        cancelLabel="No, Review Scores"
        onConfirm={executeSaveGrade}
      />
    </div>
  );
}
