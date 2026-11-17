import { useEffect, useState, type ReactNode } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  Award,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Milestone,
  Monitor,
  Moon,
  Shield,
  Sun,
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
import { ROLE_LABELS, ROLE_TIERS, type AppRole } from "@/lib/auth";
import { useTheme, type ThemeMode } from "@/lib/theme";

type NavCategory = "core" | "tracking" | "supervision" | "governance" | "account";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: AppRole[];
  category: NavCategory;
};

const NAV: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "core",
  },
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
    roles: ["student", "supervisor", "org_admin"],
    category: "tracking",
  },
  {
    to: "/review",
    label: "Review Queue",
    icon: ClipboardList,
    roles: ["supervisor", "org_admin"],
    category: "supervision",
  },
  {
    to: "/students",
    label: "Assigned Interns",
    icon: Users,
    roles: ["supervisor", "org_admin"],
    category: "supervision",
  },
  {
    to: "/evaluations",
    label: "Performance Evaluations",
    icon: Award,
    roles: ["supervisor", "org_admin"],
    category: "supervision",
  },
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
  {
    to: "/reports",
    label: "Reports & Dossier",
    icon: FileBarChart,
    roles: ["student", "supervisor", "org_admin"],
    category: "core",
  },
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

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "Auto", icon: Monitor },
];

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
  const { url } = usePage();
  const pathname = url.split("?")[0] || "/dashboard";
  const { theme, setTheme } = useTheme();

  const activeRole: AppRole = role;
  const activeRoles: AppRole[] = roles && roles.length > 0 ? roles : [activeRole];
  const tier = ROLE_TIERS[activeRole];

  const signOut = () => {
    router.post("/logout");
  };

  const allowedItems = NAV.filter((item) =>
    item.roles.some((allowedRole) => activeRoles.includes(allowedRole)),
  );

  const isRouteAllowed = allowedItems.some(
    (item) => pathname === item.to || pathname.startsWith(item.to + "/"),
  );

  useEffect(() => {
    if (!isRouteAllowed) {
      router.visit("/dashboard");
    }
  }, [isRouteAllowed]);

  const currentNavItem =
    NAV.find((item) => pathname === item.to || pathname.startsWith(item.to + "/")) ?? NAV[0]!;

  const currentThemeIdx = THEME_OPTIONS.findIndex((o) => o.mode === theme);
  const activeThemeOption = THEME_OPTIONS[currentThemeIdx === -1 ? 0 : currentThemeIdx]!;
  const ActiveThemeIcon = activeThemeOption.icon;
  const nextThemeOption = THEME_OPTIONS[(currentThemeIdx + 1) % THEME_OPTIONS.length]!;

  const categories: NavCategory[] = ["core", "tracking", "supervision", "governance", "account"];

  const groupedItems = categories
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: allowedItems.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  const initials =
    (name || email)
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "IT";

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 shadow-lg lg:shadow-none border-r border-sidebar-border",
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
          </button>
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {groupedItems.map((group) => (
            <div key={group.category} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </p>

              {group.items.map((item) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");

                return (
                  <Link
                    key={item.to}
                    href={item.to}
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

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">{name}</p>

              <p className="truncate text-[10px] text-sidebar-foreground/60">
                {ROLE_LABELS[activeRole]}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="mr-2 size-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <header className="dashboard-header sticky top-0 z-30 flex h-12 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs min-w-0">
              <span className="hidden sm:inline text-muted-foreground">
                {CATEGORY_LABELS[currentNavItem.category]}
              </span>
              <span className="hidden sm:inline text-muted-foreground/40">/</span>
              <span className="font-medium text-foreground truncate">{currentNavItem.label}</span>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setTheme(nextThemeOption.mode)}
              title={`Theme: ${activeThemeOption.label} (click for ${nextThemeOption.label})`}
              aria-label={`Theme: ${activeThemeOption.label}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <ActiveThemeIcon className="size-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs transition-colors hover:bg-muted focus:outline-hidden cursor-pointer"
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline font-medium text-foreground">{name}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  {ROLE_LABELS[activeRole]}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => router.visit("/profile")}
                  className="text-xs cursor-pointer"
                >
                  <UserIcon className="mr-2 size-3.5" />
                  My Profile
                </DropdownMenuItem>

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

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
