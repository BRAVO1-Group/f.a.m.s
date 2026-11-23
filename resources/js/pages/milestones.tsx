import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  Flag,
  Milestone,
  Plus,
  Sparkles,
  Target,
  Check,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppUser } from "@/lib/app-user";
import {
  getStoredSupervisors,
  milestones as defaultMilestones,
  profiles,
  uid,
  type MockMilestone,
} from "@/lib/mock-data";

type Filter = "all" | "in_progress" | "completed" | "upcoming";

export default function MilestonesPage() {
  const { userId, role } = useAppUser();
  const isSupervisor = role === "supervisor" || role === "org_admin";
  const [data, setData] = useState<MockMilestone[]>(defaultMilestones);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState("student-1");
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState("Phase 3: Integration");
  const [newWeek, setNewWeek] = useState("Weeks 7 - 9");
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [reviewMilestone, setReviewMilestone] = useState<MockMilestone | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState("");

  const assignedStudentIds = useMemo(() => {
    if (!isSupervisor) return [userId];
    const supervisors = getStoredSupervisors();
    const current =
      supervisors.find((s) => s.user_id === userId || s.id === userId) ||
      supervisors.find((s) => s.type === "organization");
    return current?.assigned_student_ids?.length ? current.assigned_student_ids : ["student-1"];
  }, [isSupervisor, userId]);

  const assignedStudents = useMemo(
    () => profiles.filter((p) => assignedStudentIds.includes(p.id)),
    [assignedStudentIds],
  );

  const scopedData = useMemo(() => {
    const base = isSupervisor
      ? data.filter((m) => assignedStudentIds.includes(m.student_id))
      : data.filter((m) => m.student_id === userId || m.student_id === "student-1");
    if (isSupervisor && selectedStudent !== "all") {
      return base.filter((m) => m.student_id === selectedStudent);
    }
    return base;
  }, [data, isSupervisor, assignedStudentIds, userId, selectedStudent]);

  const totalTasks = useMemo(() => scopedData.flatMap((m) => m.tasks).length, [scopedData]);
  const completedTasks = useMemo(
    () => scopedData.flatMap((m) => m.tasks).filter((t) => t.completed).length,
    [scopedData],
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filtered = useMemo(() => {
    if (filter === "all") return scopedData;
    if (filter === "in_progress") return scopedData.filter((m) => m.status === "in_progress");
    if (filter === "completed") return scopedData.filter((m) => m.status === "completed");
    if (filter === "upcoming")
      return scopedData.filter((m) => m.status === "not_started" || m.status === "under_review");
    return scopedData;
  }, [scopedData, filter]);

  function toggleTask(milestoneId: string, taskId: string) {
    setData((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        const nextTasks = m.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        );
        const allDone = nextTasks.every((t) => t.completed);
        const someDone = nextTasks.some((t) => t.completed);
        const nextStatus = allDone
          ? "completed"
          : someDone
            ? "in_progress"
            : m.status === "completed"
              ? "in_progress"
              : m.status;

        return {
          ...m,
          tasks: nextTasks,
          status: nextStatus,
          completed_at: allDone ? new Date().toISOString() : null,
        };
      }),
    );
    toast.success("Task milestone progress updated");
  }

  function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }

    const newMilestone: MockMilestone = {
      id: `m-${uid()}`,
      student_id: targetStudentId || assignedStudentIds[0] || "student-1",
      internship_id: "intern-1",
      phase: newPhase,
      title: newTitle.trim(),
      description: newDescription.trim() || "Internship weekly objective.",
      target_week: newWeek,
      status: "in_progress",
      skills: newSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tasks: [
        { id: `t-${uid()}`, title: "Initial technical research & scoping", completed: false },
        { id: `t-${uid()}`, title: "Core deliverable implementation", completed: false },
        { id: `t-${uid()}`, title: "Supervisor verification & review", completed: false },
      ],
      supervisor_feedback: null,
      completed_at: null,
    };

    setData((prev) => [...prev, newMilestone]);
    setNewTitle("");
    setNewDescription("");
    setNewSkills("");
    setDialogOpen(false);
    toast.success("New milestone goal added!");
  }

  function handleSaveFeedback(markCompleted: boolean) {
    if (!reviewMilestone) return;
    setData((prev) =>
      prev.map((m) => {
        if (m.id !== reviewMilestone.id) return m;
        return {
          ...m,
          supervisor_feedback: feedbackDraft.trim() || m.supervisor_feedback,
          status: markCompleted ? "completed" : m.status,
          completed_at: markCompleted ? new Date().toISOString() : m.completed_at,
        };
      }),
    );
    toast.success(markCompleted ? "Milestone signed off & completed" : "Mentor feedback saved");
    setReviewMilestone(null);
    setFeedbackDraft("");
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Milestones Roadmap
            </h1>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              12 Weeks
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured competency checkpoints, weekly sprint deliverables, and mentor sign-offs.
          </p>
        </div>

        {isSupervisor && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Milestone Goal</DialogTitle>
                <DialogDescription>
                  Define a learning milestone or deliverable for the assigned intern.
                </DialogDescription>
              </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              {assignedStudents.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="m-student">Assigned Intern</Label>
                  <Select value={targetStudentId} onValueChange={setTargetStudentId}>
                    <SelectTrigger id="m-student">
                      <SelectValue placeholder="Select intern" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedStudents.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="m-title">Milestone Title</Label>
                <Input
                  id="m-title"
                  placeholder="e.g., GraphQL API Integration & Caching"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="m-phase">Phase</Label>
                  <Input
                    id="m-phase"
                    placeholder="Phase 3: Integration"
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-week">Target Timeline</Label>
                  <Input
                    id="m-week"
                    placeholder="Weeks 7 - 9"
                    value={newWeek}
                    onChange={(e) => setNewWeek(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="m-desc">Description</Label>
                <Textarea
                  id="m-desc"
                  placeholder="Summarize the core learning objectives and deliverables..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="m-skills">Target Skills (comma separated)</Label>
                <Input
                  id="m-skills"
                  placeholder="React 19, TypeScript, Performance Profiling"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Milestone</Button>
              </DialogFooter>
            </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Progress Metric Card */}
      <Card className="border-border/60 bg-card shadow-none">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-4 md:items-center">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Curriculum Completion</span>
                <span className="font-mono font-bold text-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="mt-2.5 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {completedTasks} of {totalTasks} checklist deliverables validated across all phases.
              </p>
            </div>

            <div className="flex items-center gap-3 border-border/40 pl-0 md:border-l md:pl-6">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted text-foreground">
                <Target className="size-4.5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phases Active</p>
                <p className="text-lg font-bold text-foreground">
                  {scopedData.filter((m) => m.status === "in_progress").length} of {scopedData.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-border/40 pl-0 md:border-l md:pl-6">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted text-foreground">
                <CheckCircle2 className="size-4.5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed Milestones</p>
                <p className="text-lg font-bold text-foreground">
                  {scopedData.filter((m) => m.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Filter + Supervisor Student Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v: string) => setFilter(v as Filter)}>
          <TabsList className="grid w-full grid-cols-2 md:inline-flex md:w-auto">
            <TabsTrigger value="all" className="w-full px-2 text-xs md:w-auto md:px-3 md:text-sm">
              All Phases ({scopedData.length})
            </TabsTrigger>
            <TabsTrigger
              value="in_progress"
              className="w-full px-2 text-xs md:w-auto md:px-3 md:text-sm"
            >
              In Progress ({scopedData.filter((m) => m.status === "in_progress").length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="w-full px-2 text-xs md:w-auto md:px-3 md:text-sm"
            >
              Completed ({scopedData.filter((m) => m.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="w-full px-2 text-xs md:w-auto md:px-3 md:text-sm"
            >
              Upcoming (
              {
                scopedData.filter((m) => m.status === "not_started" || m.status === "under_review")
                  .length
              }
              )
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isSupervisor && assignedStudents.length > 1 && (
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Filter by intern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assigned Interns</SelectItem>
              {assignedStudents.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Milestones List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((item) => {
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "in_progress";

          function handleSaveFeedback(markCompleted: boolean) {
    if (!reviewMilestone) return;
    setData((prev) =>
      prev.map((m) => {
        if (m.id !== reviewMilestone.id) return m;
        return {
          ...m,
          supervisor_feedback: feedbackDraft.trim() || m.supervisor_feedback,
          status: markCompleted ? "completed" : m.status,
          completed_at: markCompleted ? new Date().toISOString() : m.completed_at,
        };
      }),
    );
    toast.success(markCompleted ? "Milestone signed off & completed" : "Mentor feedback saved");
    setReviewMilestone(null);
    setFeedbackDraft("");
  }

  return (
            <Card
              key={item.id}
              className="flex flex-col border border-border/60 bg-card shadow-none"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.phase}
                    </span>
                    <CardTitle className="mt-1 text-lg font-semibold">{item.title}</CardTitle>
                  </div>
                  <Badge
                    variant={isCompleted ? "secondary" : isInProgress ? "default" : "outline"}
                  >
                    {isCompleted ? "Completed" : isInProgress ? "Active Sprint" : "Upcoming"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>{item.target_week}</span>
                </div>
                <CardDescription className="pt-2 text-sm text-foreground/80">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4 pt-1">
                {/* Skills tags */}
                {item.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-border/60 bg-accent/40 px-2 py-0.5 text-[11px] font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tasks checklist */}
                <div className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Required Deliverables ({item.tasks.filter((t) => t.completed).length}/
                    {item.tasks.length})
                  </p>
                  <div className="space-y-2 pt-1">
                    {item.tasks.map((task) => {
                      const rowContent = (
                        <>
                          <div
                            className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                              task.completed
                                ? "border-foreground bg-foreground text-background"
                                : "border-muted-foreground/40 bg-background"
                            }`}
                          >
                            {task.completed && <Check className="size-3" />}
                          </div>
                          <span
                            className={`flex-1 leading-relaxed ${
                              task.completed
                                ? "line-through text-muted-foreground"
                                : "text-foreground font-medium"
                            }`}
                          >
                            {task.title}
                          </span>
                        </>
                      );

                      return isSupervisor ? (
                        <div key={task.id} className="flex w-full items-start gap-2.5 text-left text-xs">
                          {rowContent}
                        </div>
                      ) : (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleTask(item.id, task.id)}
                          className="flex w-full items-start gap-2.5 text-left text-xs transition-opacity hover:opacity-80 cursor-pointer"
                        >
                          {rowContent}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Supervisor Feedback */}
                {item.supervisor_feedback && (
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <Sparkles className="size-3.5 text-muted-foreground" />
                      <span>Mentor Feedback</span>
                    </div>
                    <p className="mt-1 text-muted-foreground leading-relaxed">
                      &ldquo;{item.supervisor_feedback}&rdquo;
                    </p>
                  </div>
                )}

                {isSupervisor && (
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      variant={isCompleted ? "outline" : "default"}
                      className="text-xs"
                      onClick={() => {
                        setReviewMilestone(item);
                        setFeedbackDraft(item.supervisor_feedback ?? "");
                      }}
                    >
                      {isCompleted ? "Edit Feedback" : "Sign Off / Feedback"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Supervisor Sign-Off & Feedback Dialog */}
      <Dialog
        open={Boolean(reviewMilestone)}
        onOpenChange={(open) => {
          if (!open) {
            setReviewMilestone(null);
            setFeedbackDraft("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Milestone Sign-Off & Feedback</DialogTitle>
            <DialogDescription>
              {reviewMilestone?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="m-feedback">Mentor Feedback</Label>
              <Textarea
                id="m-feedback"
                rows={3}
                placeholder="Provide constructive feedback or sign-off notes..."
                value={feedbackDraft}
                onChange={(e) => setFeedbackDraft(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleSaveFeedback(false)}>
              Save Feedback
            </Button>
            <Button type="button" onClick={() => handleSaveFeedback(true)}>
              Sign Off & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
