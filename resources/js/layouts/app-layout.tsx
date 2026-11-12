import { useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronDown,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Milestone,
  Shield,
  User as UserIcon,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ROLE_LABELS,
  ROLE_TIERS,
  getDemoUser,
  setDemoUser,
  useSignOut,
  type AppRole,
} from "@/lib/auth";
import { DEMO_USERS } from "@/lib/mock-data";

type NavCategory = "core" | "tracking" | "supervision" | "governance" | "account";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: AppRole[];
  category: NavCategory;
};

const NAV: NavItem[] = [
  // ── Core Workspace ──
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "core",
  },

  // ── Student Workspace ──
  {
    to: "/logbook",
    label: "Digital Logbook",
    icon: BookOpen,
    roles: ["student"],
    category: "tracking",
  },
  {
    to: "/attendance",
    label: "Attendance & Clock",
    icon: CalendarCheck,
    roles: ["student"],
    category: "tracking",
  },
  {
    to: "/milestones",
    label: "Milestones Roadmap",
    icon: Milestone,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "tracking",
  },

  // ── Supervisory Controls ──
  {
    to: "/review",
    label: "Review Queue",
    icon: ClipboardList,
    roles: ["supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "supervision",
  },
  {
    to: "/students",
    label: "Assigned Interns",
    icon: Users,
    roles: ["supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "supervision",
  },
  {
    to: "/evaluations",
    label: "Performance Evaluations",
    icon: Award,
    roles: ["supervisor", "uni_admin", "system_admin"],
    category: "supervision",
  },

  // ── Institutional & RBAC Governance ──
  {
    to: "/supervisors",
    label: "Supervisor Accounts",
    icon: UserPlus,
    roles: ["uni_admin", "org_admin", "system_admin"],
    category: "governance",
  },
  {
    to: "/assignments",
    label: "Supervisor Pairing",
    icon: UserCheck,
    roles: ["uni_admin", "system_admin"],
    category: "governance",
  },
  {
    to: "/rbac",
    label: "RBAC Control Matrix",
    icon: Lock,
    roles: ["uni_admin", "system_admin"],
    category: "governance",
  },
  {
    to: "/admin",
    label: "Placement Accreditation",
    icon: Shield,
    roles: ["org_admin", "uni_admin", "system_admin"],
    category: "governance",
  },

  // ── Reports ──
  {
    to: "/reports",
    label: "Reports & Dossier",
    icon: FileBarChart,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "core",
  },

  // ── Account ──
  {
    to: "/profile",
    label: "My Profile",
    icon: UserIcon,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "account",
  },
];

const CATEGORY_LABELS: Record<NavCategory, string> = {
  core: "Overview",
  tracking: "Logbook & Tracking",
  supervision: "Supervisory Controls",
  governance: "Institutional & RBAC",
  account: "Account",
};

export function AppShell({
  children,
  role,
  roles,
  name,
  email,
}: {
  children: ReactNode;
  role: AppRole;
  roles?: AppRole[];
  name: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getDemoUser());
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const signOut = useSignOut();

  // Switch demo persona and safely redirect if current route is not permitted for the new role
  const switchPersona = (newUserId: string) => {
    setDemoUser(newUserId);
    setCurrentUser(getDemoUser());
    window.dispatchEvent(new Event("demo-auth-change"));

    const targetUser = DEMO_USERS.find((u) => u.id === newUserId);
    if (targetUser) {
      const targetRoles = targetUser.roles ?? [targetUser.role];
      const currentNav = NAV.find(
        (item) => pathname === item.to || pathname.startsWith(item.to + "/"),
      );
      if (currentNav && !currentNav.roles.some((r) => targetRoles.includes(r))) {
        navigate({ to: "/dashboard" });
      }
    }
  };

  // Listen for real-time persona / role changes
  useEffect(() => {
    const handler = () => {
      setCurrentUser(getDemoUser());
    };
    window.addEventListener("demo-auth-change", handler);
    return () => window.removeEventListener("demo-auth-change", handler);
  }, []);

  const activeRole: AppRole = currentUser?.role ?? role;
  const activeRoles: AppRole[] =
    currentUser?.roles && currentUser.roles.length > 0
      ? currentUser.roles
      : roles && roles.length > 0
        ? roles
        : [activeRole];
  const activeName = currentUser?.full_name || name;
  const activeEmail = currentUser?.email || email;
  const tier = ROLE_TIERS[activeRole];

  // Filter items matching the active persona's roles
  const allowedItems = NAV.filter((i) => i.roles.some((r) => activeRoles.includes(r)));

  // Group by category in ordered sequence
  const categories: NavCategory[] = ["core", "tracking", "supervision", "governance", "account"];
  const groupedItems = categories
    .map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      items: allowedItems.filter((i) => i.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  const initials =
    (activeName || activeEmail)
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "IT";

  return (
    <div className="dashboard-layout min-h-screen bg-background">
      {/* ── Fixed Sidebar ── */}
      <aside
        className={cn(
          "dashboard-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 shadow-lg lg:shadow-none border-r border-sidebar-border",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 border-b border-sidebar-border px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-accent shadow-xs">
            <GraduationCap className="size-5 text-accent-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold leading-none tracking-tight">
              InternTrack
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge
                variant="outline"
                className="text-[10px] font-semibold border-sidebar-border text-sidebar-foreground/75 px-1.5 py-0"
              >
                Tier {tier.tier}
              </Badge>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 font-mono">
                {ROLE_LABELS[activeRole].split(" ")[0]}
              </span>
            </div>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
            Close
          </button>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {groupedItems.map((group) => (
            <div key={group.category} className="space-y-1">
              <p
                className={cn(
                  "px-3 text-[10px] font-bold uppercase tracking-wider",
                  group.category === "core" || group.category === "tracking"
                    ? "text-secondary"
                    : "text-sidebar-foreground/50",
                )}
              >
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Role Quick Switcher in Sidebar Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-2 bg-sidebar-accent/20">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
            Switch Persona (RBAC Demo)
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_USERS.map((u) => {
              const isSelected = u.id === currentUser?.id;
              return (
                <button
                  key={u.id}
                  onClick={() => switchPersona(u.id)}
                  className={cn(
                    "text-[10px] font-medium py-1.5 px-2 rounded-md transition text-left truncate",
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-sidebar/80 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <span className="truncate">{u.full_name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 pt-2 border-t border-sidebar-border/60">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{activeName}</p>
              <p className="truncate text-[10px] text-sidebar-foreground/60">
                {ROLE_LABELS[activeRole]}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground h-8"
            onClick={signOut}
          >
            <LogOut className="size-3.5" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
              Menu
            </button>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors hover:bg-muted focus:outline-hidden"
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-foreground">{activeName}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-1.5 text-muted-foreground font-normal hidden sm:inline-flex"
                  >
                    {ROLE_LABELS[activeRole]}
                  </Badge>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  Switch Account Persona
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {DEMO_USERS.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  return (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => switchPersona(user.id)}
                      className={cn(
                        "flex items-center justify-between py-2 text-xs cursor-pointer",
                        isCurrent && "bg-accent/70 font-semibold",
                      )}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-medium text-foreground">{user.full_name}</p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {ROLE_LABELS[user.role]}
                        </p>
                      </div>
                      {isCurrent && <Check className="size-4 text-primary shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-xs text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 size-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[96rem] px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
