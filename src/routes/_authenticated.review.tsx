import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MessageSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAppUser } from "@/lib/app-user";

export const Route = createFileRoute("/_authenticated/review")({
  head: () => ({
    meta: [
      { title: "Review Queue — InternTrack" },
      { name: "description", content: "Review, approve and give feedback on intern activity reports." },
      { property: "og:title", content: "Review Queue — InternTrack" },
      { property: "og:description", content: "Approve or request corrections on submitted activities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewPage,
});

type Filter = "submitted" | "approved" | "needs_correction";

function ReviewPage() {
  const { userId } = useAppUser();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("submitted");
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["review", filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("status", filter)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const studentIds = Array.from(new Set((data ?? []).map((a) => a.student_id)));
  const students = useQuery({
    queryKey: ["review-students", studentIds.join(",")],
    enabled: studentIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", studentIds);
      if (error) throw error;
      return data ?? [];
    },
  });

  const nameOf = (id: string) => {
    const p = students.data?.find((s) => s.id === id);
    return p?.full_name || p?.email || "Intern";
  };

  const decide = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "needs_correction";
    }) => {
      const { error } = await supabase
        .from("activities")
        .update({
          status,
          supervisor_feedback: feedback[id]?.trim() || null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_r, vars) => {
      qc.invalidateQueries({ queryKey: ["review"] });
      toast.success(vars.status === "approved" ? "Activity approved" : "Correction requested");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];

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
          <TabsTrigger value="submitted">Pending</TabsTrigger>
          <TabsTrigger value="needs_correction">Corrections</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
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
                  {(a.tools_used ?? []).map((t) => (
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
                        disabled={decide.isPending}
                        onClick={() => decide.mutate({ id: a.id, status: "approved" })}
                      >
                        <Check className="size-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={decide.isPending}
                        onClick={() => decide.mutate({ id: a.id, status: "needs_correction" })}
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
