/**
 * PROTOTYPE / DEMO MODE — auth.tsx
 * All auth hooks return mock data from the demo session stored in sessionStorage.
 * No Supabase calls are made.
 */
import { useState, useEffect } from "react";
import { DEMO_USERS, type MockUser } from "@/lib/mock-data";

export type AppRole = "student" | "supervisor" | "org_admin" | "uni_admin" | "system_admin";

export const ROLE_LABELS: Record<AppRole, string> = {
  student: "Student",
  supervisor: "Supervisor",
  org_admin: "Organization Admin",
  uni_admin: "University Admin",
  system_admin: "System Administrator",
};

const SESSION_KEY = "demo_user_id";

export function getDemoUser(): MockUser | null {
  const id = sessionStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return DEMO_USERS.find((u) => u.id === id) ?? null;
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
