import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileOutput, FileText, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppUser } from "@/lib/app-user";
import { activities } from "@/lib/mock-data";

type Period = "week" | "month" | "final";

const PERIOD_LABEL: Record<Period, string> = {
  week: "Weekly report",
  month: "Monthly report",
  final: "Final internship report",
};

function since(period: Period) {
  const d = new Date();
  if (period === "week") d.setDate(d.getDate() - 7);
  else if (period === "month") d.setMonth(d.getMonth() - 1);
  else d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const { userId, name, email } = useAppUser();
  const [period, setPeriod] = useState<Period>("week");
  const [summary, setSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const from = since(period);

  const rows = useMemo(
    () =>
      activities
        .filter((a) => a.student_id === userId && a.activity_date >= from)
        .sort((a, b) => (a.activity_date > b.activity_date ? 1 : -1)),
    [userId, from],
  );

  const approved = rows.filter((r) => r.status === "approved").length;
  const skills = Array.from(new Set(rows.flatMap((r) => r.skills_gained)));
  const tools = Array.from(new Set(rows.flatMap((r) => r.tools_used)));

  async function generateSummary() {
    if (rows.length === 0) {
      toast.error("No activities in this period yet.");
      return;
    }
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const summaryText = `During this ${period} period, the intern completed ${rows.length} activities, of which ${approved} received supervisor approval. Key work included: ${rows
      .slice(0, 3)
      .map((r) => r.title)
      .join(
        "; ",
      )}. Skills developed include ${skills.slice(0, 5).join(", ")}. The intern demonstrated consistent engagement and professional growth throughout the reporting period.`;
    setSummary(summaryText);
    setAiLoading(false);
    toast.success("Summary generated (simulated)");
  }

  function buildHtml() {
    const items = rows
      .map(
        (r) => `<h3>${r.activity_date} — ${escapeHtml(r.title)}</h3>
<p>${escapeHtml(r.description)}</p>
<p><em>Tools:</em> ${r.tools_used.map(escapeHtml).join(", ") || "—"}<br/>
<em>Skills:</em> ${r.skills_gained.map(escapeHtml).join(", ") || "—"}<br/>
<em>Status:</em> ${r.status.replace("_", " ")}</p>`,
      )
      .join("\n");
    return `<html><head><meta charset="utf-8"><title>${PERIOD_LABEL[period]}</title></head>
<body style="font-family:Georgia,serif;line-height:1.5;padding:32px">
<h1>${PERIOD_LABEL[period]}</h1>
<p><strong>Intern:</strong> ${escapeHtml(name || email)}<br/>
<strong>Period:</strong> ${from} to ${new Date().toISOString().slice(0, 10)}<br/>
<strong>Activities:</strong> ${rows.length} (${approved} approved)</p>
${summary ? `<h2>Summary</h2><p>${escapeHtml(summary)}</p>` : ""}
<h2>Activity log</h2>
${items || "<p>No activities recorded.</p>"}
<h2>Skills developed</h2><p>${skills.map(escapeHtml).join(", ") || "—"}</p>
<h2>Tools &amp; technologies</h2><p>${tools.map(escapeHtml).join(", ") || "—"}</p>
</body></html>`;
  }

  function downloadWord() {
    const blob = new Blob([buildHtml()], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${PERIOD_LABEL[period].replace(/\s+/g, "-").toLowerCase()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Word document downloaded");
  }

  function printPdf() {
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Allow pop-ups to export the PDF.");
      return;
    }
    w.document.write(buildHtml());
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Build your internship report from recorded activities and export it.
        </p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="week">Weekly</TabsTrigger>
          <TabsTrigger value="month">Monthly</TabsTrigger>
          <TabsTrigger value="final">Final</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <Button onClick={generateSummary} disabled={aiLoading}>
          {aiLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileOutput className="size-4" />
          )}
          Generate summary with AI
        </Button>
        <Button variant="outline" onClick={printPdf}>
          <Printer className="size-4" /> Export PDF
        </Button>
        <Button variant="outline" onClick={downloadWord}>
          <Download className="size-4" /> Download Word
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Activities" value={rows.length} />
        <Stat label="Approved" value={approved} />
        <Stat label="Skills developed" value={skills.length} />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4" /> {PERIOD_LABEL[period]} preview
          </CardTitle>
          <CardDescription>
            {from} → {new Date().toISOString().slice(0, 10)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {summary ? (
            <p className="rounded-lg bg-muted p-4 whitespace-pre-line">{summary}</p>
          ) : null}
          {rows.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No activities recorded in this period.
            </p>
          ) : (
            <div className="space-y-4">
              {rows.map((r) => (
                <div key={r.id} className="border-l-2 border-border pl-4">
                  <p className="font-medium">
                    {r.activity_date} — {r.title}
                  </p>
                  <p className="whitespace-pre-line text-muted-foreground">{r.description}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {r.skills_gained.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
