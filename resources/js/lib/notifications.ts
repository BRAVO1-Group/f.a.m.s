import {
  getStoredActivities,
  getStoredInternships,
  milestones,
  profiles,
} from "@/lib/mock-data";
import type { AppRole } from "@/lib/auth";

export type NotificationSeverity = "critical" | "warning" | "info";

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  severity: NotificationSeverity;
  category: string;
  timestamp: string;
  href: string;
  actionLabel: string;
};

const READ_KEY = "internflow_notifications_read";
const DISMISSED_KEY = "internflow_notifications_dismissed";

function readIdSet(key: string): Set<string> {
  try {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return new Set(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    }
  } catch {
    // ignore storage errors
  }
  return new Set();
}

function writeIdSet(key: string, ids: Set<string>) {
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(Array.from(ids)));
      window.dispatchEvent(new Event("internflow-notifications-change"));
    }
  } catch {
    // ignore storage errors
  }
}

export function getReadNotificationIds(): Set<string> {
  return readIdSet(READ_KEY);
}

export function getDismissedNotificationIds(): Set<string> {
  return readIdSet(DISMISSED_KEY);
}

export function markNotificationAsRead(id: string) {
  const set = readIdSet(READ_KEY);
  if (!set.has(id)) {
    set.add(id);
    writeIdSet(READ_KEY, set);
  }
}

export function markAllNotificationsAsRead(ids: string[]) {
  const set = readIdSet(READ_KEY);
  ids.forEach((id) => set.add(id));
  writeIdSet(READ_KEY, set);
}

export function dismissNotification(id: string) {
  const set = readIdSet(DISMISSED_KEY);
  if (!set.has(id)) {
    set.add(id);
    writeIdSet(DISMISSED_KEY, set);
  }
}

export function resetDismissedNotifications() {
  writeIdSet(DISMISSED_KEY, new Set());
}

function getStudentName(studentId: string): string {
  return profiles.find((p) => p.id === studentId)?.full_name ?? "Assigned Student";
}

