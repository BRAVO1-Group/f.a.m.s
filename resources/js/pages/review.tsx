import { useCallback, useMemo, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSignature,
  MessageSquareText,
  RotateCcw,
  Search,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useAppUser } from "@/lib/app-user";

type ReviewActivity = {
  id: string;
  student_id: string;
  student: {
    id: string;
    full_name: string;
    email: string;
    course: string | null;
  };
  title: string;
  description: string;
  activity_date: string;
  arrival_time: string | null;
  departure_time: string | null;
  tools_used: string[];
  skills_gained: string[];
  challenges: string | null;
  solutions: string | null;
  status: "submitted" | "approved" | "needs_correction";
  submitted_at: string | null;
  supervisor_feedback: string | null;
  reviewed_at: string | null;
};

type ReviewPageProps = {
  logbooks: ReviewActivity[];
  students: ReviewActivity["student"][];
};

type FilterType = "submitted" | "approved" | "needs_correction";

function statusLabel(status: ReviewActivity["status"]) {
  if (status === "approved") return "Approved & Signed Off";
  if (status === "needs_correction") return "Revision Requested";
  return "Submitted · Pending Approval";
}

function statusPillClass(status: ReviewActivity["status"]) {
  if (status === "approved") {
    return "border-[#589E10]/40 bg-[#9CE840]/20 text-[#2D5408] dark:border-[#9CE840]/40 dark:bg-[#9CE840]/15 dark:text-[#9CE840]";
  }
  if (status === "needs_correction") {
    return "border-destructive/40 bg-destructive/10 text-destructive";
  }
  return "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300";
}

