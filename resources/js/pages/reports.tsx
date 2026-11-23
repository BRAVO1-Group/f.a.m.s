import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  FileBarChart,
  FileOutput,
  FileText,
  Loader2,
  PieChart as PieChartIcon,
  Printer,
  RotateCcw,
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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useAppUser } from "@/lib/app-user";
import {
  getStoredActivities,
  getStoredEvaluations,
  getStoredSupervisors,
  organizations,
  profiles,
  type MockActivity,
  type MockEvaluation,
} from "@/lib/mock-data";

type Period = "week" | "month" | "final";

const PERIOD_LABEL: Record<Period, string> = {
  week: "Weekly Supervision Report",
  month: "Monthly Supervision Report",
  final: "Final Internship Supervision Report",
};

function since(period: Period) {
  const d = new Date();
  if (period === "week") d.setDate(d.getDate() - 7);
  else if (period === "month") d.setMonth(d.getMonth() - 1);
  else d.setFullYear(d.getFullYear() - 5);
  return d.toISOString().slice(0, 10);
}

function calcHours(arrival?: string | null, departure?: string | null): number {
  if (!arrival || !departure) return 8;
  const [ah = 9, am = 0] = arrival.split(":").map(Number);
  const [dh = 17, dm = 0] = departure.split(":").map(Number);
  const diff = dh + dm / 60 - (ah + am / 60);
  return diff > 0 ? Number(diff.toFixed(1)) : 8;
}