export function getNotificationsForRole(role: AppRole, userId?: string): AppNotification[] {
  const items: AppNotification[] = [];
  const internships = getStoredInternships();
  const activities = getStoredActivities();

  if (role === "uni_admin" || role === "system_admin") {
    const missingAcademic = internships.filter((i) => !i.academic_supervisor_id);
    missingAcademic.forEach((intern) => {
      const studentName = getStudentName(intern.student_id);
      items.push({
        id: `missing-academic-${intern.student_id}`,
        title: "Missing Academic Assessor",
        description: `${studentName} has no assigned University Academic Supervisor for defense clearance.`,
        severity: "critical",
        category: "Supervisor Pairing",
        timestamp: "Action required",
        href: "/assignments",
        actionLabel: "Assign Assessor",
      });
    });

    const missingOrg = internships.filter((i) => !i.supervisor_id);
    missingOrg.forEach((intern) => {
      const studentName = getStudentName(intern.student_id);
      items.push({
        id: `missing-org-${intern.student_id}`,
        title: "Missing Host Org Mentor",
        description: `${studentName} still needs a designated host organization field mentor.`,
        severity: "warning",
        category: "Supervisor Pairing",
        timestamp: "Action required",
        href: "/assignments",
        actionLabel: "Pair Mentor",
      });
    });

    items.push({
      id: "cohort-attendance-risk-student-4",
      title: "Cohort Attendance Risk",
      description:
        "Kevin Kiprono has logged 18 of 60 required attachment days and is flagged as at risk.",
      severity: "critical",
      category: "Attendance",
      timestamp: "Today",
      href: "/admin",
      actionLabel: "Review Placement",
    });

    const pendingLogs = activities.filter((a) => a.status === "submitted");
    if (pendingLogs.length > 0) {
      items.push({
        id: `cohort-pending-logs-${pendingLogs.length}`,
        title: `${pendingLogs.length} Logbook ${pendingLogs.length === 1 ? "Entry" : "Entries"} Awaiting Sign-Off`,
        description:
          "Student submissions across active placements are awaiting supervisor verification.",
        severity: "warning",
        category: "Logbook Compliance",
        timestamp: "Active",
        href: "/admin",
        actionLabel: "View Placements",
      });
    }

    items.push({
      id: "rbac-audit-check",
      title: "RBAC Permissions Matrix Active",
      description: "Review role privileges and accreditation export permissions for the current term.",
      severity: "info",
      category: "Governance",
      timestamp: "This week",
      href: "/rbac",
      actionLabel: "Open RBAC",
    });
  } else if (role === "supervisor" || role === "org_admin") {
    const pendingLogs = activities.filter((a) => a.status === "submitted");
    if (pendingLogs.length > 0) {
      const latest = pendingLogs[0]!;
      items.push({
        id: `supervisor-pending-logs-${pendingLogs.length}`,
        title: `${pendingLogs.length} Pending Logbook ${pendingLogs.length === 1 ? "Submission" : "Submissions"}`,
        description: `Latest: "${latest.title}" by ${getStudentName(latest.student_id)} awaiting sign-off.`,
        severity: "critical",
        category: "Review Queue",
        timestamp: latest.activity_date,
        href: "/review",
        actionLabel: "Review Queue",
      });
    }

    const corrections = activities.filter((a) => a.status === "needs_correction");
    if (corrections.length > 0) {
      items.push({
        id: `supervisor-corrections-${corrections.length}`,
        title: `${corrections.length} Revision ${corrections.length === 1 ? "Request" : "Requests"} Open`,
        description: "Waiting on intern updates for entries flagged for correction.",
        severity: "warning",
        category: "Revisions",
        timestamp: "In progress",
        href: "/review",
        actionLabel: "Inspect",
      });
    }

    items.push({
      id: "supervisor-evaluation-reminder",
      title: "Mid-Term Evaluation Window",
      description: "Ensure competency scores and mentor remarks are finalized for assigned interns.",
      severity: "info",
      category: "Evaluations",
      timestamp: "Upcoming",
      href: "/evaluations",
      actionLabel: "Open Evaluations",
    });
  } else {
    // Student
    const studentActivities = userId
      ? activities.filter((a) => a.student_id === userId)
      : activities;

    const needsCorrection = studentActivities.filter((a) => a.status === "needs_correction");
    needsCorrection.forEach((act) => {
      items.push({
        id: `student-correction-${act.id}`,
        title: "Revision Requested on Log Entry",
        description: `"${act.title}" needs updates based on your supervisor's feedback.`,
        severity: "critical",
        category: "Logbook",
        timestamp: act.activity_date,
        href: "/logbook",
        actionLabel: "Update Entry",
      });
    });

    const submitted = studentActivities.filter((a) => a.status === "submitted");
    if (submitted.length > 0) {
      items.push({
        id: `student-pending-review-${submitted.length}`,
        title: `${submitted.length} ${submitted.length === 1 ? "Entry" : "Entries"} Awaiting Approval`,
        description: "Your recent logbook submissions are in your mentor's review queue.",
        severity: "info",
        category: "Logbook",
        timestamp: "In review",
        href: "/logbook",
        actionLabel: "View Logbook",
      });
    }

    const activeMilestone =
      milestones.find((m) => (!userId || m.student_id === userId) && m.status === "in_progress") ??
      milestones.find((m) => m.status === "in_progress");

    if (activeMilestone) {
      const remaining = activeMilestone.tasks.filter((t) => !t.completed).length;
      if (remaining > 0) {
        items.push({
          id: `student-milestone-${activeMilestone.id}`,
          title: `${remaining} Milestone ${remaining === 1 ? "Deliverable" : "Deliverables"} Remaining`,
          description: `${activeMilestone.phase}: ${activeMilestone.title} (${activeMilestone.target_week}).`,
          severity: "warning",
          category: "Milestones",
          timestamp: activeMilestone.target_week,
          href: "/milestones",
          actionLabel: "View Roadmap",
        });
      }
    }

    items.push({
      id: "student-attendance-checkin",
      title: "Daily Shift & Logbook Reminder",
      description: "Remember to record your clock-out and submit today's activity summary.",
      severity: "info",
      category: "Attendance",
      timestamp: "Today",
      href: "/attendance",
      actionLabel: "Attendance",
    });
  }

  return items;
}
