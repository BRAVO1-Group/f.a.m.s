import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAppUser } from "@/lib/app-user";
import {
  ROLE_LABELS,
  ROLE_TIERS,
  setDemoUser,
  hasPermission,
  usePermissions,
  type AppRole,
} from "@/lib/auth";
import {
  activities as initialActivities,
  attendance as initialAttendance,
  internships as initialInternships,
  milestones,
  evaluations,
  organizations,
  DEMO_USERS,
  profiles,
  SYSTEM_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getStoredSupervisors,
  addSupervisor,
  getStoredRBAC,
  saveStoredRBAC,
  getStoredInternships,
  assignSupervisors,
  getStoredActivities,
  saveStoredActivities,
  approveOrCorrectActivity,
  type MockActivity,
  type MockSupervisor,
  type MockInternship,
  type RolePermissionsMap,
  type SupervisorType,
} from "@/lib/mock-data";

import { getGreeting } from "./get-greeting";

// ─────────────────────────────────────────────────────────────────────────────
// 2. WORKPLACE SUPERVISOR DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function SupervisorDashboard({ userId, name }: { userId: string; name: string }) {
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>(getStoredActivities);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("submitted");
  const [reviewModalActivity, setReviewModalActivity] = useState<MockActivity | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");

  const greeting = getGreeting();
  const supervisorsList = getStoredSupervisors();
  const currentSupervisor =
    supervisorsList.find((s) => s.user_id === userId || s.id === userId) ||
    supervisorsList.find((s) => s.type === "organization") ||
    supervisorsList[0];
  const isOrgSupervisor = currentSupervisor?.type === "organization";

  // Host org supervisor assigned student IDs (James Otieno supervises Alice Wanjiku & Kevin Kiprono at TechCorp)
  const assignedStudentIds: string[] =
    currentSupervisor?.assigned_student_ids && currentSupervisor.assigned_student_ids.length > 0
      ? currentSupervisor.assigned_student_ids
      : ["student-1", "student-4"];

  useEffect(() => {
    const handler = () => {
      setActivitiesList(getStoredActivities());
    };
    window.addEventListener("internflow-activities-change", handler);
    return () => window.removeEventListener("internflow-activities-change", handler);
  }, []);

  // Assigned student profiles details
  const assignedStudentsDetails = [
    {
      id: "student-1",
      name: "Alice Wanjiku",
      regNo: "CS/2021/0042",
      role: "Software Engineering Intern",
      department: "Product Engineering",
      company: "TechCorp Kenya Ltd",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science",
      email: "alice@university.ac.ke",
      phone: "+254 712 345 678",
      academicSupervisor: "Dr. Agnes Kimani (agnes.kimani@uonbi.ac.ke)",
      daysLogged: 42,
      requiredDays: 60,
      attendanceRate: "97.5%",
      currentPhase: "Phase 2: Core Engineering & Testing",
      status: "Active • On Track",
      avatarFallback: "AW",
    },
    {
      id: "student-2",
      name: "Brian Mwangi",
      regNo: "CS/2021/0067",
      role: "Cloud Infrastructure Intern",
      department: "Infrastructure & Cloud",
      company: "Safaricom PLC",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science",
      email: "brian@university.ac.ke",
      phone: "+254 722 556 778",
      academicSupervisor: "Dr. Joyce Chelangat (jchelangat@university.ac.ke)",
      daysLogged: 36,
      requiredDays: 60,
      attendanceRate: "96.0%",
      currentPhase: "Phase 2: Cloud Deployment & Monitoring",
      status: "Active • On Track",
      avatarFallback: "BM",
    },
    {
      id: "student-3",
      name: "Faith Njeri",
      regNo: "CS/2021/0089",
      role: "Data Analytics Intern",
      department: "Business Intelligence",
      company: "Kenya Commercial Bank",
      institution: "University of Nairobi",
      degree: "BSc. Information Systems",
      email: "faith@university.ac.ke",
      phone: "+254 733 112 233",
      academicSupervisor: "Dr. Peter Kamau (dean@university.ac.ke)",
      daysLogged: 40,
      requiredDays: 60,
      attendanceRate: "98.0%",
      currentPhase: "Phase 2: BI Dashboards & ETL",
      status: "Active • On Track",
      avatarFallback: "FN",
    },
    {
      id: "student-4",
      name: "Kevin Kiprono",
      regNo: "CS/2021/0104",
      role: "Cybersecurity Analyst Intern",
      department: "InfoSec Operations",
      company: "TechCorp Kenya Ltd",
      institution: "University of Nairobi",
      degree: "BSc. Computer Science (Cybersecurity)",
      email: "kevin.kiprono@university.ac.ke",
      phone: "+254 701 445 566",
      academicSupervisor: "Dr. Agnes Kimani (agnes.kimani@uonbi.ac.ke)",
      daysLogged: 18,
      requiredDays: 60,
      attendanceRate: "95.0%",
      currentPhase: "Phase 1: SIEM & Vulnerability Assessment",
      status: "Active • In Progress",
      avatarFallback: "KK",
    },
  ].filter((s) => assignedStudentIds.includes(s.id));

  // Scoped strictly to submissions from assigned students
  const myAssignedActivities = activitiesList.filter((a) =>
    assignedStudentIds.includes(a.student_id),
  );

  const pendingActivities = myAssignedActivities.filter((a) => a.status === "submitted");
  const approvedActivities = myAssignedActivities.filter((a) => a.status === "approved");
  const correctionActivities = myAssignedActivities.filter((a) => a.status === "needs_correction");

  // Activities filtered by student select and status tab
  const displayedActivities = myAssignedActivities.filter((a) => {
    if (selectedStudentFilter !== "all" && a.student_id !== selectedStudentFilter) {
      return false;
    }
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const handleQuickApprove = (act: MockActivity) => {
    const studentObj = assignedStudentsDetails.find((s) => s.id === act.student_id);
    approveOrCorrectActivity(
      act.id,
      "approved",
      userId,
      "Verified and approved by Host Organization Mentor (TechCorp Kenya Ltd).",
    );
    setActivitiesList(getStoredActivities());
    toast.success("Submission Approved", {
      description: `"${act.title}" for ${studentObj?.name ?? "Intern"} has been verified and signed off.`,
    });
  };

  const handleReviewAction = (action: "approved" | "needs_correction") => {
    if (!reviewModalActivity) return;
    const studentObj = assignedStudentsDetails.find((s) => s.id === reviewModalActivity.student_id);
    const defaultFeedback =
      action === "approved"
        ? "Work meets organizational engineering standards. Great implementation and documentation."
        : "Please revise this activity log with additional details on your testing procedures and root cause analysis.";

    approveOrCorrectActivity(
      reviewModalActivity.id,
      action,
      userId,
      reviewFeedback.trim() || defaultFeedback,
    );
    setActivitiesList(getStoredActivities());
    toast.success(action === "approved" ? "Submission Approved" : "Correction Requested", {
      description:
        action === "approved"
          ? `Approved "${reviewModalActivity.title}" for ${studentObj?.name ?? "Intern"}.`
          : `Requested revision from ${studentObj?.name ?? "Intern"} on "${reviewModalActivity.title}".`,
    });
    setReviewModalActivity(null);
    setReviewFeedback("");
  };

  const getStudentName = (studentId: string) => {
    const found = assignedStudentsDetails.find((s) => s.id === studentId);
    return found ? found.name : "Assigned Intern";
  };

  return (
    <div className="dashboard-page space-y-6 antialiased">
      {/* ── Supervisor Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {currentSupervisor?.organization_name ?? "TechCorp Kenya Ltd"} ·{" "}
            {currentSupervisor?.faculty_department ?? "Product Engineering"} · Supervising{" "}
            {assignedStudentsDetails.length} interns
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/review">Review Queue ({pendingActivities.length})</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-semibold h-9">
            <Link href="/students">Assigned Interns ({assignedStudentsDetails.length})</Link>
          </Button>
        </div>
      </div>

      {/* ── Supervisor KPI Cards (Scoped to Assigned Students) ── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Assigned Interns"
          value={assignedStudentsDetails.length}
          meta={assignedStudentsDetails.map((s) => s.name).join(" · ") || "No interns assigned"}
        />
        <KpiCard
          label="Pending Approval"
          value={pendingActivities.length}
          meta="Awaiting sign-off"
        />
        <KpiCard
          label="Approved Deliverables"
          value={approvedActivities.length}
          meta={isOrgSupervisor ? "Signed off by host supervisor" : "Verified by university supervisor"}
        />
        <KpiCard
          label="Revisions Requested"
          value={correctionActivities.length}
          meta="Flagged for correction"
        />
      </div>

      {/* ── Assigned Student Details (Candidate Profile & Placement Cards) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              My Assigned Student Interns
            </h2>
            <p className="text-xs text-muted-foreground">
              {isOrgSupervisor
                ? `Candidate profiles and placement tracks at ${currentSupervisor?.organization_name ?? "TechCorp Kenya Ltd"}`
                : "Candidate profiles and academic supervision tracks across host organizations"}
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
            <Link href="/students">View Full Cohort Roster</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {assignedStudentsDetails.map((student) => {
            const progressPct = Math.round((student.daysLogged / student.requiredDays) * 100);
            return (
              <Card
                key={student.id}
                className="shadow-card border-border/80 hover:border-primary/40 transition"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {student.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base font-semibold">{student.name}</CardTitle>
                        <CardDescription className="font-mono text-xs text-muted-foreground">
                          {student.regNo} • {student.degree}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium border-success/40 bg-success/10 text-success"
                    >
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  {/* Placement & Academic info */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3">
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Placement Role
                      </span>
                      <span className="font-semibold text-foreground">{student.role}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {student.department}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        Academic Assessor
                      </span>
                      <span className="font-semibold text-foreground">Dr. Agnes Kimani</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {student.institution}
                      </span>
                    </div>
                  </div>

                  {/* Progress Meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Attachment Attendance Pace</span>
                      <span className="font-mono font-semibold text-foreground">
                        {student.daysLogged} / {student.requiredDays} Days ({progressPct}%)
                      </span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Attendance: {student.attendanceRate}</span>
                      <span>{student.currentPhase}</span>
                    </div>
                  </div>

                  {/* Contacts & Direct Filter Action */}
                  <div className="flex flex-col items-start justify-between gap-2 border-t border-border/60 pt-1 xl:flex-row xl:items-center">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span>{student.email}</span>
                      <span>{student.phone}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedStudentFilter(student.id);
                        toast.info(`Filtered submissions for ${student.name}`);
                      }}
                      className="text-xs text-primary font-semibold h-7 px-2 hover:bg-primary/10"
                    >
                      Filter Submissions →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Submissions Made by Assigned Interns (Interactive Approval & Feedback System) ── */}
      <Card className="shadow-card border-border/80">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Submissions Made by Assigned Interns
              </CardTitle>
              <CardDescription>
                Review daily technical reports, sign off completed work, or request revisions with
                mentor guidance
              </CardDescription>
            </div>
            {/* Mentee filter selector */}
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <span className="text-xs font-medium text-muted-foreground">Filter Mentee:</span>
              <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
                <SelectTrigger className="h-9 w-full text-xs sm:w-[220px]">
                  <SelectValue placeholder="All Mentees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assigned Mentees (Alice & Kevin)</SelectItem>
                  <SelectItem value="student-1">Alice Wanjiku (Software Eng.)</SelectItem>
                  <SelectItem value="student-4">Kevin Kiprono (Cybersecurity)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md h-9 text-xs">
              <TabsTrigger value="submitted" className="text-xs flex items-center gap-1.5">
                Pending
                {pendingActivities.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] bg-primary/20 text-primary font-bold"
                  >
                    {pendingActivities.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs flex items-center gap-1.5">
                Approved
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-bold">
                  {approvedActivities.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="needs_correction" className="text-xs flex items-center gap-1.5">
                Corrections
                {correctionActivities.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] bg-warning/10 text-warning font-bold"
                  >
                    {correctionActivities.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All ({myAssignedActivities.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-3">
          {displayedActivities.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-xl border-border/80">
              <p className="font-semibold text-foreground">No submissions in this view</p>
              <p className="text-xs mt-1">
                {activeTab === "submitted"
                  ? "All activities submitted by your assigned mentees have been reviewed and approved."
                  : "Change the status tab or student filter to inspect other logbook entries."}
              </p>
              {selectedStudentFilter !== "all" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedStudentFilter("all")}
                  className="mt-3 text-xs"
                >
                  Clear Mentee Filter
                </Button>
              )}
            </div>
          ) : (
            displayedActivities.map((act) => {
              const studentName = getStudentName(act.student_id);
              return (
                <div
                  key={act.id}
                  className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{act.title}</span>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium border-primary/30 text-primary"
                        >
                          {studentName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Logged: {act.activity_date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge
                        variant={
                          act.status === "approved"
                            ? "default"
                            : act.status === "needs_correction"
                              ? "destructive"
                              : "secondary"
                        }
                        className={`text-xs capitalize ${
                          act.status === "approved"
                            ? "bg-success/10 text-success border-success/30"
                            : act.status === "needs_correction"
                              ? "bg-warning/10 text-warning border-warning/30"
                              : "bg-info/10 text-info-foreground border-info/30"
                        }`}
                      >
                        {act.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Tools and Details */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground mr-1">
                      Tools & Frameworks:
                    </span>
                    {act.tools_used.map((tool) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="text-[11px] font-normal py-0"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>

                  {/* Challenges & Solutions */}
                  {act.challenges && (
                    <div className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1">
                      <div className="text-muted-foreground">
                        <span className="font-medium text-foreground">Challenge Encountered: </span>
                        {act.challenges}
                      </div>
                      {act.solutions && (
                        <div className="text-muted-foreground">
                          <span className="font-medium text-foreground">Solution Applied: </span>
                          {act.solutions}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Supervisor Feedback Note if already approved or corrections requested */}
                  {act.supervisor_feedback && (
                    <div
                      className={`rounded-lg p-2.5 text-xs border ${
                        act.status === "approved"
                          ? "bg-success/10 border-success/30 text-success"
                          : "bg-warning/10 border-warning/30 text-warning"
                      }`}
                    >
                      <span className="font-semibold block mb-0.5">
                        {act.status === "approved"
                          ? "Host Org Mentor Feedback:"
                          : "Revision Feedback to Intern:"}
                      </span>
                      <p className="leading-relaxed">{act.supervisor_feedback}</p>
                      {act.reviewed_at && (
                        <span className="text-[10px] opacity-75 block mt-1">
                          Reviewed: {new Date(act.reviewed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Controls for Supervisor */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReviewModalActivity(act);
                        setReviewFeedback(act.supervisor_feedback || "");
                      }}
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      {act.status === "submitted" ? "Review & Feedback" : "Update Feedback"}
                    </Button>

                    {act.status === "submitted" && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickApprove(act)}
                        className="h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
                      >
                        Quick Approve
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* ── Modal Dialog for Detailed Review & Approval/Correction ── */}
      <Dialog
        open={!!reviewModalActivity}
        onOpenChange={(open) => !open && setReviewModalActivity(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Review Intern Logbook Submission
            </DialogTitle>
            <DialogDescription className="text-xs">
              {reviewModalActivity && (
                <>
                  {reviewModalActivity.title} — submitted by{" "}
                  <strong>{getStudentName(reviewModalActivity.student_id)}</strong> on{" "}
                  {reviewModalActivity.activity_date}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {reviewModalActivity && (
            <div className="space-y-3.5 py-2 text-xs">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Task & Technical Description
                </Label>
                <div className="mt-1 rounded-md bg-muted/40 p-2.5 text-muted-foreground leading-relaxed max-h-32 overflow-y-auto">
                  {reviewModalActivity.description}
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {reviewModalActivity.tools_used.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>

              {reviewModalActivity.challenges && (
                <div>
                  <Label className="text-xs font-semibold text-foreground">
                    Challenges & Solutions
                  </Label>
                  <p className="mt-1 text-muted-foreground">
                    {reviewModalActivity.challenges}
                    {reviewModalActivity.solutions ? ` — ${reviewModalActivity.solutions}` : ""}
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="mentor-note" className="text-xs font-semibold text-foreground">
                  Mentor Feedback Note & Guidance
                </Label>
                <Textarea
                  id="mentor-note"
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="e.g. Excellent work on the API endpoints and test coverage. Keep up the high standards..."
                  className="text-xs resize-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  This guidance note is saved to the candidate's permanent logbook and visible to
                  their University Academic Supervisor.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleReviewAction("needs_correction")}
              className="text-xs font-semibold border-warning/40 text-warning hover:bg-warning/10"
            >
              Request Revisions
            </Button>
            <Button
              type="button"
              onClick={() => handleReviewAction("approved")}
              className="text-xs font-semibold bg-primary text-primary-foreground"
            >
              Sign Off & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
