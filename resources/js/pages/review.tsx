import { useState, useEffect, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import {
  Check,
  RotateCcw,
  CheckCircle2,
  Clock,
  Calendar,
  Wrench,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppUser } from "@/lib/app-user";
import {
  profiles,
  getStoredActivities,
  getStoredSupervisors,
  approveOrCorrectActivity,
  type MockActivity,
} from "@/lib/mock-data";

type FilterType = "submitted" | "approved" | "needs_correction";

function statusBadgeClass(status: MockActivity["status"]) {
  if (status === "approved") {
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  }
  if (status === "needs_correction") {
    return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
  }
  return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
}

export default function ReviewPage() {
  const { userId, role } = useAppUser();
  const { url } = usePage();
  const initialStudent = useMemo(() => {
    const query = url.split("?")[1] ?? "";
    return new URLSearchParams(query).get("student") || "all";
  }, [url]);
  const [filter, setFilter] = useState<FilterType>("submitted");
  const [menteeFilter, setMenteeFilter] = useState<string>(initialStudent);
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = () => {
      setActivitiesList(getStoredActivities());
    };
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  const isSupervisor = role === "supervisor" || role === "org_admin";
  const supervisorsList = getStoredSupervisors();
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];

  const assignedStudentIds = useMemo(
    () =>
      currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
        ? currentSupervisor.assigned_student_ids
        : ["student-1", "student-4"],
    [currentSupervisor],
  );

  const assignedStudents = useMemo(
    () => profiles.filter((p) => assignedStudentIds.includes(p.id)),
    [assignedStudentIds],
  );

  const scopedActivities = useMemo(
    () =>
      isSupervisor
        ? activitiesList.filter((a) => assignedStudentIds.includes(a.student_id))
        : activitiesList,
    [activitiesList, isSupervisor, assignedStudentIds],
  );

  const rows = useMemo(() => {
    return scopedActivities
      .filter((a) => {
        if (menteeFilter !== "all" && a.student_id !== menteeFilter) return false;
        return a.status === filter;
      })
      .sort((a, b) => ((a.submitted_at ?? "") < (b.submitted_at ?? "") ? 1 : -1));
  }, [scopedActivities, menteeFilter, filter]);

  const selectedActivity = useMemo(
    () => rows.find((a) => a.id === selectedId) ?? rows[0] ?? null,
    [rows, selectedId],
  );

  const pendingCount = scopedActivities.filter((a) => a.status === "submitted").length;
  const approvedCount = scopedActivities.filter((a) => a.status === "approved").length;
  const correctionsCount = scopedActivities.filter((a) => a.status === "needs_correction").length;

  const profileOf = (id: string) => profiles.find((s) => s.id === id);
  const nameOf = (id: string) => {
    const p = profileOf(id);
    return p?.full_name || p?.email || "Intern";
  };

  function decide(id: string, status: "approved" | "needs_correction") {
    const target = activitiesList.find((a) => a.id === id);
    const internName = target ? nameOf(target.student_id) : "Intern";
    const comment =
      feedback[id]?.trim() ||
      (status === "approved"
        ? `Verified and signed off by ${currentSupervisor?.full_name ?? "Supervisor"}.`
        : "Please revise this activity log with additional technical detail.");

    approveOrCorrectActivity(id, status, userId, comment);
    setActivitiesList(getStoredActivities());

    setFeedback((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    toast.success(status === "approved" ? "Activity Approved" : "Correction Requested", {
      description:
        status === "approved"
          ? `Submission signed off for ${internName}.`
          : `Sent revision note to ${internName}.`,
    });
  }

  const selectedStudent = selectedActivity ? profileOf(selectedActivity.student_id) : undefined;

  return (
    <div className="space-y-6 antialiased">
      {/* ── Page Header & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Select a student submission to inspect its full logbook details and sign off.
          </p>
        </div>

        {isSupervisor && assignedStudents.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Intern:</span>
            <Select value={menteeFilter} onValueChange={setMenteeFilter}>
              <SelectTrigger className="w-[220px] text-xs h-9">
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
          </div>
        )}
      </div>

      {/* ── Status Tabs ── */}
      <Tabs value={filter} onValueChange={(v: string) => setFilter(v as FilterType)}>
        <TabsList className="h-9">
          <TabsTrigger value="submitted" className="text-xs flex items-center gap-1.5">
            Pending
            {pendingCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs flex items-center gap-1.5">
            Approved
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {approvedCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="needs_correction" className="text-xs flex items-center gap-1.5">
            Revisions Requested
            {correctionsCount > 0 && (
              <span className="rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 text-[10px] font-semibold">
                {correctionsCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ── Master-Detail Submission Workspace ── */}
      {rows.length === 0 ? (
        <Card className="border-border/60 border-dashed shadow-none">
          <CardContent className="p-12 text-center text-sm text-muted-foreground space-y-2">
            <CheckCircle2 className="mx-auto size-10 text-muted-foreground/60" />
            <p className="font-semibold text-foreground">No submissions found</p>
            <p className="text-xs text-muted-foreground">
              {filter === "submitted"
                ? "All activities submitted by your assigned interns have been reviewed."
                : "No activities currently match this status filter."}
            </p>
            {menteeFilter !== "all" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMenteeFilter("all")}
                className="text-xs mt-2"
              >
                Clear Intern Filter
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-12 items-start">
          {/* Left: Submission List */}
          <div className="lg:col-span-5 space-y-2">
            {rows.map((a) => {
              const isSelected = selectedActivity?.id === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedId(a.id)}
                  className={`w-full text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/60 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
                      {a.title}
                    </p>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] capitalize ${statusBadgeClass(a.status)}`}
                    >
                      {a.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">{nameOf(a.student_id)}</span>
                    <span>
                      {a.activity_date}
                      {a.arrival_time ? ` · ${a.arrival_time}–${a.departure_time || "17:00"}` : ""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Submission Inspector */}
          {selectedActivity && (
            <Card className="lg:col-span-7 border-border/60 shadow-none lg:sticky lg:top-16">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold leading-snug">
                      {selectedActivity.title}
                    </CardTitle>
                    <CardDescription className="text-xs flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-medium text-foreground">
                        {nameOf(selectedActivity.student_id)}
                      </span>
                      {selectedStudent?.course && <span>{selectedStudent.course}</span>}
                      {selectedStudent?.email && (
                        <span className="font-mono">{selectedStudent.email}</span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs capitalize ${statusBadgeClass(selectedActivity.status)}`}
                  >
                    {selectedActivity.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {selectedActivity.activity_date}
                  </span>
                  {selectedActivity.arrival_time && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {selectedActivity.arrival_time} – {selectedActivity.departure_time || "17:00"}
                    </span>
                  )}
                  {selectedActivity.submitted_at && (
                    <span>
                      Submitted {new Date(selectedActivity.submitted_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs">
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">Task Description</h3>
                  <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>

                {selectedActivity.tools_used.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5 inline-flex items-center gap-1.5">
                      <Wrench className="size-3.5 text-muted-foreground" />
                      Tools &amp; Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedActivity.tools_used.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs font-normal">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedActivity.challenges && (
                  <div className="rounded-lg border border-border/60 bg-muted/40 p-3 space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <AlertTriangle className="size-3.5 text-amber-500" />
                      Challenges &amp; Solutions
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Challenges: </span>
                      {selectedActivity.challenges}
                    </p>
                    {selectedActivity.solutions && (
                      <p className="text-muted-foreground leading-relaxed">
                        <span className="font-medium text-foreground">Solutions: </span>
                        {selectedActivity.solutions}
                      </p>
                    )}
                  </div>
                )}

                {selectedActivity.supervisor_feedback && (
                  <div
                    className={`rounded-lg p-3 border ${
                      selectedActivity.status === "approved"
                        ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200"
                        : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                    }`}
                  >
                    <span className="font-semibold block mb-1">
                      {selectedActivity.status === "approved"
                        ? "Verified Mentor Feedback"
                        : "Requested Revision Details"}
                    </span>
                    <p className="leading-relaxed">{selectedActivity.supervisor_feedback}</p>
                    {selectedActivity.reviewed_at && (
                      <span className="text-[11px] opacity-75 block mt-1">
                        Reviewed {new Date(selectedActivity.reviewed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}

                {selectedActivity.status !== "approved" && (
                  <div className="space-y-2.5 pt-3 border-t border-border/60">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <MessageSquare className="size-3.5 text-primary" />
                      Mentor Feedback / Revision Note
                    </div>
                    <Textarea
                      rows={3}
                      value={feedback[selectedActivity.id] ?? ""}
                      placeholder="Add guidance, commendations, or specific instructions for revision..."
                      onChange={(e) =>
                        setFeedback({ ...feedback, [selectedActivity.id]: e.target.value })
                      }
                      className="text-xs resize-none"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => decide(selectedActivity.id, "approved")}
                        className="h-8 text-xs font-semibold"
                      >
                        <Check className="mr-1.5 size-3.5" /> Sign Off &amp; Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decide(selectedActivity.id, "needs_correction")}
                        className="h-8 text-xs font-semibold border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        <RotateCcw className="mr-1.5 size-3.5" /> Request Revision
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
