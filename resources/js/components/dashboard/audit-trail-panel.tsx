import { useEffect, useState } from "react";
import { History, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppRole } from "@/lib/auth";

export type AuditLogEntry = {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  category: "logbook" | "attendance" | "placement" | "supervision" | "security";
  timestamp: string;
  scopes: AppRole[];
};

const AUDIT_STORAGE_KEY = "interntrack_audit_trail_v1";

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-1",
    actor: "Eng. James Otieno",
    actorRole: "Field Mentor",
    action: "Signed & Commented on Logbook Entry",
    target: "Alice Wanjiku · REST API Endpoint Integration",
    category: "supervision",
    timestamp: "Today, 11:42 AM",
    scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
  },
  {
    id: "aud-2",
    actor: "Alice Wanjiku",
    actorRole: "Student Intern",
    action: "Verified Workplace Attendance Check-In",
    target: "TechCorp Solutions · Shift 08:52 AM – 05:06 PM",
    category: "attendance",
    timestamp: "Today, 08:52 AM",
    scopes: ["student", "supervisor", "org_admin"],
  },
  {
    id: "aud-3",
    actor: "Dr. Peter Kamau",
    actorRole: "University Admin",
    action: "Dispatched Field Mentor OTP Onboarding Link",
    target: "james.otieno@techcorp.co.ug (Token: OTP-849201)",
    category: "security",
    timestamp: "Yesterday, 04:15 PM",
    scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
  },
  {
    id: "aud-4",
    actor: "Alice Wanjiku",
    actorRole: "Student Intern",
    action: "Uploaded Company Acceptance Confirmation Letter",
    target: "TechCorp_Internship_Acceptance_Letter_2026.pdf",
    category: "placement",
    timestamp: "Yesterday, 02:30 PM",
    scopes: ["student", "org_admin", "uni_admin", "system_admin"],
  },
  {
    id: "aud-5",
    actor: "Eng. James Otieno",
    actorRole: "Field Mentor",
    action: "Recorded Weekly Conduct & Student Strengths Review",
    target: "Alice Wanjiku · Week 7 (Exemplary Conduct)",
    category: "supervision",
    timestamp: "2 days ago, 05:10 PM",
    scopes: ["supervisor", "org_admin", "uni_admin", "system_admin"],
  },
  {
    id: "aud-6",
    actor: "Dr. Sarah Namukasa",
    actorRole: "Academic Assessor",
    action: "Scheduled Mid-Placement Academic Site Visit",
    target: "TechCorp Solutions · College of Computing & IS",
    category: "supervision",
    timestamp: "3 days ago, 10:05 AM",
    scopes: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
  },
];

export function getAuditTrail(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return INITIAL_AUDIT_LOGS;
    return JSON.parse(raw) as AuditLogEntry[];
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function recordAuditEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">) {
  try {
    const all = getAuditTrail();
    const newItem: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };
    const updated = [newItem, ...all].slice(0, 25);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("interntrack-audit-change"));
  } catch {
    // ignore storage errors
  }
}

export function AuditTrailPanel({
  role,
  title = "Activity & Compliance Audit Trail",
  description = "Chronological, tamper-evident log of recent verification, attendance, and placement actions",
  limit = 5,
}: {
  role: AppRole;
  title?: string;
  description?: string;
  limit?: number;
}) {
  const [logs, setLogs] = useState<AuditLogEntry[]>(getAuditTrail);

  useEffect(() => {
    const sync = () => setLogs(getAuditTrail());
    window.addEventListener("interntrack-audit-change", sync);
    window.addEventListener("internflow-activities-change", sync);
    window.addEventListener("internflow-data-change", sync);
    return () => {
      window.removeEventListener("interntrack-audit-change", sync);
      window.removeEventListener("internflow-activities-change", sync);
      window.removeEventListener("internflow-data-change", sync);
    };
  }, []);

  const scopedLogs = logs.filter((l) => l.scopes.includes(role)).slice(0, limit);

  return (
    <Card className="rounded-xl border border-border/60 bg-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-5 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <History className="size-4 text-muted-foreground" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Badge variant="secondary" className="gap-1 font-mono text-[11px] shrink-0">
          <ShieldCheck className="size-3 text-[#589E10] dark:text-primary" />
          Verified Log
        </Badge>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="divide-y divide-border/50">
          {scopedLogs.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 first:pt-1 last:pb-1 text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{item.action}</span>
                  <Badge variant="outline" className="text-[10px] py-0 font-normal">
                    {item.actor} ({item.actorRole})
                  </Badge>
                </div>
                <p className="text-muted-foreground truncate">{item.target}</p>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
