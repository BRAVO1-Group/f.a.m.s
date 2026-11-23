import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  FileSignature,
  MessageSquareText,
  Pencil,
  RotateCcw,
  Wrench,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  },
  "student-2": {
    id: "student-2",
    name: "Brian Mwangi",
    regNo: "CS/2021/0088",
    role: "Cloud & Network Engineering Intern",
    department: "Infrastructure & Cloud",
    company: "Safaricom PLC",
    degree: "BSc. Telecommunications & Networking",
    institution: "Kenyatta University",
    email: "brian@university.ac.ke",
    phone: "+254 722 998 877",
    mentor: "Eng. James Otieno",
    academicSupervisor: "Dr. Agnes Kimani",
    daysLogged: 39,
    requiredDays: 60,
    attendanceRate: "96.0%",
    todayCheckIn: "08:45 AM",
    todayCheckOut: "05:00 PM",
    attendanceVerified: true,
  },
  "student-3": {
    id: "student-3",
    name: "Carol Achieng",
    regNo: "CS/2021/0015",
    role: "Data Science & BI Intern",
    department: "Business Intelligence",
    company: "Kenya Commercial Bank",
    degree: "BSc. Data Science & Analytics",
    institution: "Strathmore University",
    email: "carol@strathmore.edu",
    phone: "+254 733 112 233",
    mentor: "Eng. James Otieno",
    academicSupervisor: "Dr. Agnes Kimani",
    daysLogged: 60,
    requiredDays: 60,
    attendanceRate: "100%",
    todayCheckIn: "08:30 AM",
    todayCheckOut: "05:15 PM",
    attendanceVerified: true,
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
  const [logComments, setLogComments] = useState<Record<string, string>>({});
  const [logWarnings, setLogWarnings] = useState<Record<string, string>>({});
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<"all" | "approved" | "submitted" | "needs_correction">("all");
  const [gradeWarning, setGradeWarning] = useState<string | null>(null);

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
  const approvedActivitiesCount = studentActivities.filter((a) => a.status === "approved").length;
  const pendingActivitiesCount = studentActivities.filter((a) => a.status === "submitted").length;
  const revisionActivitiesCount = studentActivities.filter(
    (a) => a.status === "needs_correction",
  ).length;
  const visibleActivities =
    logFilter === "all"
      ? studentActivities
      : studentActivities.filter((a) => a.status === logFilter);
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

  function handleRequestLogDecision(act: MockActivity, status: "approved" | "needs_correction") {
    const commentText = (logComments[act.id] ?? "").trim();
    if (!commentText) {
      const msg =
        status === "approved"
          ? `Please write your Field Mentor comment before approving "${act.title}".`
          : `Please enter revision instructions so ${student.name} knows what to update on "${act.title}".`;
      setLogWarnings((prev) => ({ ...prev, [act.id]: msg }));
      toast.warning("Empty Form Warning", { description: msg });
      return;
    }
    setLogWarnings((prev) => {
      const next = { ...prev };
      delete next[act.id];
      return next;
    });
    setPendingDecision({ act, status });
  }

  function executeLogbookDecision() {
    if (!pendingDecision) return;
    const { act, status } = pendingDecision;
    const commentText = (logComments[act.id] ?? "").trim();

    approveOrCorrectActivity(act.id, status, userId, commentText);
    setActivitiesList(getStoredActivities());
    setLogComments((prev) => ({ ...prev, [act.id]: "" }));
    setEditingLogId(null);
    setPendingDecision(null);

    recordAuditEvent({
      actor: currentUserName || "Field Mentor",
      actorRole: "Field Mentor",
      action:
        status === "approved"
          ? "Signed & Approved Student Logbook Entry"
          : "Returned Logbook Entry for Revision",
      target: `${student.name} · ${act.title}`,
      category: "logbook",
      scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    });

    toast.success(
      status === "approved"
        ? `Approved & signed off "${act.title}"`
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
      comments: gradingForm.mentorComments.trim(),
      supervisor_name: currentUserName || "Eng. James Otieno",
    };

    const updated = [newEval, ...evalList];
    setEvalList(updated);
    saveStoredEvaluations(updated);
    setGradingForm((prev) => ({ ...prev, mentorComments: "" }));
    setGradeWarning(null);
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
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── Top Student Identity Banner Card ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 shrink-0">
              <Link href="/students">
                <ArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
            <Avatar className="size-11 rounded-xl shrink-0">
              <AvatarFallback className="rounded-xl bg-muted font-semibold text-sm text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {student.name}
                </h1>
                <Badge variant="secondary" className="font-mono text-xs">
                  {student.regNo}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {student.attendanceVerified ? "Shift Verified" : "Shift Pending"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {student.role} · {student.department} · {student.company}
              </p>
            </div>
          </div>

          {/* Strictly This Student's Contact & Academic Profile Info (No Other Student Names) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
            <Badge variant="outline" className="px-2.5 py-1 font-normal text-muted-foreground">
              {student.degree}
            </Badge>
            <Badge variant="outline" className="px-2.5 py-1 font-mono font-normal text-muted-foreground">
              {student.email}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ── SECTION 1: Workplace Attendance & Placement Overview (Full-Width Clean Card) ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CalendarCheck className="size-4 text-muted-foreground" />
            Workplace Attendance &amp; Placement Progress
          </CardTitle>
          <CardDescription>
            Verify today&apos;s workplace shift and monitor the student&apos;s 60-day completion pace
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="grid gap-4 md:grid-cols-3 items-center">
            {/* Today's Shift Verification */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Today&apos;s Recorded Shift</p>
                <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                  {student.todayCheckIn} – {student.todayCheckOut}
                </p>
              </div>
              {student.attendanceVerified ? (
                <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs">
                  <CheckCircle2 className="size-3.5 text-[#589E10] dark:text-primary" />
                  Verified
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

            {/* Attendance Pace */}
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Attendance Pace ({student.attendanceRate})
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {student.daysLogged} / {student.requiredDays} days ({progressPct}%)
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {/* University & Academic Supervisor */}
            <div className="rounded-xl border border-border/60 bg-background/60 p-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block">University</span>
                <span className="font-semibold text-foreground">{student.institution}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Academic Assessor</span>
                <span className="font-semibold text-foreground">{student.academicSupervisor}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── SECTION 2: Student Logbook Entries & Field Mentor Comments (Spacious, Clear Approved vs Pending State) ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardHeader className="p-6 pb-4 border-b border-border/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <MessageSquareText className="size-4 text-muted-foreground" />
                {student.name}&apos;s Logbook Submissions
              </CardTitle>
              <CardDescription className="mt-0.5">
                View {student.name}&apos;s signed and approved logbook submissions alongside pending entries awaiting your Field Mentor comment
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit font-mono text-xs">
              {approvedActivitiesCount} of {studentActivities.length} Signed &amp; Approved
            </Badge>
          </div>

          {/* Filter Tabs for This Student's Submissions */}
          <Tabs
            value={logFilter}
            onValueChange={(v) =>
              setLogFilter(v as "all" | "approved" | "submitted" | "needs_correction")
            }
          >
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs gap-1.5">
                All Submissions
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {studentActivities.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs gap-1.5">
                Signed &amp; Approved
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {approvedActivitiesCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="submitted" className="text-xs gap-1.5">
                Pending Sign-Off
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {pendingActivitiesCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="needs_correction" className="text-xs gap-1.5">
                Revisions
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {revisionActivitiesCount}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {visibleActivities.length === 0 ? (
            <EmptyState
              title="No Logbook Submissions in This View"
              description={`No ${logFilter === "approved" ? "signed and approved" : logFilter === "submitted" ? "pending" : ""} logbook entries found for ${student.name}.`}
            />
          ) : (
            visibleActivities.map((act) => {
              const isApproved = act.status === "approved";
              const isRevision = act.status === "needs_correction";
              const isEditing = editingLogId === act.id || !isApproved;
              const recordedComment =
                act.supervisor_feedback ||
                act.supervisor_comment ||
                `Verified and signed off by Field Mentor (${currentUserName || student.mentor}).`;
              const warningMsg = logWarnings[act.id];

              return (
                <div
                  key={act.id}
                  className="rounded-xl border border-border/70 bg-background/60 overflow-hidden"
                >
                  {/* Entry Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 bg-muted/25 px-5 py-3.5">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {act.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5 font-mono">
                          <Calendar className="size-3.5" />
                          {act.activity_date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-mono">
                          <Clock className="size-3.5" />
                          {act.arrival_time
                            ? `${act.arrival_time} – ${act.departure_time || "17:00"}`
                            : "08:30 – 17:00"}
                        </span>
                      </div>
                    </div>

                    {/* Clear Coloured & Labelled Status Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#589E10]/40 bg-[#9CE840]/20 px-3 py-1 text-xs font-bold text-[#2D5408] dark:border-[#9CE840]/40 dark:bg-[#9CE840]/15 dark:text-[#9CE840]">
                          <CheckCircle2 className="size-3.5" />
                          Approved &amp; Signed Off
                        </span>
                      ) : isRevision ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
                          <RotateCcw className="size-3.5" />
                          Revision Requested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <Clock className="size-3.5" />
                          Submitted · Pending Approval
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Entry Body: Full Details So Mentor Clearly Sees What They Are Commenting On */}
                  <div className="p-5 space-y-4 text-xs">
                    {/* Task Description */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Work Completed &amp; Deliverable Summary
                      </p>
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                        {act.description}
                      </p>
                    </div>

                    {/* Tools & Skills */}
                    {(act.tools_used.length > 0 || act.skills_gained.length > 0) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground mr-1">
                          <Wrench className="size-3.5" />
                          Tools &amp; Skills:
                        </span>
                        {act.tools_used.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs font-medium">
                            {t}
                          </Badge>
                        ))}
                        {act.skills_gained.map((sk) => (
                          <Badge key={sk} variant="outline" className="text-xs font-normal">
                            {sk}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Challenges & Solutions */}
                    {(act.challenges || act.solutions) && (
                      <div className="grid gap-3 sm:grid-cols-2 pt-1">
                        {act.challenges && (
                          <div className="rounded-lg border border-border/60 bg-card p-3 space-y-1">
                            <p className="text-[11px] font-semibold text-muted-foreground">
                              Challenge Reported
                            </p>
                            <p className="text-xs text-foreground/90 leading-relaxed">
                              {act.challenges}
                            </p>
                          </div>
                        )}
                        {act.solutions && (
                          <div className="rounded-lg border border-border/60 bg-card p-3 space-y-1">
                            <p className="text-[11px] font-semibold text-muted-foreground">
                              Solution Applied
                            </p>
                            <p className="text-xs text-foreground/90 leading-relaxed">
                              {act.solutions}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── ACTION ZONE: Clearly Distinguishes Approved vs Awaiting Action ── */}
                    <div className="border-t border-border/50 pt-4">
                      {isApproved && editingLogId !== act.id ? (
                        /* APPROVED STATE: Coloured Green Approval Banner + Mentor Comment + Optional "Update Comment" Button */
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#589E10]/35 bg-[#9CE840]/12 dark:border-[#9CE840]/30 dark:bg-[#9CE840]/10 p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#9CE840] text-[#18221B] mt-0.5">
                              <CheckCircle2 className="size-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-[#2D5408] dark:text-[#9CE840]">
                                  APPROVED — Officially Signed Off by Field Mentor
                                </span>
                                {act.reviewed_at && (
                                  <span className="font-mono text-[11px] text-muted-foreground">
                                    · {new Date(act.reviewed_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-foreground/90 leading-relaxed">
                                &ldquo;{recordedComment}&rdquo;
                              </p>
                            </div>
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setLogComments((prev) => ({
                                ...prev,
                                [act.id]: recordedComment,
                              }));
                              setEditingLogId(act.id);
                            }}
                            className="h-8 text-xs font-medium gap-1.5 shrink-0"
                          >
                            <Pencil className="size-3.5" />
                            Update Comment
                          </Button>
                        </div>
                      ) : (
                        /* COMMENT & SIGN-OFF EDITOR (Spacious Textarea + Warning Validation + Clear Action Buttons) */
                        <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`comment-${act.id}`}
                              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                            >
                              <MessageSquareText className="size-3.5 text-muted-foreground" />
                              Field Mentor Comment &amp; Evaluation Note *
                            </Label>
                            <span className="text-[11px] text-muted-foreground">
                              Required to sign off or request revision
                            </span>
                          </div>

                          {warningMsg && (
                            <div
                              role="alert"
                              className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300"
                            >
                              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                              <span>{warningMsg}</span>
                            </div>
                          )}

                          <Textarea
                            id={`comment-${act.id}`}
                            rows={3}
                            value={logComments[act.id] ?? ""}
                            onChange={(e) => {
                              setLogComments((prev) => ({
                                ...prev,
                                [act.id]: e.target.value,
                              }));
                              if (warningMsg && e.target.value.trim()) {
                                setLogWarnings((prev) => {
                                  const next = { ...prev };
                                  delete next[act.id];
                                  return next;
                                });
                              }
                            }}
                            placeholder={`Write your feedback, verification remarks, or revision guidance on "${act.title}"...`}
                            className={`text-xs resize-none ${
                              warningMsg ? "border-amber-500 focus-visible:ring-amber-500" : ""
                            }`}
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="text-[11px] text-muted-foreground">
                              Your comment and signature will be attached to {student.name}&apos;s logbook.
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                              {isApproved && editingLogId === act.id && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingLogId(null)}
                                  className="h-8 text-xs"
                                >
                                  Cancel
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRequestLogDecision(act, "needs_correction")
                                }
                                className="h-8 text-xs font-medium gap-1.5"
                              >
                                <RotateCcw className="size-3.5" />
                                Request Revision
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleRequestLogDecision(act, "approved")}
                                className="h-8 text-xs font-semibold gap-1.5"
                              >
                                <Check className="size-3.5" />
                                Approve &amp; Sign Logbook
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* ── SECTION 3: Field Mentor Student Grading Form ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Award className="size-4 text-muted-foreground" />
            Field Mentor Grading Form for {student.name}
          </CardTitle>
          <CardDescription>
            Evaluate technical competence, organization conduct, attendance, and problem solving
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2 space-y-4">
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
                <SelectTrigger className="h-9 text-xs">
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
                <SelectTrigger className="h-9 text-xs">
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
                <SelectTrigger className="h-9 text-xs">
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
                <SelectTrigger className="h-9 text-xs">
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
                <SelectTrigger className="h-9 text-xs">
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

          {gradeWarning && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300"
            >
              <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>{gradeWarning}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs">Official Field Mentor Grading Remarks *</Label>
            <Textarea
              rows={2}
              value={gradingForm.mentorComments}
              onChange={(e) => {
                setGradingForm({ ...gradingForm, mentorComments: e.target.value });
                if (gradeWarning && e.target.value.trim()) setGradeWarning(null);
              }}
              placeholder="Write official Field Mentor grading remarks & recommendation (required)..."
              className={`text-xs resize-none ${
                gradeWarning ? "border-amber-500 focus-visible:ring-amber-500" : ""
              }`}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (!gradingForm.mentorComments.trim()) {
                  const msg =
                    "Please write your Field Mentor grading remarks before submitting the grade.";
                  setGradeWarning(msg);
                  toast.warning("Empty Form Warning", {
                    description: msg,
                  });
                  return;
                }
                setGradeWarning(null);
                setConfirmGradeOpen(true);
              }}
              className="h-9 text-xs font-semibold shrink-0 gap-1.5"
            >
              <Award className="size-3.5" />
              Submit &amp; Sign Grade
            </Button>
          </div>

          {studentEvals.length > 0 && (
            <div className="space-y-2 border-t border-border/50 pt-4">
              <p className="text-xs font-semibold text-muted-foreground">Recorded Grades</p>
              {studentEvals.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/60 p-3.5 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{ev.period}</span>
                      <span className="font-mono text-muted-foreground">{ev.evaluation_date}</span>
                    </div>
                    <p className="text-muted-foreground">{ev.comments}</p>
                  </div>
                  <Badge variant="secondary" className="font-bold w-fit">
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
            ? "Approve & Sign Off Logbook Entry?"
            : "Return Logbook Entry for Revision?"
        }
        description={
          pendingDecision
            ? `Are you sure you want to ${
                pendingDecision.status === "approved" ? "officially approve and sign off on" : "return"
              } "${pendingDecision.act.title}" for ${student.name}?`
            : ""
        }
        confirmLabel={
          pendingDecision?.status === "approved" ? "Yes, Approve & Sign" : "Yes, Return Entry"
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
