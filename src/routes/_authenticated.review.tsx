import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Check,
  CheckCircle2,
  FileCheck2,
  MessageSquare,
  Plus,
  RotateCcw,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppUser } from "@/lib/app-user";
import {
  activities,
  evaluations as defaultEvaluations,
  profiles,
  uid,
  type MockEvaluation,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/review")({
  head: () => ({
    meta: [
      { title: "Review Queue & Evaluations — InternTrack" },
      {
        name: "description",
        content:
          "Review intern activity reports, request revisions, and conduct formal rubric evaluations.",
      },
      { property: "og:title", content: "Review Queue & Evaluations — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReviewPage,
});

type MainTab = "queue" | "evaluations";
type ActivityFilter = "submitted" | "approved" | "needs_correction";

function calculateGrade(score: number): string {
  if (score >= 4.7) return "A+ (Outstanding)";
  if (score >= 4.3) return "A (Distinction)";
  if (score >= 3.8) return "A- (Merit)";
  if (score >= 3.3) return "B+ (Proficient)";
  if (score >= 2.8) return "B (Satisfactory)";
  return "C (Needs Revision)";
}

function ReviewPage() {
  const { userId, name } = useAppUser();
  const [mainTab, setMainTab] = useState<MainTab>("queue");
  const [filter, setFilter] = useState<ActivityFilter>("submitted");
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [evalList, setEvalList] = useState<MockEvaluation[]>(defaultEvaluations);

  // Evaluation Form State
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState("student-1");
  const [evalPeriod, setEvalPeriod] = useState<"Mid-Term" | "Final Assessment">("Mid-Term");
  const [ratingTech, setRatingTech] = useState(5);
  const [ratingPunct, setRatingPunct] = useState(5);
  const [ratingComm, setRatingComm] = useState(4);
  const [ratingProblem, setRatingProblem] = useState(5);
  const [recommendation, setRecommendation] = useState<
    "full_time_offer" | "commendation" | "satisfactory" | "needs_improvement"
  >("full_time_offer");
  const [evalComments, setEvalComments] = useState("");
  const [aiDrafting, setAiDrafting] = useState(false);

  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const currentAverage = ((ratingTech + ratingPunct + ratingComm + ratingProblem) / 4).toFixed(1);
  const currentGrade = calculateGrade(Number(currentAverage));

  const rows = activities
    .filter((a) => a.status === filter)
    .sort((a, b) => ((a.submitted_at ?? "") < (b.submitted_at ?? "") ? 1 : -1));

  const nameOf = (id: string) => {
    const p = profiles.find((s) => s.id === id);
    return p?.full_name || p?.email || "Intern";
  };

  function decide(id: string, status: "approved" | "needs_correction") {
    const idx = activities.findIndex((a) => a.id === id);
    if (idx >= 0) {
      const a = activities[idx]!;
      activities[idx] = {
        id: a.id,
        student_id: a.student_id,
        internship_id: a.internship_id,
        activity_date: a.activity_date,
        arrival_time: a.arrival_time,
        departure_time: a.departure_time,
        title: a.title,
        description: a.description,
        tools_used: a.tools_used,
        skills_gained: a.skills_gained,
        challenges: a.challenges,
        solutions: a.solutions,
        submitted_at: a.submitted_at,
        status,
        supervisor_feedback: feedback[id]?.trim() || null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      };
    }
    setFeedback((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    refresh();
    toast.success(status === "approved" ? "Activity approved" : "Correction requested");
  }

  async function handleAiDraftAppraisal() {
    setAiDrafting(true);
    await new Promise((r) => setTimeout(r, 1000));
    const student = nameOf(targetStudentId);
    const draftText = `${student} has demonstrated exceptional diligence throughout the ${evalPeriod} internship phase. Scoring an overall ${currentAverage}/5.0 (${currentGrade}), their technical execution and initiative have added measurable value to sprint commitments. Attendance and collaboration have been consistently reliable. Highly recommended for future advanced placement.`;
    setEvalComments(draftText);
    setAiDrafting(false);
    toast.success("AI appraisal note generated!");
  }

  function handleSaveEvaluation(e: React.FormEvent) {
    e.preventDefault();
    const newEval: MockEvaluation = {
      id: `eval-${uid()}`,
      student_id: targetStudentId,
      supervisor_id: userId,
      internship_id: "intern-1",
      evaluation_date: new Date().toISOString().slice(0, 10),
      period: evalPeriod,
      ratings: {
        technical: ratingTech,
        punctuality: ratingPunct,
        communication: ratingComm,
        problem_solving: ratingProblem,
      },
      overall_score: Number(currentAverage),
      grade: currentGrade,
      recommendation,
      comments:
        evalComments.trim() ||
        `${nameOf(targetStudentId)} has performed consistently across core internship milestones.`,
      supervisor_name: name || "Senior Supervisor",
    };

    setEvalList((prev) => [newEval, ...prev]);
    setEvalDialogOpen(false);
    setEvalComments("");
    toast.success("Formal evaluation rubric saved!");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Supervisor Review & Appraisals</h1>
          <p className="text-sm text-muted-foreground">
            Approve daily activities, provide guidance, and record formal competency evaluations.
          </p>
        </div>

        {mainTab === "evaluations" && (
          <Dialog open={evalDialogOpen} onOpenChange={setEvalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Conduct New Evaluation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="size-5 text-amber-500" />
                  Intern Performance Evaluation Rubric
                </DialogTitle>
                <DialogDescription>
                  Grade intern competency across four core pillars to generate an academic
                  recommendation.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveEvaluation} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="eval-student">Intern</Label>
                    <Select value={targetStudentId} onValueChange={setTargetStudentId}>
                      <SelectTrigger id="eval-student">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student-1">Alice Wanjiku (CS/2021/0042)</SelectItem>
                        <SelectItem value="student-2">Brian Kiprop (NET/2021/0104)</SelectItem>
                        <SelectItem value="student-3">Carol Achieng (DS/2021/0088)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="eval-period">Assessment Stage</Label>
                    <Select
                      value={evalPeriod}
                      onValueChange={(v) => setEvalPeriod(v as "Mid-Term" | "Final Assessment")}
                    >
                      <SelectTrigger id="eval-period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mid-Term">Mid-Term Assessment</SelectItem>
                        <SelectItem value="Final Assessment">Final Capstone Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rubric Score Pillars */}
                <div className="space-y-3 rounded-lg border border-border/80 bg-accent/15 p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Competency Dimensions (1 to 5 Stars)
                  </p>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Technical Execution:</span>
                        <span className="font-bold text-primary">{ratingTech} / 5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRatingTech(n)}
                            className={`flex-1 rounded py-1 text-xs font-semibold transition-colors ${
                              ratingTech >= n
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            ★ {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Punctuality & Attendance:</span>
                        <span className="font-bold text-primary">{ratingPunct} / 5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRatingPunct(n)}
                            className={`flex-1 rounded py-1 text-xs font-semibold transition-colors ${
                              ratingPunct >= n
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            ★ {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Communication & Teamwork:</span>
                        <span className="font-bold text-primary">{ratingComm} / 5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRatingComm(n)}
                            className={`flex-1 rounded py-1 text-xs font-semibold transition-colors ${
                              ratingComm >= n
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            ★ {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Initiative & Problem Solving:</span>
                        <span className="font-bold text-primary">{ratingProblem} / 5</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRatingProblem(n)}
                            className={`flex-1 rounded py-1 text-xs font-semibold transition-colors ${
                              ratingProblem >= n
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            ★ {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Calculated Overall Score Preview */}
                  <div className="flex items-center justify-between border-t border-border/80 pt-2 text-xs">
                    <span className="font-medium text-foreground">Calculated Grade:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold text-primary">
                        Score: {currentAverage} / 5.0
                      </Badge>
                      <Badge className="bg-emerald-600 text-white font-semibold">
                        {currentGrade}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="eval-rec">Institutional Recommendation</Label>
                  <Select
                    value={recommendation}
                    onValueChange={(v) =>
                      setRecommendation(
                        v as
                          "full_time_offer" | "commendation" | "satisfactory" | "needs_improvement",
                      )
                    }
                  >
                    <SelectTrigger id="eval-rec">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time_offer">
                        🌟 Strongly Recommend for Full-Time Offer
                      </SelectItem>
                      <SelectItem value="commendation">🎖️ High Academic Commendation</SelectItem>
                      <SelectItem value="satisfactory">
                        ✅ Satisfactory Internship Completion
                      </SelectItem>
                      <SelectItem value="needs_improvement">
                        ⚠️ Remedial Training Recommended
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="eval-comments">Appraisal Narrative & Comments</Label>
                    <button
                      type="button"
                      onClick={handleAiDraftAppraisal}
                      disabled={aiDrafting}
                      className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      <Sparkles className="size-3 text-amber-500" />
                      {aiDrafting ? "Drafting note..." : "✨ AI Draft Appraisal"}
                    </button>
                  </div>
                  <Textarea
                    id="eval-comments"
                    rows={3}
                    placeholder="Provide specific feedback on student strengths, code contributions, and workplace reliability..."
                    value={evalComments}
                    onChange={(e) => setEvalComments(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEvalDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Finalize & Sign Appraisal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Primary Section Switcher */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setMainTab("queue")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            mainTab === "queue"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>Daily Activity Queue</span>
          {activities.filter((a) => a.status === "submitted").length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {activities.filter((a) => a.status === "submitted").length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setMainTab("evaluations")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            mainTab === "evaluations"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="size-4" />
          <span>Formal Evaluations</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-foreground">
            {evalList.length}
          </span>
        </button>
      </div>

      {mainTab === "queue" ? (
        <>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as ActivityFilter)}>
            <TabsList>
              <TabsTrigger value="submitted">
                Pending ({activities.filter((a) => a.status === "submitted").length})
              </TabsTrigger>
              <TabsTrigger value="needs_correction">
                Corrections ({activities.filter((a) => a.status === "needs_correction").length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({activities.filter((a) => a.status === "approved").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {rows.length === 0 ? (
            <Card className="shadow-xs">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No entries found in this queue right now.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rows.map((a) => (
                <Card key={a.id} className="shadow-xs">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{a.title}</CardTitle>
                        <CardDescription>
                          {nameOf(a.student_id)} · {a.activity_date}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {a.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="whitespace-pre-line text-muted-foreground">{a.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {a.tools_used.map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    {a.challenges ? (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Challenges: </span>
                        {a.challenges}
                      </p>
                    ) : null}
                    {a.solutions ? (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Solutions: </span>
                        {a.solutions}
                      </p>
                    ) : null}

                    {a.status === "approved" && a.supervisor_feedback ? (
                      <p className="rounded-lg bg-muted p-3 text-xs">
                        <span className="font-medium text-foreground">Your feedback: </span>
                        {a.supervisor_feedback}
                      </p>
                    ) : null}

                    {a.status !== "approved" ? (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <MessageSquare className="size-3.5" /> Mentor Feedback (optional)
                        </div>
                        <Textarea
                          rows={2}
                          value={feedback[a.id] ?? ""}
                          placeholder="Comments or recommendations for the student…"
                          onChange={(e) => setFeedback({ ...feedback, [a.id]: e.target.value })}
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" onClick={() => decide(a.id, "approved")}>
                            <Check className="size-4" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => decide(a.id, "needs_correction")}
                          >
                            <RotateCcw className="size-4" /> Request correction
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Formal Evaluations Tab */
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {evalList.map((item) => (
              <Card key={item.id} className="border-border/60 shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">
                          {nameOf(item.student_id)}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs font-medium">
                          {item.period}
                        </Badge>
                      </div>
                      <CardDescription className="pt-0.5 text-xs">
                        Evaluated on {item.evaluation_date} by {item.supervisor_name}
                      </CardDescription>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        {item.grade}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Score: {item.overall_score} / 5.0
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 text-xs">
                  {/* Rating Bars */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/40 p-2.5">
                    <div>
                      <span className="text-muted-foreground">Technical:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {item.ratings.technical}/5 ★
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Punctuality:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {item.ratings.punctuality}/5 ★
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Teamwork:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {item.ratings.communication}/5 ★
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Initiative:</span>{" "}
                      <span className="font-semibold text-foreground">
                        {item.ratings.problem_solving}/5 ★
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-foreground">Recommendation: </span>
                    <Badge variant="secondary" className="capitalize text-[11px]">
                      {item.recommendation.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <p className="rounded-md border border-border/40 bg-background p-2.5 leading-relaxed text-muted-foreground italic">
                    "{item.comments}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
