import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppUser } from "@/lib/app-user";
import { activities, profiles } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/review")({
  head: () => ({
    meta: [
      { title: "Review Queue — InternTrack" },
      { name: "description", content: "Review, approve and give feedback on intern activity reports." },
      { property: "og:title", content: "Review Queue — InternTrack" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ReviewPage,
});

type Filter = "submitted" | "approved" | "needs_correction";

function ReviewPage() {
  const { userId } = useAppUser();
  const [filter, setFilter] = useState<Filter>("submitted");
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

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
      activities[idx] = { id: a.id, student_id: a.student_id, internship_id: a.internship_id, activity_date: a.activity_date, arrival_time: a.arrival_time, departure_time: a.departure_time, title: a.title, description: a.description, tools_used: a.tools_used, skills_gained: a.skills_gained, challenges: a.challenges, solutions: a.solutions, submitted_at: a.submitted_at, status, supervisor_feedback: feedback[id]?.trim() || null, reviewed_by: userId, reviewed_at: new Date().toISOString() };
    }
    setFeedback((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    refresh();
    toast.success(status === "approved" ? "Activity approved" : "Correction requested");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Review queue</h1>
        <p className="text-sm text-muted-foreground">
          Approve activities, request corrections and leave feedback for your interns.
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="submitted">
            Pending
            {activities.filter((a) => a.status === "submitted").length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                {activities.filter((a) => a.status === "submitted").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="needs_correction">Corrections</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
      </Tabs>

      {rows.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nothing here right now.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((a) => (
            <Card key={a.id} className="shadow-card">
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
                    <span className="font-medium">Challenges: </span>
                    {a.challenges}
                  </p>
                ) : null}
                {a.status === "approved" && a.supervisor_feedback ? (
                  <p className="rounded-lg bg-muted p-3 text-xs">
                    <span className="font-medium">Your feedback: </span>
                    {a.supervisor_feedback}
                  </p>
                ) : null}

                {a.status !== "approved" ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <MessageSquare className="size-3.5" /> Feedback (optional)
                    </div>
                    <Textarea
                      rows={2}
                      value={feedback[a.id] ?? ""}
                      placeholder="Comments or recommendations…"
                      onChange={(e) => setFeedback({ ...feedback, [a.id]: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => decide(a.id, "approved")}
                      >
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
    </div>
  );
}
