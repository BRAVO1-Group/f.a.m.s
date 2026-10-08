import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FilePenLine, Loader2, Plus, Search, Send, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { improveText } from "@/lib/ai.functions";
import { useAppUser } from "@/lib/app-user";

export const Route = createFileRoute("/_authenticated/logbook")({
  head: () => ({
    meta: [
      { title: "Digital Logbook — InternTrack" },
      {
        name: "description",
        content: "Record daily internship activities and submit for approval.",
      },
      { property: "og:title", content: "Digital Logbook — InternTrack" },
      { property: "og:description", content: "Your searchable digital internship logbook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

function LogbookPage() {
  const { userId } = useAppUser();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [search, setSearch] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const improve = useServerFn(improveText);

  const { data, isLoading } = useQuery({
    queryKey: ["activities", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("student_id", userId)
        .order("activity_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const internship = useQuery({
    queryKey: ["my-internship", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("internships")
        .select("id")
        .eq("student_id", userId)
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async ({ d, submit }: { d: Draft; submit: boolean }) => {
      const payload = {
        student_id: userId,
        internship_id: internship.data?.id ?? null,
        activity_date: d.activity_date,
        arrival_time: d.arrival_time || null,
        departure_time: d.departure_time || null,
        title: d.title.trim(),
        description: d.description.trim(),
        tools_used: d.tools_used
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills_gained: d.skills_gained
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        challenges: d.challenges.trim() || null,
        solutions: d.solutions.trim() || null,
        status: (submit ? "submitted" : "draft") as "submitted" | "draft",
        submitted_at: submit ? new Date().toISOString() : null,
      };
      const res = d.id
        ? await supabase.from("activities").update(payload).eq("id", d.id)
        : await supabase.from("activities").insert(payload);
      if (res.error) throw res.error;
    },
    onSuccess: (_r, vars) => {
      qc.invalidateQueries({ queryKey: ["activities", userId] });
      setOpen(false);
      setDraft(emptyDraft());
      toast.success(vars.submit ? "Submitted for supervisor approval" : "Saved as draft");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activities", userId] });
      toast.success("Entry deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submitExisting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("activities")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activities", userId] });
      toast.success("Sent to your supervisor");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        (a.tools_used ?? []).join(" ").toLowerCase().includes(q),
    );
  }, [data, search]);

  async function runAi() {
    if (draft.description.trim().length < 3) {
      toast.error("Write a short note first, then let AI polish it.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await improve({
        data: { mode: "activity", text: draft.description, context: draft.title || undefined },
      });
      if (res.error) toast.error(res.error);
      else if (res.text) {
        setDraft((d) => ({ ...d, description: res.text }));
        toast.success("Description improved");
      }
    } catch {
      toast.error("AI assistant unavailable");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Digital logbook</h1>
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

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No entries yet. Click “New entry” to record your first activity.
          </CardContent>
        </Card>
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
                  {(a.tools_used ?? []).map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                  {(a.skills_gained ?? []).map((s) => (
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
                          tools_used: (a.tools_used ?? []).join(", "),
                          skills_gained: (a.skills_gained ?? []).join(", "),
                          challenges: a.challenges ?? "",
                          solutions: a.solutions ?? "",
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => submitExisting.mutate(a.id)}>
                      <Send className="size-4" /> Submit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => remove.mutate(a.id)}
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
              disabled={save.isPending || !draft.title.trim()}
              onClick={() => save.mutate({ d: draft, submit: false })}
            >
              Save draft
            </Button>
            <Button
              disabled={
                save.isPending || !draft.title.trim() || draft.description.trim().length < 3
              }
              onClick={() => save.mutate({ d: draft, submit: true })}
            >
              {save.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Submit for approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
