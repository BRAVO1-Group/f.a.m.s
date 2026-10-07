import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FilePenLine,
  Loader2,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppUser } from "@/lib/app-user";
import { activities, internships, uid, type MockActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/logbook")({
  head: () => ({
    meta: [
      { title: "Digital Logbook — InternTrack" },
      {
        name: "description",
        content: "Record daily internship activities, attach evidence, and submit for approval.",
      },
      { property: "og:title", content: "Digital Logbook — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LogbookPage,
});

type Draft = {
  id?: string;
  activity_date: string;
  arrival_time: string;
  departure_time: string;
  title: string;
  description: string;
  tools_used: string;
  skills_gained: string;
  challenges: string;
  solutions: string;
  attachments: string[];
};

const emptyDraft = (): Draft => ({
  activity_date: new Date().toISOString().slice(0, 10),
  arrival_time: "09:00",
  departure_time: "17:00",
  title: "",
  description: "",
  tools_used: "",
  skills_gained: "",
  challenges: "",
  solutions: "",
  attachments: [],
});

const TEMPLATES = [
  {
    name: "Frontend UI Component",
    icon: "🎨",
    data: {
      title: "Built Accessible Auth Modal & Navigation Shell",
      arrival_time: "08:30",
      departure_time: "17:00",
      description:
        "Engineered accessible Radix UI dialog components and responsive navigation drawer styled with Tailwind CSS v4. Verified keyboard navigation and screen-reader compliance.",
      tools_used: "React 19, Tailwind CSS v4, Radix UI, TypeScript",
      skills_gained: "UI/UX Prototyping, Accessibility (a11y), Component Design",
      challenges: "Modal backdrop scroll bleeding on touch viewports.",
      solutions: "Implemented lock-scroll hook via Radix Dialog primitive.",
      attachments: ["auth_modal_preview.png (380 KB)", "component_spec.pdf (1.1 MB)"],
    },
  },
  {
    name: "API & Data Cache",
    icon: "⚡",
    data: {
      title: "Optimistic State Management & Query Caching",
      arrival_time: "09:00",
      departure_time: "17:30",
      description:
        "Implemented asynchronous mock data layer with simulated latency and optimistic UI updates for real-time logbook feedback without external server dependencies.",
      tools_used: "TanStack Router, React Hooks, TypeScript",
      skills_gained: "State Architecture, Async Event Handling, Optimistic UI",
      challenges: "Synchronizing storage events across multiple browser tabs.",
      solutions: "Dispatched window custom events with sessionStorage hydration.",
      attachments: ["architecture_diagram.png (620 KB)"],
    },
  },
  {
    name: "Bug Triage & Fix",
    icon: "🐞",
    data: {
      title: "Fixed Date Parsing and Timezone Drift in Reports",
      arrival_time: "09:00",
      departure_time: "16:45",
      description:
        "Profiled timezone normalization bug where UTC dates shifted by one day in local time. Refactored date formatters using date-fns and added regression tests.",
      tools_used: "date-fns, Vitest, Chrome DevTools",
      skills_gained: "Root Cause Analysis, Unit Testing, Timezone Standards",
      challenges: "Reproducing timezone discrepancies consistently in local dev.",
      solutions: "Added unit tests passing explicit UTC ISO timestamps.",
      attachments: ["test_run_output.txt (45 KB)"],
    },
  },
  {
    name: "Sprint Standup & Grooming",
    icon: "📋",
    data: {
      title: "Sprint 4 Milestone Grooming & Story Estimation",
      arrival_time: "08:45",
      departure_time: "17:00",
      description:
        "Attended engineering bi-weekly sprint planning session, estimated story points for upcoming logbook features, and presented live sprint demo to supervisors.",
      tools_used: "Jira, GitHub Projects, Figma",
      skills_gained: "Agile Scrum, Task Estimation, Technical Communication",
      challenges: "Aligning frontend task dependencies with backend contract.",
      solutions: "Defined strict TypeScript interface contracts upfront.",
      attachments: ["sprint_board_export.pdf (920 KB)"],
    },
  },
];

const SAMPLE_ATTACHMENTS = [
  "code_review_pr_14.png (420 KB)",
  "lighthouse_audit_report.pdf (890 KB)",
  "test_coverage_matrix.pdf (1.2 MB)",
  "user_flow_wireframe.png (650 KB)",
];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  submitted: "secondary",
  approved: "default",
  needs_correction: "destructive",
};

function LogbookPage() {
  const { userId } = useAppUser();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [customAttach, setCustomAttach] = useState("");
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  const myInternship = internships.find((i) => i.student_id === userId);
  const data = activities.filter((a) => a.student_id === userId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data.slice().sort((a, b) => (a.activity_date < b.activity_date ? 1 : -1));
    return data
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tools_used.join(" ").toLowerCase().includes(q),
      )
      .sort((a, b) => (a.activity_date < b.activity_date ? 1 : -1));
  }, [data, search]);

  function applyTemplate(tmpl: (typeof TEMPLATES)[number]) {
    setDraft((prev) => ({
      ...prev,
      title: tmpl.data.title,
      arrival_time: tmpl.data.arrival_time,
      departure_time: tmpl.data.departure_time,
      description: tmpl.data.description,
      tools_used: tmpl.data.tools_used,
      skills_gained: tmpl.data.skills_gained,
      challenges: tmpl.data.challenges,
      solutions: tmpl.data.solutions,
      attachments: tmpl.data.attachments,
    }));
    toast.success(`Loaded "${tmpl.name}" template`);
  }

  function addAttachment(file: string) {
    if (!draft.attachments.includes(file)) {
      setDraft((d) => ({ ...d, attachments: [...d.attachments, file] }));
      toast.success("Attachment added");
    }
  }

  function removeAttachment(file: string) {
    setDraft((d) => ({ ...d, attachments: d.attachments.filter((f) => f !== file) }));
  }

  function saveDraft(submit: boolean) {
    if (!draft.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const idx = activities.findIndex((a) => a.id === draft.id);
    const entry: MockActivity = {
      id: draft.id ?? uid(),
      student_id: userId,
      internship_id: myInternship?.id ?? "intern-1",
      activity_date: draft.activity_date,
      arrival_time: draft.arrival_time || null,
      departure_time: draft.departure_time || null,
      title: draft.title.trim(),
      description: draft.description.trim(),
      tools_used: draft.tools_used
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skills_gained: draft.skills_gained
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      challenges: draft.challenges.trim() || null,
      solutions: draft.solutions.trim() || null,
      status: submit ? "submitted" : "draft",
      submitted_at: submit ? new Date().toISOString() : null,
      supervisor_feedback: null,
      reviewed_by: null,
      reviewed_at: null,
      attachments: draft.attachments,
    };
    if (idx >= 0) {
      activities[idx] = entry;
    } else {
      activities.unshift(entry);
    }
    setOpen(false);
    setDraft(emptyDraft());
    refresh();
    toast.success(submit ? "Submitted for supervisor approval" : "Saved as draft");
  }

  function deleteEntry(id: string) {
    const idx = activities.findIndex((a) => a.id === id);
    if (idx >= 0) activities.splice(idx, 1);
    refresh();
    toast.success("Entry deleted");
  }

  function submitExisting(id: string) {
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
        status: "submitted",
        submitted_at: new Date().toISOString(),
        supervisor_feedback: a.supervisor_feedback,
        reviewed_by: a.reviewed_by,
        reviewed_at: a.reviewed_at,
        attachments: a.attachments,
      };
    }
    refresh();
    toast.success("Sent to your supervisor");
  }

  async function runAi() {
    if (draft.description.trim().length < 3) {
      toast.error("Write a short note first, then let AI polish it.");
      return;
    }
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const improved =
      draft.description.trim() +
      " This task was completed successfully, adhering strictly to industry best practices and clean code standards. The outcome directly supported the team's sprint milestone objectives.";
    setDraft((d) => ({ ...d, description: improved }));
    setAiLoading(false);
    toast.success("Description improved (simulated)");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Digital Logbook</h1>
          <p className="text-sm text-muted-foreground">
            Record what you did each day, attach work evidence, and submit for supervisor approval.
          </p>
        </div>
        <Button
          onClick={() => {
            setDraft(emptyDraft());
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> New entry
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search activities, tools, or attachments…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-xs">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No entries yet. Click "New entry" to record your first activity.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} className="shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <CardDescription>
                      {a.activity_date}
                      {a.arrival_time ? ` · ${a.arrival_time.slice(0, 5)}` : ""}
                      {a.departure_time ? `–${a.departure_time.slice(0, 5)}` : ""}
                    </CardDescription>
                  </div>
                  <Badge variant={STATUS_VARIANT[a.status] ?? "secondary"}>
                    {a.status === "approved"
                      ? "Approved ✅"
                      : a.status === "needs_correction"
                        ? "Revision Required ⚠️"
                        : a.status}
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
                  {a.skills_gained.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Attachments preview */}
                {a.attachments && a.attachments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Paperclip className="size-3" /> Evidence:
                    </span>
                    {a.attachments.map((file) => (
                      <span
                        key={file}
                        className="inline-flex items-center gap-1 rounded border border-border/80 bg-accent/20 px-2 py-0.5 text-xs text-foreground"
                      >
                        📄 {file}
                      </span>
                    ))}
                  </div>
                )}

                {a.supervisor_feedback ? (
                  <p className="rounded-lg bg-muted p-3 text-xs">
                    <span className="font-medium text-foreground">Supervisor feedback: </span>
                    {a.supervisor_feedback}
                  </p>
                ) : null}

                {a.status === "draft" || a.status === "needs_correction" ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDraft({
                          id: a.id,
                          activity_date: a.activity_date,
                          arrival_time: a.arrival_time?.slice(0, 5) ?? "",
                          departure_time: a.departure_time?.slice(0, 5) ?? "",
                          title: a.title,
                          description: a.description,
                          tools_used: a.tools_used.join(", "),
                          skills_gained: a.skills_gained.join(", "),
                          challenges: a.challenges ?? "",
                          solutions: a.solutions ?? "",
                          attachments: a.attachments ?? [],
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => submitExisting(a.id)}>
                      <Send className="size-4" /> Submit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => deleteEntry(a.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New/Edit Activity Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {draft.id ? "Edit Activity Entry" : "New Daily Activity Entry"}
            </DialogTitle>
            <DialogDescription>
              Record your work, use quick templates, and attach deliverables for supervisor
              approval.
            </DialogDescription>
          </DialogHeader>

          {/* Quick Starter Templates Toolbar */}
          <div className="rounded-lg border border-border/80 bg-accent/15 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground">
                <Zap className="size-3.5 text-amber-500" />
                Quick Starter Templates
              </span>
              <span className="text-[10px] text-muted-foreground">
                Auto-populates realistic data
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TEMPLATES.map((tmpl) => (
                <Button
                  key={tmpl.name}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => applyTemplate(tmpl)}
                  className="h-7 text-xs font-medium"
                >
                  <span className="mr-1">{tmpl.icon}</span> {tmpl.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={draft.activity_date}
                onChange={(e) => setDraft({ ...draft, activity_date: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="in">Arrival</Label>
              <Input
                id="in"
                type="time"
                value={draft.arrival_time}
                onChange={(e) => setDraft({ ...draft, arrival_time: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="out">Departure</Label>
              <Input
                id="out"
                type="time"
                value={draft.departure_time}
                onChange={(e) => setDraft({ ...draft, departure_time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Activity Title</Label>
            <Input
              id="title"
              value={draft.title}
              placeholder="e.g. Implemented Responsive UI & Auth Components"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="desc">Detailed Description</Label>
              <Button type="button" size="sm" variant="ghost" onClick={runAi} disabled={aiLoading}>
                {aiLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FilePenLine className="size-4" />
                )}
                <Sparkles className="size-3.5 text-amber-500" />
                Improve with AI
              </Button>
            </div>
            <Textarea
              id="desc"
              rows={4}
              value={draft.description}
              placeholder="What tasks did you complete today, and what was the deliverable outcome?"
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tools">Tools / Tech Stack (comma separated)</Label>
              <Input
                id="tools"
                value={draft.tools_used}
                placeholder="React 19, Tailwind CSS v4, TypeScript"
                onChange={(e) => setDraft({ ...draft, tools_used: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skills">Skills Gained (comma separated)</Label>
              <Input
                id="skills"
                value={draft.skills_gained}
                placeholder="UI Architecture, Performance Optimization"
                onChange={(e) => setDraft({ ...draft, skills_gained: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ch">Challenges Encountered</Label>
              <Textarea
                id="ch"
                rows={2}
                value={draft.challenges}
                placeholder="Obstacles or unexpected blockers..."
                onChange={(e) => setDraft({ ...draft, challenges: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sol">Solutions Applied</Label>
              <Textarea
                id="sol"
                rows={2}
                value={draft.solutions}
                placeholder="How you overcame the challenges..."
                onChange={(e) => setDraft({ ...draft, solutions: e.target.value })}
              />
            </div>
          </div>

          {/* Work Evidence & File Attachments */}
          <div className="space-y-2 rounded-lg border border-border/80 bg-muted/30 p-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <Paperclip className="size-3.5 text-primary" />
                Work Evidence & Screenshots (Simulated)
              </span>
              <span className="text-[10px] text-muted-foreground">
                Click samples or type custom
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {SAMPLE_ATTACHMENTS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => addAttachment(sample)}
                  className="rounded border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-accent"
                >
                  + {sample}
                </button>
              ))}
            </div>

            {/* Attached files list */}
            {draft.attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {draft.attachments.map((file) => (
                  <span
                    key={file}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground"
                  >
                    📄 {file}
                    <button
                      type="button"
                      onClick={() => removeAttachment(file)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              disabled={!draft.title.trim()}
              onClick={() => saveDraft(false)}
            >
              Save as Draft
            </Button>
            <Button
              disabled={!draft.title.trim() || draft.description.trim().length < 3}
              onClick={() => saveDraft(true)}
            >
              <Send className="size-4" />
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
