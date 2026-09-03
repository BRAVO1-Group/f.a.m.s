import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, useSignOut, type AppRole } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; roles: AppRole[] };

const NAV: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
  },
  { to: "/logbook", label: "Digital Logbook", icon: BookOpen, roles: ["student"] },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["student"] },
  { to: "/reports", label: "Reports", icon: FileBarChart, roles: ["student"] },
  {
    to: "/review",
    label: "Review Queue",
    icon: ClipboardList,
    roles: ["supervisor", "org_admin", "uni_admin", "system_admin"],
  },
  {
    to: "/admin",
    label: "Administration",
    icon: Shield,
    roles: ["org_admin", "uni_admin", "system_admin"],
  },
  {
    to: "/profile",
    label: "My Profile",
    icon: UserIcon,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
  },
];

export function AppShell({
  children,
  role,
  name,
  email,
}: {
  children: ReactNode;
  role: AppRole;
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const signOut = useSignOut();
  const items = NAV.filter((i) => i.roles.includes(role));
  const initials =
    (name || email)
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "IT";

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-accent">
            <GraduationCap className="size-5 text-accent-foreground" />
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-none">InternTrack</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
              Smart Logbook
            </p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="size-9">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name || email}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-1 w-full justify-start gap-3 text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            onClick={signOut}
          >
            <LogOut className="size-4.5" /> Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="size-5" />
          </button>
          <Badge variant="secondary" className="font-medium">
            {ROLE_LABELS[role]} workspace
          </Badge>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
