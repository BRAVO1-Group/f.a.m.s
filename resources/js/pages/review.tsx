import { useState, useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import {
  Check,
  MessageSquare,
  RotateCcw,
  Building2,
  Filter,
  Users,
  CheckCircle2,
  Lock,
  ShieldCheck,
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

const routeApi = getRouteApi("/_authenticated/review");

type FilterType = "submitted" | "approved" | "needs_correction";

export default function ReviewPage() {
  const { userId, role } = useAppUser();
  const search = routeApi.useSearch();
  const [filter, setFilter] = useState<FilterType>("submitted");
  const [menteeFilter, setMenteeFilter] = useState<string>(search.student || "all");
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = () => {
      setActivitiesList(getStoredActivities());
    };
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  const isSupervisor = role === "supervisor";
  const supervisorsList = getStoredSupervisors();
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];

  // Scoped student IDs for host org supervisor (James Otieno supervises Alice Wanjiku & Kevin Kiprono at TechCorp)
  const assignedStudentIds =
    currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
      ? currentSupervisor.assigned_student_ids
      : ["student-1", "student-4"];

  // Filter activities strictly to assigned students if supervisor
  const scopedActivities = isSupervisor
    ? activitiesList.filter((a) => assignedStudentIds.includes(a.student_id))
    : activitiesList;

  const menteeFiltered = scopedActivities.filter((a) => {
    if (menteeFilter !== "all" && a.student_id !== menteeFilter) return false;
    return a.status === filter;
  });

  const rows = menteeFiltered.sort((a, b) =>
    (a.submitted_at ?? "") < (b.submitted_at ?? "") ? 1 : -1,
  );

  const pendingCount = scopedActivities.filter((a) => a.status === "submitted").length;
  const approvedCount = scopedActivities.filter((a) => a.status === "approved").length;
  const correctionsCount = scopedActivities.filter((a) => a.status === "needs_correction").length;

  const nameOf = (id: string) => {
    const p = profiles.find((s) => s.id === id);
    return p?.full_name || p?.email || "Intern";
  };

  function decide(id: string, status: "approved" | "needs_correction") {
    const target = activitiesList.find((a) => a.id === id);
    const internName = target ? nameOf(target.student_id) : "Intern";
    const comment =
      feedback[id]?.trim() ||
      (status === "approved"
        ? "Verified and signed off by Host Organization Mentor (TechCorp Kenya Ltd)."
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

  return (
    <div className="space-y-6 antialiased">
      {/* ── Security & Scoping Notice for Host Org Supervisor ── */}
      {isSupervisor && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">
                  Host Organization Review Queue
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
                Review queue scoped strictly to your assigned student mentees:{" "}
                <strong>Alice Wanjiku</strong> and <strong>Kevin Kiprono</strong>. You have approval
                authority to sign off on technical logbooks or request revisions.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="size-3.5" /> Direct Sign-off Authority
            </span>
          </div>
        </div>
      )}

      {/* ── Page Header & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Approve daily activities, request revisions, and provide engineering feedback to your
            interns.
          </p>
        </div>

        {isSupervisor && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Mentee:</span>
            <Select value={menteeFilter} onValueChange={setMenteeFilter}>
              <SelectTrigger className="w-[220px] text-xs h-9">
                <SelectValue placeholder="All Mentees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assigned Mentees (2)</SelectItem>
                <SelectItem value="student-1">Alice Wanjiku (Software Eng.)</SelectItem>
                <SelectItem value="student-4">Kevin Kiprono (Cybersecurity)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* ── Status Tabs ── */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
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

      {/* ── Submission Feed ── */}
      {rows.length === 0 ? (
        <Card className="shadow-card border-dashed">
          <CardContent className="p-12 text-center text-sm text-muted-foreground space-y-2">
            <CheckCircle2 className="mx-auto size-10 text-muted-foreground/60" />
            <p className="font-semibold text-foreground">No submissions found</p>
            <p className="text-xs text-muted-foreground">
              {filter === "submitted"
                ? "All activities submitted by your assigned mentees have been reviewed."
                : "No activities currently match this status filter."}
            </p>
            {menteeFilter !== "all" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setMenteeFilter("all")}
                className="text-xs mt-2"
              >
                Clear Mentee Filter
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {rows.map((a) => (
            <Card
              key={a.id}
              className="shadow-card border-border/80 hover:border-primary/30 transition"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base font-semibold">{a.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className="text-xs font-medium border-primary/30 text-primary"
                      >
                        {nameOf(a.student_id)}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs mt-0.5">
                      Logged Date: {a.activity_date}
                      {a.arrival_time &&
                        ` • Hours: ${a.arrival_time} - ${a.departure_time || "17:00"}`}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      a.status === "approved"
                        ? "default"
                        : a.status === "needs_correction"
                          ? "destructive"
                          : "secondary"
                    }
                    className={`text-xs capitalize ${
                      a.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : a.status === "needs_correction"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                          : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {a.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                <div>
                  <span className="font-semibold text-foreground block mb-1">
                    Task Description:
                  </span>
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {a.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground font-medium">Tools used:</span>
                  {a.tools_used.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>

                {a.challenges ? (
                  <div className="rounded-lg bg-muted/40 p-2.5 space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Challenges Encountered:{" "}
                      </span>
                      {a.challenges}
                    </p>
                    {a.solutions && (
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Applied Solutions: </span>
                        {a.solutions}
                      </p>
                    )}
                  </div>
                ) : null}

                {a.supervisor_feedback ? (
                  <div
                    className={`rounded-lg p-3 text-xs border ${
                      a.status === "approved"
                        ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200"
                        : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200"
                    }`}
                  >
                    <span className="font-semibold block mb-0.5">
                      {a.status === "approved"
                        ? "✓ Verified Mentor Feedback:"
                        : "⚠ Requested Revision Details:"}
                    </span>
                    <p className="leading-relaxed">{a.supervisor_feedback}</p>
                    {a.reviewed_at && (
                      <span className="text-[10px] opacity-75 block mt-1">
                        Reviewed: {new Date(a.reviewed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : null}

                {a.status !== "approved" ? (
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <MessageSquare className="size-3.5 text-primary" />
                      Mentor Guidance / Revision Note (Optional)
                    </div>
                    <Textarea
                      rows={2}
                      value={feedback[a.id] ?? ""}
                      placeholder="Add guidance, commendations, or specific instructions for revision..."
                      onChange={(e) => setFeedback({ ...feedback, [a.id]: e.target.value })}
                      className="text-xs resize-none"
                    />
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => decide(a.id, "approved")}
                        className="h-8 text-xs font-semibold bg-primary text-primary-foreground"
                      >
                        <Check className="mr-1.5 size-3.5" /> Sign Off & Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decide(a.id, "needs_correction")}
                        className="h-8 text-xs font-semibold border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        <RotateCcw className="mr-1.5 size-3.5" /> Request Revision
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
