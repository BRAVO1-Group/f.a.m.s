import { useMemo, useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileOutput,
  FileText,
  Loader2,
  PieChart as PieChartIcon,
  Printer,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppUser } from "@/lib/app-user";
import { getStoredActivities, type MockActivity } from "@/lib/mock-data";

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

function calcHours(arrival?: string, departure?: string): number {
  if (!arrival || !departure) return 8;
  const [ah = 9, am = 0] = arrival.split(":").map(Number);
  const [dh = 17, dm = 0] = departure.split(":").map(Number);
  const diff = dh + dm / 60 - (ah + am / 60);
  return diff > 0 ? Number(diff.toFixed(1)) : 8;
}

export default function ReportsPage() {
  const { userId, name, email } = useAppUser();
  const [period, setPeriod] = useState<Period>("final");
  const [summary, setSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);

  useEffect(() => {
    const handler = () => setActivitiesList(getStoredActivities());
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  const from = since(period);

  const rows = useMemo(() => {
    const userActivities = activitiesList.filter((a) => a.student_id === userId);
    const filtered = userActivities.filter((a) => a.activity_date >= from);
    const activeSet = filtered.length > 0 ? filtered : userActivities;
    return [...activeSet].sort((a, b) => (a.activity_date > b.activity_date ? 1 : -1));
  }, [activitiesList, userId, from]);

  const approved = rows.filter((r) => r.status === "approved").length;
  const pending = rows.filter((r) => r.status === "submitted").length;
  const needsCorrection = rows.filter((r) => r.status === "needs_correction").length;
  const drafts = rows.filter((r) => r.status === "draft").length;

  const totalHours = useMemo(
    () => rows.reduce((sum, r) => sum + calcHours(r.arrival_time, r.departure_time), 0),
    [rows],
  );

  const skills = Array.from(new Set(rows.flatMap((r) => r.skills_gained)));
  const tools = Array.from(new Set(rows.flatMap((r) => r.tools_used)));

  // Chart 1: Daily Hours & Activity Trend
  const dailyTrendData = useMemo(() => {
    return rows.map((r) => ({
      date: r.activity_date.slice(5),
      hours: calcHours(r.arrival_time, r.departure_time),
      skillsCount: r.skills_gained.length,
      title: r.title,
    }));
  }, [rows]);

  // Chart 2: Verification Status Distribution
  const statusChartData = useMemo(
    () =>
      [
        { name: "Approved", value: approved, color: "var(--chart-1)" },
        { name: "Pending Review", value: pending, color: "var(--chart-2)" },
        { name: "Needs Revision", value: needsCorrection, color: "var(--chart-4)" },
        { name: "Draft", value: drafts, color: "var(--chart-3)" },
      ].filter((item) => item.value > 0),
    [approved, pending, needsCorrection, drafts],
  );

  // Chart 3: Top Tools & Skills Frequency
  const skillsFrequencyData = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      [...r.skills_gained, ...r.tools_used].forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [rows]);

  async function generateSummary() {
    if (rows.length === 0) {
      toast.error("No activities in this period yet.");
      return;
    }
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const summaryText = `During this ${period} reporting period, ${name || "the intern"} logged ${rows.length} technical activities totaling ${totalHours.toFixed(1)} workplace hours, with ${approved} entries formally verified by the supervisor. Key deliverables included: ${rows
      .slice(0, 3)
      .map((r) => r.title)
      .join(
        "; ",
      )}. Core competencies demonstrated include ${skills.slice(0, 5).join(", ")}.`;
    setSummary(summaryText);
    setAiLoading(false);
    toast.success("Executive summary generated");
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
<strong>Activities:</strong> ${rows.length} (${approved} approved, ${totalHours.toFixed(1)} hrs)</p>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Reports & Analytics Dossier
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Analyze logged hours, approval metrics, and skill growth, and export accredited reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={generateSummary} disabled={aiLoading} size="sm" className="gap-1.5">
            {aiLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileOutput className="size-4" />
            )}
            Generate AI Summary
          </Button>
          <Button variant="outline" size="sm" onClick={printPdf} className="gap-1.5">
            <Printer className="size-4" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={downloadWord} className="gap-1.5">
            <Download className="size-4" /> Download Word
          </Button>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <Tabs value={period} onValueChange={(v: string) => setPeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="week">Weekly Report</TabsTrigger>
          <TabsTrigger value="month">Monthly Report</TabsTrigger>
          <TabsTrigger value="final">Full Placement Report</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* KPI Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Logged Activities"
          value={rows.length}
          unit="entries"
          meta={`Period: ${PERIOD_LABEL[period]}`}
        />
        <KpiCard
          label="Approved Entries"
          value={approved}
          unit={rows.length ? `(${Math.round((approved / rows.length) * 100)}%)` : "0%"}
          meta={`${pending} awaiting supervisor sign-off`}
        />
        <KpiCard
          label="Total Hours Logged"
          value={totalHours.toFixed(1)}
          unit="hrs"
          meta="Calculated from shift timestamps"
        />
        <KpiCard
          label="Skills & Tools Applied"
          value={skills.length + tools.length}
          unit="competencies"
          meta={`${skills.length} skills · ${tools.length} tools`}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Daily Working Hours & Activity Trend */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" />
              Daily Working Hours & Activity Trend
            </CardTitle>
            <CardDescription>
              Logged workplace hours and competencies gained across each activity date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyTrendData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyTrendData}
                    margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="reportHoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      name="Hours Worked"
                      stroke="var(--chart-1)"
                      strokeWidth={2.5}
                      fill="url(#reportHoursGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No activity data to chart for this period.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Verification Status Breakdown Donut Chart */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="size-4 text-primary" />
              Supervisor Verification Breakdown
            </CardTitle>
            <CardDescription>Distribution of logbook sign-off statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {statusChartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={52}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {statusChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={28} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No verification statuses available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Competencies & Tools Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-4 text-primary" />
            Top Competencies & Technical Tools Applied
          </CardTitle>
          <CardDescription>
            Most frequently documented skills and frameworks across your logbook entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skillsFrequencyData.length > 0 ? (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillsFrequencyData}
                  margin={{ top: 10, right: 16, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Entries Applied"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No skills or tools recorded yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dossier Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 text-primary" /> {PERIOD_LABEL[period]} Dossier Preview
          </CardTitle>
          <CardDescription>
            {from} → {new Date().toISOString().slice(0, 10)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {summary ? (
            <div className="rounded-xl border border-primary/25 bg-accent/35 p-4 space-y-1">
              <p className="text-xs font-semibold text-accent-foreground">
                AI Executive Summary
              </p>
              <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line">
                {summary}
              </p>
            </div>
          ) : null}
          {rows.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No activities recorded in this period.
            </p>
          ) : (
            <div className="space-y-4">
              {rows.map((r) => (
                <div key={r.id} className="border-l-2 border-primary/50 pl-4 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      {r.activity_date} — {r.title}
                    </p>
                    <Badge variant={r.status === "approved" ? "default" : "secondary"}>
                      {r.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="whitespace-pre-line text-xs text-muted-foreground">
                    {r.description}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {r.skills_gained.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[11px]">
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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
