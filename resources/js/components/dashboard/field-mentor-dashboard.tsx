import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import {
  Award,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileSignature,
  MessageSquareText,
  Plus,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { AuditTrailPanel, recordAuditEvent } from "@/components/dashboard/audit-trail-panel";
import {
  approveOrCorrectActivity,
  evaluations as initialEvaluations,
  getStoredActivities,
  organizations,
  type MockActivity,
  type MockEvaluation,
} from "@/lib/mock-data";
import { getGreeting } from "./get-greeting";

type MenteeProfile = {
  id: string;
  name: string;
  regNo: string;
  role: string;
  department: string;
  degree: string;
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

const INITIAL_MENTEES: MenteeProfile[] = [
  {
    id: "student-1",
    name: "Alice Wanjiku",
    regNo: "CS/2021/0042",
    role: "Software Engineering Intern",
    department: "Product Engineering",
    degree: "BSc. Computer Science",
    daysLogged: 42,
    requiredDays: 60,
    attendanceRate: "97.5%",
    todayCheckIn: "08:52 AM",
    todayCheckOut: "05:06 PM",
    attendanceVerified: true,
    conductRating: "Exemplary Conduct",
    conductNotes:
      "Disciplined, adheres to organization security policies, collaborates well in daily team standups.",
    strengths: ["REST API Design", "Query Optimization", "Automated Testing", "Problem Solving"],
    weeklyReviewWeek: 7,
    weeklyReviewStatus: "Completed",
    lastWeeklySummary:
      "Completed authentication service ahead of schedule with clean unit test coverage.",
  },
  {
    id: "student-4",
    name: "Kevin Kiprono",
    regNo: "CS/2021/0104",
    role: "Cybersecurity Analyst Intern",
    department: "InfoSec Operations",
    degree: "BSc. Computer Science (Cybersecurity)",
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
];

export function FieldMentorDashboard({ userId, name }: { userId: string; name: string }) {
  const greeting = getGreeting();
  const company = organizations[0]!;
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [mentees, setMentees] = useState<MenteeProfile[]>(INITIAL_MENTEES);
  const [evalList, setEvalList] = useState<MockEvaluation[]>(initialEvaluations);
  const [logComments, setLogComments] = useState<Record<string, string>>({});
  const [pendingDecision, setPendingDecision] = useState<{
    act: MockActivity;
    status: "approved" | "needs_correction";
  } | null>(null);

  // Weekly Review & Strengths Modal State
  const [weeklyModalOpen, setWeeklyModalOpen] = useState(false);
  const [weeklyTargetId, setWeeklyTargetId] = useState("student-1");
  const [weeklyForm, setWeeklyForm] = useState({
    weekNumber: "7",
    conductRating: "Exemplary Conduct" as MenteeProfile["conductRating"],
    conductNotes: "",
    observedStrengths: "",
    weeklyComment: "",
  });

  // Field Mentor Grading Form Modal State
  const [gradingOpen, setGradingOpen] = useState(false);
  const [gradingForm, setGradingForm] = useState({
    studentId: "student-1",
    period: "Mid-Term" as "Mid-Term" | "Final Assessment",
    technical: "5",
    conductAndEthics: "5",
    attendanceAndPunctuality: "5",
    problemSolving: "5",
    strengthsObserved:
      "Strong ownership of assigned engineering tasks, clean technical documentation, and rapid debugging.",
    conductSummary:
      "Demonstrates exemplary workplace conduct, punctuality, and respect for organizational culture.",
    recommendation: "full_time_offer" as
      | "full_time_offer"
      | "commendation"
      | "satisfactory"
      | "needs_improvement",
    mentorComments: "",
  });

  useEffect(() => {
    const handler = () => setActivitiesList(getStoredActivities());
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  const assignedStudentIds = mentees.map((s) => s.id);
  const myAssignedActivities = activitiesList.filter((a) =>
    assignedStudentIds.includes(a.student_id),
  );
  const pendingActivities = myAssignedActivities.filter((a) => a.status === "submitted");
  const signedActivities = myAssignedActivities.filter((a) => a.status === "approved");

  function handleVerifyAttendance(studentId: string) {
    setMentees((prev) =>
      prev.map((m) =>
        m.id === studentId
          ? {
              ...m,
              attendanceVerified: true,
              daysLogged: m.attendanceVerified ? m.daysLogged : m.daysLogged + 1,
            }
          : m,
      ),
    );
    const target = mentees.find((m) => m.id === studentId);
    toast.success(`Attendance verified for ${target?.name ?? "Intern"}`, {
      description: `Shift (${target?.todayCheckIn} – ${target?.todayCheckOut}) signed off.`,
    });
  }

  function handleLogbookDecision(act: MockActivity, status: "approved" | "needs_correction") {
    const student = mentees.find((s) => s.id === act.student_id);
    const commentText =
      (logComments[act.id] ?? "").trim() ||
      (status === "approved"
        ? `Signed and verified by Field Mentor (${name}). Good technical execution and workplace discipline.`
        : "Please expand on the technical steps and attach verification output before sign-off.");

    approveOrCorrectActivity(act.id, status, userId, commentText);
    setActivitiesList(getStoredActivities());
    setLogComments((prev) => ({ ...prev, [act.id]: "" }));

    if (status === "approved") {
      toast.success("Logbook Signed & Commented", {
        description: `Signed off "${act.title}" for ${student?.name ?? "Intern"}.`,
      });
    } else {
      toast.info("Revision Requested", {
        description: `Returned "${act.title}" to ${student?.name ?? "Intern"} with mentor guidance.`,
      });
    }
  }

  function openWeeklyReview(mentee: MenteeProfile) {
    setWeeklyTargetId(mentee.id);
    setWeeklyForm({
      weekNumber: String(mentee.weeklyReviewWeek),
      conductRating: mentee.conductRating,
      conductNotes: mentee.conductNotes,
      observedStrengths: mentee.strengths.join(", "),
      weeklyComment: mentee.lastWeeklySummary,
    });
    setWeeklyModalOpen(true);
  }

  function handleSaveWeeklyReview(e: React.FormEvent) {
    e.preventDefault();
    if (
      !weeklyForm.observedStrengths.trim() ||
      !weeklyForm.conductNotes.trim() ||
      !weeklyForm.weeklyComment.trim()
    ) {
      toast.warning("Empty Form Warning", {
        description:
          "Please complete the Observed Strengths, Conduct Notes, and Weekly Summary fields.",
      });
      return;
    }
    const parsedStrengths = weeklyForm.observedStrengths
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setMentees((prev) =>
      prev.map((m) =>
        m.id === weeklyTargetId
          ? {
              ...m,
              conductRating: weeklyForm.conductRating,
              conductNotes: weeklyForm.conductNotes.trim() || m.conductNotes,
              strengths: parsedStrengths.length > 0 ? parsedStrengths : m.strengths,
              weeklyReviewStatus: "Completed",
              lastWeeklySummary:
                weeklyForm.weeklyComment.trim() ||
                `Week ${weeklyForm.weekNumber} review completed and signed by Field Mentor.`,
            }
          : m,
      ),
    );
    setWeeklyModalOpen(false);
    const target = mentees.find((m) => m.id === weeklyTargetId);
    toast.success(`Week ${weeklyForm.weekNumber} Review Saved`, {
      description: `Updated strengths, conduct, and weekly review for ${target?.name}.`,
    });
  }

  function handleSubmitGradingForm(e: React.FormEvent) {
    e.preventDefault();
    if (!gradingForm.strengthsObserved.trim() || !gradingForm.conductSummary.trim()) {
      toast.warning("Empty Form Warning", {
        description:
          "Please fill in the student's Key Strengths and Workplace Conduct evaluation before submitting.",
      });
      return;
    }
    const t = Number(gradingForm.technical);
    const c = Number(gradingForm.conductAndEthics);
    const a = Number(gradingForm.attendanceAndPunctuality);
    const ps = Number(gradingForm.problemSolving);
    const score = Number(((t + c + a + ps) / 4).toFixed(1));

    let letter = "A (Distinction)";
    if (score < 3.0) letter = "C (Pass)";
    else if (score < 4.0) letter = "B (Credit)";
    else if (score < 4.5) letter = "B+ (Very Good)";

    const targetStudent = mentees.find((s) => s.id === gradingForm.studentId);

    const composedComment = [
      `Strengths: ${gradingForm.strengthsObserved}`,
      `Conduct: ${gradingForm.conductSummary}`,
      gradingForm.mentorComments ? `Remarks: ${gradingForm.mentorComments}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const newEval: MockEvaluation = {
      id: `eval-${Date.now()}`,
      student_id: gradingForm.studentId,
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
      comments: composedComment,
      supervisor_name: name || "James Otieno",
    };

    setEvalList((prev) => [newEval, ...prev]);
    setGradingOpen(false);
    toast.success("Field Mentor Grading Form Submitted", {
      description: `Recorded ${gradingForm.period} grade of ${letter} (${score}/5.0) for ${targetStudent?.name}.`,
    });
  }

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── Calm, Clean Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {company.name} · Field Mentor Workspace
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setGradingOpen(true)}
            size="sm"
            className="h-9 rounded-lg text-xs font-semibold gap-1.5"
          >
            <Award className="size-4" />
            Grade Student
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 rounded-lg text-xs font-semibold gap-1.5"
          >
            <Link href="/review">
              <FileSignature className="size-4" />
              Logbook Queue ({pendingActivities.length})
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 4 Quiet KPI Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Assigned Mentees"
          value={mentees.length}
          unit="students"
          meta="Under direct workplace supervision"
        />
        <KpiCard
          label="Logbooks Awaiting Sign-Off"
          value={pendingActivities.length}
          unit="entries"
          meta={`${signedActivities.length} signed with mentor comments`}
        />
        <KpiCard
          label="Today's Attendance Check"
          value={`${mentees.filter((m) => m.attendanceVerified).length} / ${mentees.length}`}
          unit="verified"
          meta="Daily shift check-in verification"
        />
        <KpiCard
          label="Weekly Reviews"
          value={`${mentees.filter((m) => m.weeklyReviewStatus === "Completed").length} / ${mentees.length}`}
          unit="up to date"
          meta="Conduct & strengths assessment"
        />
      </div>

      {/* ── Clean, Minimalist Student Cards (Click to Open Dedicated Student Supervision Page) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
              Assigned Interns
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a student card to open their detailed supervision, attendance, conduct, strengths, and grading page
            </p>
          </div>
          <Button asChild size="sm" variant="ghost" className="h-8 text-xs font-medium">
            <Link href="/students">View All →</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mentees.map((student) => {
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
                          <AvatarFallback className="rounded-lg bg-muted text-foreground font-semibold text-xs">
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
                        {student.attendanceVerified ? "Shift Verified" : "Shift Pending"}
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
                        Week {student.weeklyReviewWeek} · {student.conductRating}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:translate-x-0.5 transition-transform">
                        Open Supervision Page
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

      {/* ── Clean Tabbed Bottom Section: Logbook Comments vs Grading Forms ── */}
      <Tabs defaultValue="logbooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logbooks" className="gap-2 text-xs">
            <MessageSquareText className="size-3.5" />
            Logbook Sign-Off &amp; Mentor Comments ({pendingActivities.length})
          </TabsTrigger>
          <TabsTrigger value="grading" className="gap-2 text-xs">
            <Award className="size-3.5" />
            Field Mentor Grading Forms ({evalList.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Logbook Sign-Off & Field Mentor Comments */}
        <TabsContent value="logbooks">
          <Card className="rounded-xl border border-border/60">
            <CardHeader className="flex flex-col items-start justify-between gap-3 p-5 pb-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-base font-semibold">
                  Student Logbook Entries &amp; Mentor Comments
                </CardTitle>
                <CardDescription>
                  Add your field mentor comments and sign off on submitted daily logbooks
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline" className="h-8 text-xs font-medium">
                <Link href="/review">Full Review Page</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 p-5 pt-2">
              {pendingActivities.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="All Submitted Logbooks Signed Off"
                  description="There are no pending student logbook entries awaiting your field mentor comment or signature right now."
                />
              ) : (
                pendingActivities.map((act) => {
                  const student = mentees.find((s) => s.id === act.student_id);
                  return (
                    <div
                      key={act.id}
                      className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-[11px] font-medium">
                              {student?.name ?? "Intern"}
                            </Badge>
                            <span className="font-semibold text-sm text-foreground">
                              {act.title}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {act.activity_date}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                              Submitted · Pending Approval
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {act.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <Input
                          value={logComments[act.id] ?? ""}
                          onChange={(e) =>
                            setLogComments((prev) => ({ ...prev, [act.id]: e.target.value }))
                          }
                          placeholder={`Add field mentor comment for ${student?.name ?? "student"}...`}
                          className="h-8 text-xs flex-1"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!(logComments[act.id] ?? "").trim()) {
                                toast.warning("Empty Form Warning", {
                                  description:
                                    "Please write a Field Mentor comment before signing off on this logbook entry.",
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
                                    "Please write revision notes so the student knows what to update.",
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
                  );
                })
              )}

              {signedActivities.length > 0 && (
                <div className="pt-3 border-t border-border/50 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Recently Signed Logbooks
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {signedActivities.slice(0, 4).map((act) => {
                      const student = mentees.find((s) => s.id === act.student_id);
                      return (
                        <div
                          key={act.id}
                          className="rounded-lg border border-[#589E10]/35 bg-[#9CE840]/12 dark:border-[#9CE840]/30 dark:bg-[#9CE840]/10 p-3 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-foreground truncate">
                              {act.title}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#589E10]/40 bg-[#9CE840]/25 px-2 py-0.5 text-[10px] font-bold text-[#2D5408] dark:border-[#9CE840]/40 dark:bg-[#9CE840]/20 dark:text-[#9CE840] shrink-0">
                              <CheckCircle2 className="size-3" />
                              Approved
                            </span>
                          </div>
                          <p className="text-[11px] text-foreground/85">
                            {student?.name} ({act.activity_date}) ·{" "}
                            {act.supervisor_comment || act.supervisor_feedback || "Approved & Signed by Field Mentor"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Field Mentor Grading Forms */}
        <TabsContent value="grading">
          <Card className="rounded-xl border border-border/60">
            <CardHeader className="flex flex-col items-start justify-between gap-3 p-5 pb-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-base font-semibold">
                  Submitted Field Mentor Grading Forms
                </CardTitle>
                <CardDescription>
                  Workplace evaluations covering technical skill, organization conduct, attendance,
                  and student strengths
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setGradingOpen(true)}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <Plus className="size-3.5" />
                New Grading Form
              </Button>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-2.5">
              {evalList.map((ev) => {
                const student = mentees.find((m) => m.id === ev.student_id);
                return (
                  <div
                    key={ev.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/50 p-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {student?.name ?? "Alice Wanjiku"}
                        </span>
                        <Badge variant="secondary" className="text-[11px] font-normal">
                          {ev.period}
                        </Badge>
                        <span className="font-mono text-muted-foreground">
                          {ev.evaluation_date}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{ev.comments}</p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="block font-display text-sm font-bold text-foreground">
                        {ev.grade}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {ev.overall_score} / 5.0
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Live Activity & Compliance Audit Trail ── */}
      <AuditTrailPanel role="supervisor" />

      {/* ── DIALOG 1: Weekly Conduct, Strengths & Review Modal ── */}
      <Dialog open={weeklyModalOpen} onOpenChange={setWeeklyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Weekly Review, Conduct &amp; Student Strengths</DialogTitle>
            <DialogDescription>
              Update the student&apos;s workplace conduct, observed strengths, and weekly progress
              at {company.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveWeeklyReview} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Attachment Week</Label>
                <Input
                  type="number"
                  min={1}
                  max={16}
                  value={weeklyForm.weekNumber}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, weekNumber: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Conduct at Organization</Label>
                <Select
                  value={weeklyForm.conductRating}
                  onValueChange={(v) =>
                    setWeeklyForm({
                      ...weeklyForm,
                      conductRating: v as MenteeProfile["conductRating"],
                    })
                  }
                >
                  <SelectTrigger>
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
            </div>

            <div className="space-y-1.5">
              <Label>Observed Student Strengths (comma-separated)</Label>
              <Input
                value={weeklyForm.observedStrengths}
                onChange={(e) =>
                  setWeeklyForm({ ...weeklyForm, observedStrengths: e.target.value })
                }
                placeholder="e.g. REST API Design, Teamwork, Problem Solving"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Workplace Conduct &amp; Attitude Notes</Label>
              <Textarea
                rows={2}
                value={weeklyForm.conductNotes}
                onChange={(e) => setWeeklyForm({ ...weeklyForm, conductNotes: e.target.value })}
                placeholder="Assess punctuality, adherence to company policy, and teamwork..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Weekly Review Summary &amp; Mentor Guidance</Label>
              <Textarea
                rows={3}
                value={weeklyForm.weeklyComment}
                onChange={(e) => setWeeklyForm({ ...weeklyForm, weeklyComment: e.target.value })}
                placeholder="Summarize the student's weekly deliverables and areas for next week..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setWeeklyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Weekly Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG 2: Field Mentor Grading Form Modal ── */}
      <Dialog open={gradingOpen} onOpenChange={setGradingOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Field Mentor Student Grading Form</DialogTitle>
            <DialogDescription>
              Grade your assigned intern&apos;s technical proficiency, workplace conduct at the
              organization, attendance, and key strengths.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitGradingForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Assigned Student</Label>
                <Select
                  value={gradingForm.studentId}
                  onValueChange={(v) => setGradingForm({ ...gradingForm, studentId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mentees.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.regNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Assessment Stage</Label>
                <Select
                  value={gradingForm.period}
                  onValueChange={(v) =>
                    setGradingForm({
                      ...gradingForm,
                      period: v as "Mid-Term" | "Final Assessment",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mid-Term">Mid-Term Field Assessment</SelectItem>
                    <SelectItem value="Final Assessment">Final Exit Field Grading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Technical Skill (1-5)</Label>
                <Select
                  value={gradingForm.technical}
                  onValueChange={(v) => setGradingForm({ ...gradingForm, technical: v })}
                >
                  <SelectTrigger>
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

              <div className="space-y-1.5">
                <Label className="text-xs">Org Conduct (1-5)</Label>
                <Select
                  value={gradingForm.conductAndEthics}
                  onValueChange={(v) => setGradingForm({ ...gradingForm, conductAndEthics: v })}
                >
                  <SelectTrigger>
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

              <div className="space-y-1.5">
                <Label className="text-xs">Attendance (1-5)</Label>
                <Select
                  value={gradingForm.attendanceAndPunctuality}
                  onValueChange={(v) =>
                    setGradingForm({ ...gradingForm, attendanceAndPunctuality: v })
                  }
                >
                  <SelectTrigger>
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

              <div className="space-y-1.5">
                <Label className="text-xs">Problem Solving (1-5)</Label>
                <Select
                  value={gradingForm.problemSolving}
                  onValueChange={(v) => setGradingForm({ ...gradingForm, problemSolving: v })}
                >
                  <SelectTrigger>
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

            <div className="space-y-1.5">
              <Label>Key Strengths Identified in the Student</Label>
              <Input
                value={gradingForm.strengthsObserved}
                onChange={(e) =>
                  setGradingForm({ ...gradingForm, strengthsObserved: e.target.value })
                }
                placeholder="Document the student's strongest technical and professional skills..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Conduct &amp; Professionalism at Host Organization</Label>
              <Textarea
                rows={2}
                value={gradingForm.conductSummary}
                onChange={(e) => setGradingForm({ ...gradingForm, conductSummary: e.target.value })}
                placeholder="Evaluate discipline, ethics, teamwork, and adherence to workplace rules..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Field Mentor Final Remarks &amp; Logbook Endorsement</Label>
              <Textarea
                rows={2}
                value={gradingForm.mentorComments}
                onChange={(e) => setGradingForm({ ...gradingForm, mentorComments: e.target.value })}
                placeholder="Additional mentorship notes for the university academic board..."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGradingOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Field Mentor Grade</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Yes / No Confirmation Dialog for Signing Off or Returning a Student Logbook */}
      <ConfirmDialog
        open={Boolean(pendingDecision)}
        onOpenChange={(open) => {
          if (!open) setPendingDecision(null);
        }}
        title={
          pendingDecision?.status === "approved"
            ? "Sign Off & Approve Student Logbook Entry?"
            : "Return Logbook Entry for Student Revision?"
        }
        description={
          pendingDecision
            ? `Are you sure you want to ${
                pendingDecision.status === "approved"
                  ? "officially sign off on"
                  : "request revisions for"
              } "${pendingDecision.act.title}" with your field mentor comments?`
            : ""
        }
        confirmLabel={
          pendingDecision?.status === "approved"
            ? "Yes, Sign & Approve"
            : "Yes, Return for Revision"
        }
        cancelLabel="No, Cancel"
        onConfirm={() => {
          if (pendingDecision) {
            handleLogbookDecision(pendingDecision.act, pendingDecision.status);
            setPendingDecision(null);
          }
        }}
      />
    </div>
  );
}
