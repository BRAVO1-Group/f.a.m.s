import { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
  CheckCircle2,
  Clock,
  FilePenLine,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

type LogbookEntry = {
  id: number;
  title: string;
  log_date: string;
  arrival_time: string | null;
  departure_time: string | null;
  activities: string;
  tools_used: string[] | null;
  skills_learned: string | null;
  challenges: string | null;
  solutions: string | null;
  status: "draft" | "submitted" | "approved" | "needs_correction";
  supervisor_feedback: string | null;
};

type LogbookPageProps = {
  logbooks: LogbookEntry[];
};

type Draft = {
  id?: number;
  activity_date: string;
  arrival_time: string;
  departure_time: string;
  title: string;
  description: string;
  tools_used: string;
  skills_gained: string;
  challenges: string;
  solutions: string;
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
});

function getLogStatusMeta(status: LogbookEntry["status"]) {
  if (status === "approved") {
    return {
      label: "Approved & Signed Off",
      className:
        "border-[#589E10]/40 bg-[#9CE840]/20 text-[#2D5408] dark:border-[#9CE840]/40 dark:bg-[#9CE840]/15 dark:text-[#9CE840]",
      icon: CheckCircle2,
    };
  }
  if (status === "submitted") {
    return {
      label: "Submitted · Pending Approval",
      className: "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300",
      icon: Clock,
    };
  }
  if (status === "needs_correction") {
    return {
      label: "Revision Requested",
      className: "border-destructive/40 bg-destructive/10 text-destructive",
      icon: RotateCcw,
    };
  }
  return {
    label: "Saved Draft",
    className: "border-border bg-muted text-muted-foreground",
    icon: FilePenLine,
  };
}

function getHoursWorked(arrival: string, departure: string): number {
  if (!arrival || !departure) return 8;
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours! * 60 + minutes!;
  };
  const duration = (toMinutes(departure) - toMinutes(arrival) + 1440) % 1440;
  return Math.min(duration / 60, 24);
}

