import { useMemo, useState, useEffect } from "react";
import { FilePenLine, Loader2, Plus, Search, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { enqueueOfflineAction, isAppOffline } from "@/components/ui/network-banner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppUser } from "@/lib/app-user";
import {
  activities as initialActivities,
  internships,
  uid,
  getStoredActivities,
  saveStoredActivities,
  type MockActivity,
} from "@/lib/mock-data";

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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  submitted: "secondary",
  approved: "default",
  needs_correction: "destructive",
};

export default function LogbookPage() {
  const { userId } = useAppUser();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingSubmitId, setPendingSubmitId] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setActivitiesList(getStoredActivities());
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  const myInternship = internships.find((i) => i.student_id === userId);
  const data = activitiesList.filter((a) => a.student_id === userId);

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

  function saveDraft(submit: boolean) {
    if (!draft.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    const current = getStoredActivities();
    const idx = current.findIndex((a) => a.id === draft.id);
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
    };
    let updated: MockActivity[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = entry;
    } else {
      updated = [entry, ...current];
    }
    saveStoredActivities(updated);
    setActivitiesList(updated);
    setOpen(false);
    setDraft(emptyDraft());
    toast.success(submit ? "Submitted for supervisor approval" : "Saved as draft");
  }

  function deleteEntry(id: string) {
    const current = getStoredActivities();
    const updated = current.filter((a) => a.id !== id);
    saveStoredActivities(updated);
    setActivitiesList(updated);
    toast.success("Entry deleted");
  }

  function submitExisting(id: string) {
    const current = getStoredActivities();
    const idx = current.findIndex((a) => a.id === id);
    if (idx >= 0) {
      const a = current[idx]!;
      const updated = [...current];
      updated[idx] = {
        ...a,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      };
      saveStoredActivities(updated);
      setActivitiesList(updated);
    }
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
          {filtered.map((a) => (
            <Card key={a.id} className="shadow-card">
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
                  <Badge variant={STATUS_VARIANT[a.status] ?? "secondary"} className="capitalize">
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
                  {a.skills_gained.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
                {a.supervisor_feedback ? (
                  <p className="rounded-lg bg-muted p-3 text-xs">
                    <span className="font-medium">Supervisor feedback: </span>
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
          ))}
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
            if (isAppOffline()) {
              enqueueOfflineAction("logbook_submit", `Submitted logbook entry ${pendingSubmitId}`);
            }
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