export default function ReportsPage() {
  const { userId, name, email, role } = useAppUser();
  const isMentorOrAdmin = role !== "student";

  const [period, setPeriod] = useState<Period>("final");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const [summary, setSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [evalsList, setEvalsList] = useState<MockEvaluation[]>(getStoredEvaluations);

  useEffect(() => {
    const handler = () => {
      setActivitiesList(getStoredActivities());
      setEvalsList(getStoredEvaluations());
    };
    window.addEventListener("internflow-activities-change", handler);
    window.addEventListener("internflow-data-change", handler);
    return () => {
      window.removeEventListener("internflow-activities-change", handler);
      window.removeEventListener("internflow-data-change", handler);
    };
  }, []);

  const supervisorsList = getStoredSupervisors();
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];

  const assignedStudentIds = useMemo(
    () =>
      currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
        ? currentSupervisor.assigned_student_ids
        : ["student-1", "student-4"],
    [currentSupervisor],
  );

  const assignedStudents = useMemo(
    () => profiles.filter((p) => assignedStudentIds.includes(p.id)),
    [assignedStudentIds],
  );

  const from = since(period);

  const rows = useMemo(() => {
    const base = isMentorOrAdmin
      ? activitiesList.filter((a) =>
          selectedStudentId === "all"
            ? assignedStudentIds.includes(a.student_id)
            : a.student_id === selectedStudentId,
        )
      : activitiesList.filter((a) => a.student_id === userId);

    const filtered = base.filter((a) => a.activity_date >= from);
    const activeSet = filtered.length > 0 ? filtered : base;
    return [...activeSet].sort((a, b) => (a.activity_date > b.activity_date ? 1 : -1));
  }, [activitiesList, isMentorOrAdmin, assignedStudentIds, selectedStudentId, userId, from]);

  const approved = rows.filter((r) => r.status === "approved").length;
  const pending = rows.filter((r) => r.status === "submitted").length;
  const needsCorrection = rows.filter((r) => r.status === "needs_correction").length;
  const drafts = rows.filter((r) => r.status === "draft").length;
  const signOffRate = rows.length > 0 ? Math.round((approved / rows.length) * 100) : 0;

  const totalHours = useMemo(
    () => rows.reduce((sum, r) => sum + calcHours(r.arrival_time, r.departure_time), 0),
    [rows],
  );

  const skills = Array.from(new Set(rows.flatMap((r) => r.skills_gained)));
  const tools = Array.from(new Set(rows.flatMap((r) => r.tools_used)));

  // Per-Mentee Supervision Breakdown (For Field Mentor & Admin)
  const menteeStats = useMemo(() => {
    const cohort = [
      {
        id: "student-1",
        name: "Alice Wanjiku",
        regNo: "CS/2021/0042",
        role: "Software Engineering Intern",
        daysLogged: 42,
        requiredDays: 60,
        attendanceRate: "97.5%",
      },
      {
        id: "student-4",
        name: "Kevin Kiprono",
        regNo: "CS/2021/0104",
        role: "Cybersecurity Analyst Intern",
        daysLogged: 18,
        requiredDays: 60,
        attendanceRate: "95.0%",
      },
    ];

    return cohort.map((m) => {
      const mLogs = activitiesList.filter((a) => a.student_id === m.id);
      const mApproved = mLogs.filter((a) => a.status === "approved").length;
      const mPending = mLogs.filter((a) => a.status === "submitted").length;
      const mRevision = mLogs.filter((a) => a.status === "needs_correction").length;
      const mHours = mLogs.reduce((sum, r) => sum + calcHours(r.arrival_time, r.departure_time), 0);
      const latestEval = evalsList.find((e) => e.student_id === m.id);

      return {
        ...m,
        totalLogs: mLogs.length,
        approvedLogs: mApproved,
        pendingLogs: mPending,
        revisionLogs: mRevision,
        hours: mHours,
        grade: latestEval ? `${latestEval.grade} (${latestEval.overall_score}/5.0)` : "Not Graded Yet",
      };
    });
  }, [activitiesList, evalsList]);

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
        { name: "Approved & Signed", value: approved, color: "var(--chart-1)" },
        { name: "Submitted (Pending)", value: pending, color: "var(--chart-4)" },
        { name: "Revision Requested", value: needsCorrection, color: "var(--chart-2)" },
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
      toast.warning("Empty Report Data", {
        description: "No logbook activities found in this reporting period.",
      });
      return;
    }
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const summaryText = isMentorOrAdmin
      ? `Field Mentor Supervision Summary (${PERIOD_LABEL[period]}): Under the workplace supervision of ${name || currentSupervisor?.full_name || "Field Mentor"} at ${organizations[0]?.name || "TechCorp Solutions"}, ${assignedStudents.length} assigned interns recorded ${rows.length} logbook submissions totaling ${totalHours.toFixed(1)} supervised hours. ${approved} entries (${signOffRate}%) have been formally approved and signed off with mentor comments, ${pending} are currently awaiting review, and ${needsCorrection} were returned for technical revision. Core technologies verified include ${tools.slice(0, 5).join(", ")}.`
      : `During this ${period} reporting period, ${name || "the intern"} logged ${rows.length} technical activities totaling ${totalHours.toFixed(1)} workplace hours, with ${approved} entries formally verified and approved by the Field Mentor. Key deliverables included: ${rows
          .slice(0, 3)
          .map((r) => r.title)
          .join("; ")}. Core competencies demonstrated include ${skills.slice(0, 5).join(", ")}.`;

    setSummary(summaryText);
    setAiLoading(false);
    toast.success("Executive Supervision Summary Generated");
  }

  function buildHtml() {
    const nameOf = (id: string) => profiles.find((p) => p.id === id)?.full_name || "Intern";
    const items = rows
      .map(
        (r) => `<h3>${r.activity_date} — ${escapeHtml(r.title)} (${escapeHtml(nameOf(r.student_id))})</h3>
<p>${escapeHtml(r.description)}</p>
<p><em>Tools:</em> ${r.tools_used.map(escapeHtml).join(", ") || "—"}<br/>
<em>Skills:</em> ${r.skills_gained.map(escapeHtml).join(", ") || "—"}<br/>
<em>Status:</em> <strong>${r.status === "approved" ? "APPROVED & SIGNED OFF" : r.status.replace("_", " ").toUpperCase()}</strong><br/>
<em>Field Mentor Comment:</em> ${escapeHtml(r.supervisor_feedback || r.supervisor_comment || "Verified by Field Mentor")}</p>`,
      )
      .join("\n");

    return `<html><head><meta charset="utf-8"><title>${PERIOD_LABEL[period]}</title></head>
<body style="font-family:Georgia,serif;line-height:1.6;padding:32px;max-width:800px;margin:0 auto">
<h1>${PERIOD_LABEL[period]}</h1>
<p><strong>${isMentorOrAdmin ? "Field Mentor / Supervisor:" : "Student Intern:"}</strong> ${escapeHtml(name || email)}<br/>
<strong>Host Organization:</strong> ${escapeHtml(organizations[0]?.name || "TechCorp Solutions")}<br/>
<strong>Reporting Period:</strong> ${from} to ${new Date().toISOString().slice(0, 10)}<br/>
<strong>Supervision Stats:</strong> ${rows.length} total submissions · ${approved} Approved (${signOffRate}% sign-off rate) · ${pending} Pending · ${totalHours.toFixed(1)} Supervised Hours</p>
${summary ? `<h2>Executive Supervision Summary</h2><p>${escapeHtml(summary)}</p>` : ""}
<h2>Verified Logbook Submissions &amp; Mentor Comments</h2>
${items || "<p>No activities recorded.</p>"}
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
    toast.success("Official Word report downloaded");
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

  const nameOfStudent = (id: string) =>
    profiles.find((p) => p.id === id)?.full_name || "Assigned Intern";

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── Top Banner Card ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs font-semibold">
                {isMentorOrAdmin ? "Field Mentor Supervision Report & Stats" : "Student Dossier"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {organizations[0]?.name ?? "TechCorp Solutions"} · Verified Analytics &amp; Export
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isMentorOrAdmin
                ? "Field Mentor Supervision Reports & Stats"
                : "Reports & Analytics Dossier"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {isMentorOrAdmin
                ? "Track your logbook sign-off rate, supervised workplace hours, student attendance pace, and export official Field Mentor supervision reports."
                : "Analyze logged hours, approval metrics, and skill growth, and export accredited reports."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button onClick={generateSummary} disabled={aiLoading} size="sm" className="h-9 gap-1.5 text-xs font-semibold">
              {aiLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <FileOutput className="size-3.5" />
              )}
              Generate Summary
            </Button>
            <Button variant="outline" size="sm" onClick={printPdf} className="h-9 gap-1.5 text-xs font-medium">
              <Printer className="size-3.5" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={downloadWord} className="h-9 gap-1.5 text-xs font-medium">
              <Download className="size-3.5" /> Download Word
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Filter Bar: Reporting Period + Student Scope ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardContent className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs value={period} onValueChange={(v: string) => setPeriod(v as Period)}>
            <TabsList className="h-9">
              <TabsTrigger value="week" className="text-xs">
                Weekly Report
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs">
                Monthly Report
              </TabsTrigger>
              <TabsTrigger value="final" className="text-xs">
                Full Supervision Report
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isMentorOrAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Intern Scope:</span>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-52 h-9 text-xs">
                  <SelectValue placeholder="All Assigned Interns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Assigned Interns ({assignedStudents.length})
                  </SelectItem>
                  {assignedStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 4 Key Field Mentor / Student Stats KPI Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={isMentorOrAdmin ? "Supervised Submissions" : "Logged Activities"}
          value={rows.length}
          unit="logbooks"
          meta={`Period: ${PERIOD_LABEL[period]}`}
        />
        <KpiCard
          label={isMentorOrAdmin ? "Mentor Sign-Off Rate" : "Approved Entries"}
          value={`${signOffRate}%`}
          unit={`(${approved} of ${rows.length})`}
          meta={`${pending} submitted · ${needsCorrection} revisions`}
        />
        <KpiCard
          label={isMentorOrAdmin ? "Supervised Workplace Hours" : "Total Hours Logged"}
          value={totalHours.toFixed(1)}
          unit="hrs"
          meta="Verified from daily shift logs"
        />
        <KpiCard
          label={isMentorOrAdmin ? "Evaluations & Grades" : "Skills & Tools Applied"}
          value={isMentorOrAdmin ? evalsList.length : skills.length + tools.length}
          unit={isMentorOrAdmin ? "signed forms" : "competencies"}
          meta={
            isMentorOrAdmin
              ? `${skills.length} skills & ${tools.length} tools verified`
              : `${skills.length} skills · ${tools.length} tools`
          }
        />
      </div>

      {/* ── Field Mentor Per-Intern Supervision Breakdown Table/Cards ── */}
      {isMentorOrAdmin && (
        <Card className="rounded-xl border border-border/60 bg-card">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <FileBarChart className="size-4 text-muted-foreground" />
              Assigned Interns Supervision Statistics
            </CardTitle>
            <CardDescription>
              Per-student breakdown of attendance days, approved logbooks, pending submissions, and grading status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="grid gap-4 md:grid-cols-2">
              {menteeStats.map((m) => {
                const pct = Math.round((m.daysLogged / m.requiredDays) * 100);
                const initials = m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("");

                return (
                  <div
                    key={m.id}
                    className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-muted text-foreground font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/students/${m.id}`}
                            className="text-sm font-semibold text-foreground hover:text-[#589E10] dark:hover:text-primary transition-colors"
                          >
                            {m.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {m.regNo} · {m.role}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {m.grade}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Attendance Pace ({m.attendanceRate})</span>
                        <span className="font-mono font-semibold text-foreground">
                          {m.daysLogged} / {m.requiredDays} days ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-border/50 pt-3">
                      <div className="rounded-lg border border-border/60 bg-card p-2.5">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                          Approved
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">
                          {m.approvedLogs} logs
                        </span>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-card p-2.5">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                          Submitted
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">
                          {m.pendingLogs} pending
                        </span>
                      </div>
                      <div className="rounded-lg border border-border/60 bg-card p-2.5">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                          Supervised
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">
                          {m.hours.toFixed(0)} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Analytics Charts Grid ── */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Daily Working Hours & Activity Trend */}
        <Card className="lg:col-span-7 rounded-xl border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" />
              {isMentorOrAdmin
                ? "Supervised Daily Working Hours Trend"
                : "Daily Working Hours & Activity Trend"}
            </CardTitle>
            <CardDescription>
              Logged workplace hours and competencies verified across each activity date
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
        <Card className="lg:col-span-5 rounded-xl border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="size-4 text-primary" />
              Field Mentor Sign-Off Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of Approved vs. Submitted logbook entries
            </CardDescription>
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
      <Card className="rounded-xl border border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-4 text-primary" />
            Top Competencies &amp; Technical Tools Verified
          </CardTitle>
          <CardDescription>
            Most frequently documented skills and frameworks across supervised logbook entries
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

      {/* Dossier Preview with Coloured Approved / Submitted Labels */}
      <Card className="rounded-xl border border-border/60">
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
            <div className="rounded-xl border border-[#589E10]/35 bg-[#9CE840]/12 dark:border-[#9CE840]/30 dark:bg-[#9CE840]/10 p-4 space-y-1">
              <p className="text-xs font-bold text-[#2D5408] dark:text-[#9CE840]">
                Executive Supervision Summary
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
            <div className="space-y-3">
              {rows.map((r) => {
                const isApproved = r.status === "approved";
                const isRevision = r.status === "needs_correction";
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {r.activity_date} — {r.title}
                        </span>
                        {isMentorOrAdmin && (
                          <Badge variant="outline" className="text-[11px]">
                            {nameOfStudent(r.student_id)}
                          </Badge>
                        )}
                      </div>

                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#589E10]/40 bg-[#9CE840]/20 px-2.5 py-0.5 text-xs font-bold text-[#2D5408] dark:border-[#9CE840]/40 dark:bg-[#9CE840]/15 dark:text-[#9CE840]">
                          <CheckCircle2 className="size-3.5" />
                          Approved &amp; Signed Off
                        </span>
                      ) : isRevision ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                          <RotateCcw className="size-3.5" />
                          Revision Requested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <Clock className="size-3.5" />
                          Submitted · Pending Approval
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-line text-xs text-muted-foreground">
                      {r.description}
                    </p>

                    {(r.supervisor_comment || r.supervisor_feedback) && (
                      <p className="text-xs font-medium text-foreground/90 pt-1">
                        <span className="text-[#2D5408] dark:text-[#9CE840] font-bold">
                          Field Mentor Comment:{" "}
                        </span>
                        {r.supervisor_comment || r.supervisor_feedback}
                      </p>
                    )}
                  </div>
                );
              })}
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