export default function LogbookPage() {
  const { props } = usePage<LogbookPageProps>();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [pendingSubmitId, setPendingSubmitId] = useState<number | null>(null);
  const data = props.logbooks;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data.slice().sort((a, b) => (a.log_date < b.log_date ? 1 : -1));
    return data
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.activities.toLowerCase().includes(q) ||
          (a.tools_used ?? []).join(" ").toLowerCase().includes(q),
      )
      .sort((a, b) => (a.log_date < b.log_date ? 1 : -1));
  }, [data, search]);

  function saveDraft(submit: boolean) {
    if (!draft.title.trim()) {
      toast.warning("Empty Form Warning", {
        description: "Please enter an activity title for your logbook entry.",
      });
      return;
    }
    if (!draft.description.trim()) {
      toast.warning("Empty Form Warning", {
        description: "Please describe the tasks and work you completed today.",
      });
      return;
    }
    if (submit && !draft.tools_used.trim()) {
      toast.warning("Empty Form Warning", {
        description:
          "Please list at least one tool or technology used before submitting to your supervisor.",
      });
      return;
    }
    const payload = {
      title: draft.title.trim(),
      log_date: draft.activity_date,
      arrival_time: draft.arrival_time || null,
      departure_time: draft.departure_time || null,
      tools_used: draft.tools_used
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skills_learned: draft.skills_gained.trim(),
      activities: draft.description.trim(),
      challenges: draft.challenges.trim() || null,
      solutions: draft.solutions.trim() || null,
      status: submit ? "submitted" : "draft",
      hours_worked: getHoursWorked(draft.arrival_time, draft.departure_time),
    };
    const options = {
      preserveScroll: true,
      onSuccess: () => {
        setOpen(false);
        setDraft(emptyDraft());
        toast.success(submit ? "Submitted for supervisor approval" : "Saved as draft");
      },
      onError: (errors: Record<string, string>) => {
        toast.error(Object.values(errors).join(" ") || "Unable to save this logbook entry.");
      },
    };

    if (draft.id) {
      router.put(`/logbooks/${draft.id}`, payload, options);
    } else {
      router.post("/logbooks", payload, options);
    }
  }

  function deleteEntry(id: number) {
    router.delete(`/logbooks/${id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success("Entry deleted"),
      onError: () => toast.error("Unable to delete this logbook entry."),
    });
  }

  function submitExisting(id: number) {
    router.put(
      `/logbooks/${id}`,
      { status: "submitted" },
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Sent to your supervisor"),
        onError: (errors) => {
          toast.error(Object.values(errors).join(" ") || "Unable to submit this entry.");
        },
      },
    );
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
      " This task was completed successfully, demonstrating strong technical aptitude and problem-solving skills. The outcome contributed meaningfully to the team's sprint objectives.";
    setDraft((d) => ({ ...d, description: improved }));
    setAiLoading(false);
    toast.success("Description improved (simulated)");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Digital logbook</h1>
          <p className="text-sm text-muted-foreground">
            Record what you did each day and submit it for supervisor approval.
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
          placeholder="Search activities, tools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FilePenLine}
          title={search ? "No Matching Logbook Entries Found" : "Your Digital Logbook Is Empty"}
          description={
            search
              ? "Try adjusting your search keywords or clear the filter to view all entries."
              : "Record your daily workplace tasks, technical tools, and skills learned, then submit them for your Field Mentor's comment and sign-off."
          }
          actionLabel="Create First Logbook Entry"
          onAction={() => {
            setDraft(emptyDraft());
            setOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const statusMeta = getLogStatusMeta(a.status);
            const StatusIcon = statusMeta.icon;
            return (
              <Card key={a.id} className="shadow-none border-border/60 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{a.title}</CardTitle>
                      <CardDescription>
                        {a.log_date}
                        {a.arrival_time ? ` · ${a.arrival_time.slice(0, 5)}` : ""}
                        {a.departure_time ? `–${a.departure_time.slice(0, 5)}` : ""}
                      </CardDescription>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusMeta.className}`}
                    >
                      <StatusIcon className="size-3.5" />
                      {statusMeta.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="whitespace-pre-line text-muted-foreground">{a.activities}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(a.tools_used ?? []).map((t) => (
                      <Badge key={t} variant="outline">
                        {t}
                      </Badge>
                    ))}
                    {(a.skills_learned ?? "")
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                  </div>
                  {a.status === "approved" || a.supervisor_feedback ? (
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-xs space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-foreground">
                        <CheckCircle2 className="size-3.5 text-[#589E10] dark:text-[#9CE840]" />
                        {a.status === "approved"
                          ? "APPROVED — Verified & Signed Off by Field Mentor"
                          : "Field Mentor Revision Note"}
                      </span>
                      <p className="text-muted-foreground">
                        {a.supervisor_feedback || "Approved and signed off by Field Mentor."}
                      </p>
                    </div>
                  ) : null}
                  {a.status === "draft" || a.status === "needs_correction" ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDraft({
                            id: a.id,
                            activity_date: a.log_date,
                            arrival_time: a.arrival_time?.slice(0, 5) ?? "",
                            departure_time: a.departure_time?.slice(0, 5) ?? "",
                            title: a.title,
                            description: a.activities,
                            tools_used: (a.tools_used ?? []).join(", "),
                            skills_gained: a.skills_learned ?? "",
                            challenges: a.challenges ?? "",
                            solutions: a.solutions ?? "",
                          });
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button size="sm" onClick={() => setPendingSubmitId(a.id)}>
                        <Send className="size-4" /> Submit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setPendingDeleteId(a.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit activity" : "New activity"}</DialogTitle>
            <DialogDescription>
              Describe the work you completed. You can save a draft and submit later.
            </DialogDescription>
          </DialogHeader>

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
            <Label htmlFor="title">Activity title</Label>
            <Input
              id="title"
              value={draft.title}
              placeholder="e.g. Built the customer feedback form"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="desc">Detailed description</Label>
              <Button type="button" size="sm" variant="ghost" onClick={runAi} disabled={aiLoading}>
                {aiLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FilePenLine className="size-4" />
                )}
                Improve with AI
              </Button>
            </div>
            <Textarea
              id="desc"
              rows={5}
              value={draft.description}
              placeholder="What exactly did you do, and what was the outcome?"
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tools">Tools / technologies (comma separated)</Label>
              <Input
                id="tools"
                value={draft.tools_used}
                onChange={(e) => setDraft({ ...draft, tools_used: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skills">Skills acquired (comma separated)</Label>
              <Input
                id="skills"
                value={draft.skills_gained}
                onChange={(e) => setDraft({ ...draft, skills_gained: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ch">Challenges faced</Label>
              <Textarea
                id="ch"
                rows={3}
                value={draft.challenges}
                onChange={(e) => setDraft({ ...draft, challenges: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sol">Solutions provided</Label>
              <Textarea
                id="sol"
                rows={3}
                value={draft.solutions}
                onChange={(e) => setDraft({ ...draft, solutions: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              disabled={!draft.title.trim()}
              onClick={() => saveDraft(false)}
            >
              Save draft
            </Button>
            <Button
              disabled={!draft.title.trim() || draft.description.trim().length < 3}
              onClick={() => saveDraft(true)}
            >
              <Send className="size-4" />
              Submit for approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Yes / No Confirmation Dialogs for Submitting & Deleting Logbook Entries */}
      <ConfirmDialog
        open={Boolean(pendingSubmitId)}
        onOpenChange={(v) => {
          if (!v) setPendingSubmitId(null);
        }}
        title="Submit Logbook Entry to Field Mentor?"
        description="Are you sure you want to submit this logbook entry for your Field Mentor's review, comment, and official sign-off?"
        confirmLabel="Yes, Submit Entry"
        cancelLabel="No, Keep Editing"
        onConfirm={() => {
          if (pendingSubmitId) {
            submitExisting(pendingSubmitId);
            setPendingSubmitId(null);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onOpenChange={(v) => {
          if (!v) setPendingDeleteId(null);
        }}
        title="Delete This Logbook Entry?"
        description="Are you sure you want to permanently delete this draft logbook entry? This action cannot be undone."
        confirmLabel="Yes, Delete Entry"
        cancelLabel="No, Keep Entry"
        variant="destructive"
        onConfirm={() => {
          if (pendingDeleteId) {
            deleteEntry(pendingDeleteId);
            setPendingDeleteId(null);
          }
        }}
      />
    </div>
  );
}