export default function ReviewPage() {
  const { role } = useAppUser();
  const { props, url } = usePage<ReviewPageProps>();
  const initialStudent = useMemo(() => {
    const query = url.split("?")[1] ?? "";
    return new URLSearchParams(query).get("student") || "all";
  }, [url]);

  const [filter, setFilter] = useState<FilterType>("submitted");
  const [menteeFilter, setMenteeFilter] = useState<string>(initialStudent);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [formWarning, setFormWarning] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<{
    act: ReviewActivity;
    status: "approved" | "needs_correction";
  } | null>(null);

  const isSupervisor = role === "supervisor" || role === "org_admin";
  const assignedStudentIds = useMemo(
    () => props.students.map((student) => student.id),
    [props.students],
  );
  const assignedStudents = props.students;

  const scopedActivities = useMemo(
    () =>
      isSupervisor
        ? props.logbooks.filter((a) => assignedStudentIds.includes(a.student_id))
        : props.logbooks,
    [props.logbooks, isSupervisor, assignedStudentIds],
  );

  const studentScopedActivities = useMemo(
    () =>
      menteeFilter === "all"
        ? scopedActivities
        : scopedActivities.filter((a) => a.student_id === menteeFilter),
    [scopedActivities, menteeFilter],
  );

  const pendingCount = studentScopedActivities.filter((a) => a.status === "submitted").length;
  const approvedCount = studentScopedActivities.filter((a) => a.status === "approved").length;
  const correctionsCount = studentScopedActivities.filter(
    (a) => a.status === "needs_correction",
  ).length;

  const nameOf = useCallback(
    (id: string) => {
      const student = props.students.find((item) => item.id === id);
      return student?.full_name || student?.email || "Intern";
    },
    [props.students],
  );

  const rows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return studentScopedActivities
      .filter((a) => {
        if (a.status !== filter) return false;
        if (q) {
          const studentName = nameOf(a.student_id).toLowerCase();
          return (
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            studentName.includes(q) ||
            a.tools_used.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => ((a.submitted_at ?? "") < (b.submitted_at ?? "") ? 1 : -1));
  }, [studentScopedActivities, filter, searchQuery, nameOf]);

  const selectedActivity = useMemo(
    () => rows.find((a) => a.id === selectedId) ?? rows[0] ?? null,
    [rows, selectedId],
  );

  function handleRequestDecision(act: ReviewActivity, status: "approved" | "needs_correction") {
    const comment = (feedback[act.id] ?? "").trim();
    if (!comment) {
      const msg =
        status === "approved"
          ? "Please enter a Field Mentor comment before signing off on this logbook entry."
          : "Please provide specific revision instructions so the student knows what to correct.";
      setFormWarning(msg);
      toast.warning("Empty Form Warning", {
        description: msg,
      });
      return;
    }
    setFormWarning(null);
    setPendingDecision({ act, status });
  }

  function executeDecision(act: ReviewActivity, status: "approved" | "needs_correction") {
    const internName = nameOf(act.student_id);
    const comment = (feedback[act.id] ?? "").trim();

    router.patch(
      status === "approved" ? `/review/${act.id}/approve` : `/review/${act.id}/return`,
      { feedback: comment },
      {
        preserveScroll: true,
        onSuccess: () => {
          setFeedback((previous) => {
            const next = { ...previous };
            delete next[act.id];
            return next;
          });
          setFormWarning(null);
          toast.success(
            status === "approved" ? "Logbook Signed & Approved" : "Revision Requested",
            {
              description:
                status === "approved"
                  ? `Signed off "${act.title}" for ${internName}.`
                  : `Returned "${act.title}" to ${internName} with mentor comments.`,
            },
          );
        },
        onError: (errors) => {
          toast.error(Object.values(errors).join(" ") || "Unable to update this logbook.");
        },
      },
    );
  }

  const selectedStudent = selectedActivity
    ? props.students.find((student) => student.id === selectedActivity.student_id)
    : undefined;
  const selectedInitials = selectedActivity
    ? nameOf(selectedActivity.student_id)
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
    : "IN";

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── High-Contrast Page Banner Card ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs font-semibold">
                Field Supervision
              </Badge>
              <span className="text-xs text-muted-foreground">
                Logbook Sign-Off &amp; Mentor Comments
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Logbook Review Queue
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Inspect submitted student logbooks, verify shift hours and tools utilized, and write
              your official Field Mentor comment before signing off.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 rounded-lg text-xs font-medium"
            >
              <Link href="/students">Assigned Interns ({assignedStudents.length})</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 rounded-lg text-xs font-medium"
            >
              <Link href="/evaluations">Field Mentor Grading Form</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 3 Quiet KPI Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Pending Sign-Off"
          value={pendingCount}
          unit="entries"
          meta="Submitted logbooks awaiting your review"
        />
        <KpiCard
          label="Signed & Approved"
          value={approvedCount}
          unit="entries"
          meta="Verified with field mentor comments"
        />
        <KpiCard
          label="Revisions Requested"
          value={correctionsCount}
          unit="entries"
          meta="Returned to student for updates"
        />
      </div>

      {/* ── Unified Toolbar: Status Tabs + Search + Intern Filter ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardContent className="p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <Tabs value={filter} onValueChange={(v: string) => setFilter(v as FilterType)}>
            <TabsList className="h-9">
              <TabsTrigger value="submitted" className="text-xs gap-1.5">
                Pending
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {pendingCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs gap-1.5">
                Signed Off
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {approvedCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="needs_correction" className="text-xs gap-1.5">
                Revisions
                <span className="rounded-md bg-background/80 px-1.5 py-0.2 font-mono text-[11px] font-semibold">
                  {correctionsCount}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, student, or tool..."
                className="h-9 pl-8.5 text-xs"
              />
            </div>

            {isSupervisor && assignedStudents.length > 0 && (
              <Select value={menteeFilter} onValueChange={setMenteeFilter}>
                <SelectTrigger className="w-full sm:w-52 text-xs h-9">
                  <SelectValue placeholder="All Assigned Interns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Assigned Interns ({assignedStudents.length})
                  </SelectItem>
                  {assignedStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Single-Column Focused Workspace (Horizontal Submission Switcher + Full-Width Dossier) ── */}
      {rows.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title={
            filter === "submitted"
              ? "All Submitted Logbooks Are Signed Off"
              : "No Logbook Submissions Match This View"
          }
          description={
            filter === "submitted"
              ? "There are no pending student logbook entries awaiting your field mentor signature right now."
              : "Try switching between Pending, Signed Off, and Revisions or clearing your active search filter."
          }
          secondaryAction={
            menteeFilter !== "all" || searchQuery ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMenteeFilter("all");
                  setSearchQuery("");
                }}
                className="h-8 text-xs font-medium"
              >
                Reset Filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Top Horizontal Submission Selector Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Select Submission to Inspect ({rows.length})
              </span>
              <span className="text-[11px] text-muted-foreground">
                Showing {rows.findIndex((r) => r.id === selectedActivity?.id) + 1} of {rows.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {rows.map((a) => {
                const isSelected = selectedActivity?.id === a.id;
                const studentName = nameOf(a.student_id);
                const initials = studentName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2);

                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(a.id);
                      setFormWarning(null);
                    }}
                    className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-foreground bg-card shadow-xs"
                        : "border-border/60 bg-card/60 hover:border-border hover:bg-card"
                    }`}
                  >
                    <Avatar className="size-8 shrink-0 rounded-lg">
                      <AvatarFallback
                        className={`rounded-lg text-[11px] font-semibold ${
                          isSelected ? "bg-foreground text-background" : "bg-muted text-foreground"
                        }`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{studentName}</span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusPillClass(a.status)}`}
                        >
                          {a.status === "approved"
                            ? "Approved"
                            : a.status === "needs_correction"
                              ? "Revision"
                              : "Submitted"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-64">{a.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full-Width Logbook Dossier & Sign-Off Sheet */}
          {selectedActivity && (
            <Card className="rounded-xl border border-border/60 bg-card">
              {/* Top Student & Status Bar */}
              <CardHeader className="p-6 pb-4 border-b border-border/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-10 shrink-0 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-muted text-foreground font-semibold text-xs">
                        {selectedInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/students/${selectedActivity.student_id}`}
                          className="text-sm font-semibold text-foreground hover:text-[#589E10] dark:hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {nameOf(selectedActivity.student_id)}
                          <ChevronRight className="size-3.5 text-muted-foreground" />
                        </Link>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusPillClass(selectedActivity.status)}`}
                        >
                          {selectedActivity.status === "approved" && (
                            <CheckCircle2 className="size-3.5" />
                          )}
                          {statusLabel(selectedActivity.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {selectedStudent?.course || "BSc. Computer Science"}
                        {selectedStudent?.email ? ` · ${selectedStudent.email}` : ""}
                      </p>
                    </div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-medium shrink-0"
                  >
                    <Link href={`/students/${selectedActivity.student_id}`}>
                      Open Student Profile
                    </Link>
                  </Button>
                </div>

                {/* Activity Title & Compact Metadata Strip */}
                <div className="space-y-3 pt-1">
                  <CardTitle className="text-lg font-bold tracking-tight text-foreground leading-snug">
                    {selectedActivity.title}
                  </CardTitle>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-lg border border-border/50 bg-muted/25 p-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Log Date
                        </p>
                        <p className="font-mono font-medium text-foreground">
                          {selectedActivity.activity_date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Shift Hours
                        </p>
                        <p className="font-mono font-medium text-foreground">
                          {selectedActivity.arrival_time
                            ? `${selectedActivity.arrival_time} – ${selectedActivity.departure_time || "17:00"}`
                            : "08:30 – 17:00"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileSignature className="size-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Submitted On
                        </p>
                        <p className="font-mono font-medium text-foreground">
                          {selectedActivity.submitted_at
                            ? new Date(selectedActivity.submitted_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : selectedActivity.activity_date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Structured Body Sections */}
              <CardContent className="p-6 space-y-5 text-xs">
                {/* 1. Task Description */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    1. Daily Task &amp; Deliverable Summary
                  </p>
                  <p className="whitespace-pre-line text-sm text-foreground/90 leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>

                {/* 2. Tools & Technologies */}
                {selectedActivity.tools_used.length > 0 && (
                  <div className="space-y-2 border-t border-border/50 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Wrench className="size-3.5" />
                      2. Tools, Stack &amp; Equipment Utilized
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedActivity.tools_used.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-xs font-medium px-2.5 py-0.5"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Side-by-Side Challenges & Solutions */}
                {(selectedActivity.challenges || selectedActivity.solutions) && (
                  <div className="space-y-2 border-t border-border/50 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      3. Technical Challenges &amp; Applied Solutions
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/60 bg-background/60 p-3.5 space-y-1">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Challenge Encountered
                        </p>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {selectedActivity.challenges || "No blockers reported."}
                        </p>
                      </div>

                      <div className="rounded-lg border border-border/60 bg-background/60 p-3.5 space-y-1">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Resolution / Mitigation
                        </p>
                        <p className="text-xs text-foreground/90 leading-relaxed">
                          {selectedActivity.solutions || "Resolved during daily engineering sync."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Mentor Comment (if already reviewed) */}
                {(selectedActivity.supervisor_feedback ||
                  selectedActivity.status === "approved") && (
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                        <CheckCircle2 className="size-4 text-[#589E10] dark:text-[#9CE840]" />
                        {selectedActivity.status === "approved"
                          ? "APPROVED — Officially Signed Off by Field Mentor"
                          : "REVISION REQUESTED — Mentor Feedback"}
                      </span>
                      {selectedActivity.reviewed_at && (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {new Date(selectedActivity.reviewed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selectedActivity.supervisor_feedback ||
                        "Verified and approved by Field Mentor."}
                    </p>
                  </div>
                )}

                {/* 4. Field Mentor Sign-Off & Comment Box (With Empty Form Validation Warning) */}
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="mentor-feedback-box"
                      className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                    >
                      <MessageSquareText className="size-3.5" />
                      4. Field Mentor Comment &amp; Official Sign-Off *
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Required before sign-off or revision
                    </span>
                  </div>

                  {formWarning && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300"
                    >
                      <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <span>{formWarning}</span>
                    </div>
                  )}

                  <Textarea
                    id="mentor-feedback-box"
                    rows={3}
                    value={feedback[selectedActivity.id] ?? ""}
                    placeholder={`Write your field mentor comment or guidance for ${nameOf(selectedActivity.student_id)} (required)...`}
                    onChange={(e) => {
                      setFeedback({ ...feedback, [selectedActivity.id]: e.target.value });
                      if (formWarning && e.target.value.trim()) {
                        setFormWarning(null);
                      }
                    }}
                    className={`text-xs resize-none ${
                      formWarning ? "border-amber-500 focus-visible:ring-amber-500" : ""
                    }`}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <p className="text-[11px] text-muted-foreground">
                      Signing off records a verified timestamp in the compliance audit trail.
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestDecision(selectedActivity, "needs_correction")}
                        className="h-8 text-xs font-medium gap-1.5"
                      >
                        <RotateCcw className="size-3.5" />
                        Request Revision
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleRequestDecision(selectedActivity, "approved")}
                        className="h-8 text-xs font-semibold gap-1.5"
                      >
                        <Check className="size-3.5" />
                        Sign Off &amp; Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Yes / No Confirmation Dialog */}
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
              } "${pendingDecision.act.title}" (${nameOf(pendingDecision.act.student_id)})?`
            : ""
        }
        confirmLabel={
          pendingDecision?.status === "approved" ? "Yes, Sign & Approve" : "Yes, Request Revision"
        }
        cancelLabel="No, Cancel"
        onConfirm={() => {
          if (pendingDecision) {
            executeDecision(pendingDecision.act, pendingDecision.status);
            setPendingDecision(null);
          }
        }}
      />
    </div>
  );
}
