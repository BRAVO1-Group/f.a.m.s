import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
import { useAppUser } from "@/lib/app-user";
import { milestones as defaultMilestones, uid, type MockMilestone } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/milestones")({
  head: () => ({
    meta: [
      { title: "Milestones Roadmap — InternTrack" },
      {
        name: "description",
        content: "Track internship phases, weekly deliverables, and mentor milestones.",
      },
      { property: "og:title", content: "Milestones Roadmap — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MilestonesPage,
});

type Filter = "all" | "in_progress" | "completed" | "upcoming";

function MilestonesPage() {
  const { role } = useAppUser();
  const [data, setData] = useState<MockMilestone[]>(defaultMilestones);
  const [filter, setFilter] = useState<Filter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState("Phase 3: Integration");
  const [newWeek, setNewWeek] = useState("Weeks 7 - 9");
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState("");

  const totalTasks = useMemo(() => data.flatMap((m) => m.tasks).length, [data]);
  const completedTasks = useMemo(
    () => data.flatMap((m) => m.tasks).filter((t) => t.completed).length,
    [data],
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filtered = useMemo(() => {
    if (filter === "all") return data;
    if (filter === "in_progress") return data.filter((m) => m.status === "in_progress");
    if (filter === "completed") return data.filter((m) => m.status === "completed");
    if (filter === "upcoming")
      return data.filter((m) => m.status === "not_started" || m.status === "under_review");
    return data;
  }, [data, filter]);

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
      student_id: "student-1",
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight">Milestones Roadmap</h1>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
              12 Weeks
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Structured competency checkpoints, weekly sprint deliverables, and mentor sign-offs.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Milestone Goal</DialogTitle>
              <DialogDescription>
                Define a learning milestone or project deliverable for your internship plan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGoal} className="space-y-4">
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
      </div>

      {/* Progress Metric Card */}
      <Card className="border-border/60 bg-gradient-to-br from-card via-card to-accent/5 shadow-xs">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-4 md:items-center">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Curriculum Completion</span>
                <span className="font-bold text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="mt-2.5 h-3" />
              <p className="mt-2 text-xs text-muted-foreground">
                {completedTasks} of {totalTasks} checklist deliverables validated across all phases.
              </p>
            </div>

            <div className="flex items-center gap-3 border-border/40 pl-0 md:border-l md:pl-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phases Active</p>
                <p className="text-lg font-bold text-foreground">
                  {data.filter((m) => m.status === "in_progress").length} of {data.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-border/40 pl-0 md:border-l md:pl-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed Milestones</p>
                <p className="text-lg font-bold text-foreground">
                  {data.filter((m) => m.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Filter */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="all">All Phases ({data.length})</TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({data.filter((m) => m.status === "in_progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({data.filter((m) => m.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming (
            {data.filter((m) => m.status === "not_started" || m.status === "under_review").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Milestones List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((item) => {
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "in_progress";

          return (
            <Card
              key={item.id}
              className={`flex flex-col border transition-all shadow-xs ${
                isCompleted
                  ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                  : isInProgress
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-border/60"
              }`}
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
                    variant={isCompleted ? "default" : isInProgress ? "secondary" : "outline"}
                    className={
                      isCompleted
                        ? "bg-emerald-600 text-white hover:bg-emerald-600"
                        : isInProgress
                          ? "bg-primary text-primary-foreground"
                          : ""
                    }
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
                    {item.tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(item.id, task.id)}
                        className="flex w-full items-start gap-2.5 text-left text-xs transition-opacity hover:opacity-80"
                      >
                        <div
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            task.completed
                              ? "border-emerald-600 bg-emerald-600 text-white"
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
                      </button>
                    ))}
                  </div>
                </div>

                {/* Supervisor Feedback */}
                {item.supervisor_feedback && (
                  <div className="rounded-lg border border-border/80 bg-accent/20 p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <Sparkles className="size-3.5 text-amber-500" />
                      <span>Mentor Feedback</span>
                    </div>
                    <p className="mt-1 text-muted-foreground italic leading-relaxed">
                      "{item.supervisor_feedback}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
