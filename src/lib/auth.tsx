/**
 * PROTOTYPE / DEMO MODE — auth.tsx
 * All auth hooks return mock data from the demo session stored in sessionStorage.
 * No Supabase calls are made.
 */
import { useState, useEffect } from "react";
import {
  DEMO_USERS,
  DEFAULT_ROLE_PERMISSIONS,
  getStoredRBAC,
  type MockUser,
} from "@/lib/mock-data";

export type AppRole = "student" | "supervisor" | "org_admin" | "uni_admin" | "system_admin";

export const ROLE_LABELS: Record<AppRole, string> = {
  student: "Student",
  supervisor: "Supervisor",
  org_admin: "Organization Admin",
  uni_admin: "University Admin",
  system_admin: "System Administrator",
};

export const ROLE_TIERS: Record<
  AppRole,
  {
    tier: number;
    level: string;
    description: string;
    color: string;
  }
> = {
  student: {
    tier: 1,
    level: "Tier 1: Student Intern",
    description: "Daily logbook drafting, GPS attendance punch, milestone self-tracking",
    color: "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300",
  },
  supervisor: {
    tier: 2,
    level: "Tier 2: Field / Faculty Supervisor",
    description: "Daily log sign-offs, attendance verification, mid-term/final grading",
    color:
      "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  org_admin: {
    tier: 3,
    level: "Tier 3: Host Organization Admin",
    description: "Company branch placements, corporate mentor roster, workplace audit",
    color: "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300",
  },
  uni_admin: {
    tier: 4,
    level: "Tier 4: University Dean & Institutional Admin",
    description:
      "Supervisor creation, student-supervisor assignments, RBAC control matrix, accreditation dossier",
    color:
      "border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300",
  },
  system_admin: {
    tier: 5,
    level: "Tier 5: System Super Administrator",
    description: "Full root access, tenant configuration, cryptographic log certification",
    color: "border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300",
  },
};

export function hasPermission(role: AppRole, permissionId: string): boolean {
  const rbac = getStoredRBAC();
  const perms = rbac[role] || DEFAULT_ROLE_PERMISSIONS[role] || [];
  return perms.includes(permissionId);
}

export function usePermissions(role: AppRole) {
  const [permissions, setPermissions] = useState<string[]>(() => {
    const rbac = getStoredRBAC();
    return rbac[role] || DEFAULT_ROLE_PERMISSIONS[role] || [];
  });

  useEffect(() => {
    const handler = () => {
      const rbac = getStoredRBAC();
      setPermissions(rbac[role] || DEFAULT_ROLE_PERMISSIONS[role] || []);
    };
    window.addEventListener("internflow-rbac-change", handler);
    return () => window.removeEventListener("internflow-rbac-change", handler);
  }, [role]);

  return permissions;
}

const SESSION_KEY = "demo_user_id";

export function getDemoUser(): MockUser {
  try {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (search) {
        const params = new URLSearchParams(search);
        const user = params.get("user");
        const role = params.get("role");
        if (user) {
          const match = DEMO_USERS.find((u) => u.id === user);
          if (match) {
            sessionStorage.setItem(SESSION_KEY, match.id);
            return match;
          }
        }
        if (role) {
          const normalized = role.toLowerCase().replace("-", "_");
          const match =
            DEMO_USERS.find((u) => u.role === normalized) ||
            DEMO_USERS.find((u) => u.roles?.includes(normalized as AppRole));
          if (match) {
            sessionStorage.setItem(SESSION_KEY, match.id);
            return match;
          }
        }
      }

      const id = sessionStorage.getItem(SESSION_KEY);
      if (id) {
        const found = DEMO_USERS.find((u) => u.id === id);
        if (found) return found;
      }
    }
  } catch (e) {
    // sessionStorage might be restricted
  }
  // Default to Alice Wanjiku (Student) so a demo session is always active
  return DEMO_USERS[0]!;
}

export function setDemoUser(id: string) {
  sessionStorage.setItem(SESSION_KEY, id);
}

export function clearDemoUser() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Drop-in replacement hooks ────────────────────────────────────────────────

export function useSession() {
  const [user, setUser] = useState<MockUser | null>(getDemoUser);
  const [loading] = useState(false);

  // listen for storage events so navigation works
  useEffect(() => {
    const handler = () => setUser(getDemoUser());
    window.addEventListener("demo-auth-change", handler);
    return () => window.removeEventListener("demo-auth-change", handler);
  }, []);

  return { user, loading };
}

export function useProfile(userId: string | undefined) {
  const user = DEMO_USERS.find((u) => u.id === userId);
  return {
    data: user
      ? {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          institution: user.institution,
          course: user.course,
          student_number: user.student_number,
        }
      : null,
    isLoading: false,
  };
}

export function useRoles(userId: string | undefined) {
  const user = DEMO_USERS.find((u) => u.id === userId);
  return { data: user?.roles ?? [], isLoading: false };
}

export function primaryRole(roles: AppRole[] | undefined): AppRole {
  if (!roles || roles.length === 0) return "student";
  const order: AppRole[] = ["system_admin", "uni_admin", "org_admin", "supervisor", "student"];
  return order.find((r) => roles.includes(r)) ?? "student";
}

export function useSignOut() {
  return () => {
    clearDemoUser();
    window.dispatchEvent(new Event("demo-auth-change"));
    window.location.href = "/auth";
  };
}
