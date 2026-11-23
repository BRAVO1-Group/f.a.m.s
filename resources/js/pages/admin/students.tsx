import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { BookOpen, ChevronRight, Search, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useAppUser } from "@/lib/app-user";
import {
  getStoredSupervisors,
  type MockSupervisor,
} from "@/lib/mock-data";

export default function StudentsPage() {
  const { userId, role } = useAppUser();
  const [supervisorsList, setSupervisorsList] = useState<MockSupervisor[]>(getStoredSupervisors);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = () => {
      setSupervisorsList(getStoredSupervisors());
    };
    window.addEventListener("internflow-data-change", handler);
    return () => window.removeEventListener("internflow-data-change", handler);
  }, []);

  const universityCohort = [
    {
      studentId: "student-1",
      regNo: "CS/2021/0042",
      name: "Alice Wanjiku",
      role: "Software Engineering Intern",
      course: "BSc. Computer Science",
      company: "TechCorp Kenya Ltd",
      department: "Product Engineering",
      daysLogged: 42,
      targetDays: 60,
      status: "On Track",
    },
    {
      studentId: "student-2",
      regNo: "CS/2021/0088",
      name: "Brian Mwangi",
      role: "Cloud & Network Engineering Intern",
      course: "BSc. Telecommunications & Networking",
      company: "Safaricom PLC",
      department: "Infrastructure & Cloud",
      daysLogged: 39,
      targetDays: 60,
      status: "On Track",
    },
    {
      studentId: "student-3",
      regNo: "CS/2021/0015",
      name: "Carol Achieng",
      role: "Data Science & BI Intern",
      course: "BSc. Data Science & Analytics",
      company: "Kenya Commercial Bank",
      department: "Business Intelligence",
      daysLogged: 60,
      targetDays: 60,
      status: "Clearance Granted",
    },
    {
      studentId: "student-4",
      regNo: "CS/2021/0104",
      name: "Kevin Kiprono",
      role: "Cybersecurity Analyst Intern",
      course: "BSc. Computer Science (Cybersecurity)",
      company: "TechCorp Kenya Ltd",
      department: "InfoSec Operations",
      daysLogged: 18,
      targetDays: 60,
      status: "In Progress",
    },
  ];

  const isSupervisor = role === "supervisor" || role === "org_admin";
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];

  const assignedStudentIds =
    currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
      ? currentSupervisor.assigned_student_ids
      : ["student-1", "student-4"];

  const scopedCohort = isSupervisor
    ? universityCohort.filter((s) => assignedStudentIds.includes(s.studentId))
    : universityCohort;

  const filtered = scopedCohort.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.regNo.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const avgDaysLogged =
    scopedCohort.length > 0
      ? (
          scopedCohort.reduce((acc, curr) => acc + curr.daysLogged, 0) / scopedCohort.length
        ).toFixed(1)
      : "0";
  const avgPct =
    scopedCohort.length > 0
      ? Math.round(
          scopedCohort.reduce((acc, curr) => acc + (curr.daysLogged / curr.targetDays) * 100, 0) /
            scopedCohort.length,
        )
      : 0;

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── High-Contrast Page Banner Card (Clean, Readable, No Eye-Straining Gradient) ── */}
      <Card className="rounded-xl border border-border/60 bg-card">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs font-semibold">
                Candidate Roster
              </Badge>
              <span className="text-xs text-muted-foreground">
                {currentSupervisor?.organization_name ?? "Host Organization"} · Internship Progress &amp; Supervision
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Assigned Student Interns
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Click on any student card to open their detailed supervision, attendance verification, workplace conduct, strengths, and grading workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className="h-9 rounded-lg text-xs font-semibold gap-1.5"
            >
              <Link href="/review">
                <BookOpen className="size-3.5" />
                Review Submissions Queue
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 4 Quiet KPI Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Assigned Candidates"
          value={scopedCohort.length}
          unit="students"
          meta="Under active supervision"
        />
        <KpiCard
          label="Average Completion"
          value={`${avgPct}%`}
          meta={`${avgDaysLogged} of 60 days logged avg`}
        />
        <KpiCard
          label="Pending Logbooks"
          value={2}
          unit="entries"
          meta="Submitted logs awaiting sign-off"
        />
        <KpiCard
          label="Clearance Ready"
          value={scopedCohort.filter((s) => s.daysLogged >= 60).length}
          unit="students"
          meta="Completed 60 / 60 days"
        />
      </div>

      {/* ── Search Bar ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search student name, reg no, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* ── Clean Minimalist Student Cards (Click Card -> Detailed Student Page) ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Matching Student Interns"
          description="No assigned interns match your current search query."
          secondaryAction={
            search ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSearch("")}
                className="h-8 text-xs font-medium"
              >
                Clear Search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((student) => {
            const pct = Math.min(
              100,
              Math.round((student.daysLogged / student.targetDays) * 100),
            );
            const initials = student.name
              .split(" ")
              .map((p) => p[0])
              .join("");

            return (
              <Link
                key={student.studentId}
                href={`/students/${student.studentId}`}
                className="group block focus:outline-none"
              >
                <Card className="rounded-xl border border-border/60 bg-card transition-all duration-150 hover:border-foreground/25 hover:shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="size-10 shrink-0 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-muted text-foreground font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground group-hover:text-[#589E10] dark:group-hover:text-primary transition-colors">
                            {student.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono">{student.regNo}</span> · {student.role}
                          </p>
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-[11px] font-medium shrink-0">
                        {student.status}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {student.company} · {student.department}
                        </span>
                        <span className="font-mono font-medium text-foreground">
                          {student.daysLogged} / {student.targetDays} days ({pct}%)
                        </span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                      <span className="text-muted-foreground">{student.course}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:translate-x-0.5 transition-transform">
                        Open Detailed Page
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
