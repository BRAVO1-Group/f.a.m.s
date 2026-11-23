import { useEffect, useState, type ReactNode } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarCheck,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogOut,
  Milestone,
  Monitor,
  Moon,
  Shield,
  Sun,
  User as UserIcon,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandLogoMark } from "@/components/ui/brand-logo";
import { NetworkStatusBanner, NetworkStatusTogglePill } from "@/components/ui/network-banner";
import { PageContentSkeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/notifications/notification-center";
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
    to: "/reports",
    label: "Reports & Dossier",
    icon: FileBarChart,
    roles: ["student"],
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
    roles: ["student"],
    category: "tracking",
  },
  {
    to: "/review",
    label: "Logbook Sign-Off & Comments",
    icon: ClipboardList,
    roles: ["supervisor", "org_admin"],
    category: "supervision",
  },
  {
    to: "/students",
    label: "Assigned Interns & Attendance",
    icon: Users,
    roles: ["supervisor", "org_admin"],
    category: "supervision",
  },
  {
    to: "/evaluations",
    label: "Field Mentor Grading Form",
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
    to: "/profile",
    label: "Support & Inquiries",
    icon: LifeBuoy,
    roles: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
    category: "account",
  },
];

const CATEGORY_META: Record<
  NavCategory,
  { label: string; icon: typeof LayoutDashboard }
> = {
  core: { label: "Overview", icon: LayoutDashboard },
  tracking: { label: "Logbook & Tracking", icon: BookOpen },
  supervision: { label: "Supervisory Controls", icon: ClipboardList },
  governance: { label: "Institutional & RBAC", icon: Shield },
  account: { label: "Support", icon: LifeBuoy },
};

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "Auto", icon: Monitor },
];

function WorkspaceSwitcher({
  activeRole,
  activeRoles,
}: {
  activeRole: AppRole;
  activeRoles: AppRole[];
}) {
  const { isMobile } = useSidebar();
  const [selectedRole, setSelectedRole] = useState<AppRole>(activeRole);
  const tier = ROLE_TIERS[selectedRole];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <BrandLogoMark variant="auto" className="size-8 rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-display font-extrabold tracking-tight">
                  Intern<span className="text-[#589E10] dark:text-[#9CE840]">Track</span>
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Tier {tier.tier} · {ROLE_LABELS[selectedRole].split(" ")[0]}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {activeRoles.map((r, index) => (
              <DropdownMenuItem
                key={r}
                onClick={() => setSelectedRole(r)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                <span className="truncate">{ROLE_LABELS[r]}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavMain({
  groups,
  pathname,
}: {
  groups: {
    category: NavCategory;
    label: string;
    icon: typeof LayoutDashboard;
    items: NavItem[];
  }[];
  pathname: string;
}) {
  return (
    <SidebarGroup className="py-2">
      <SidebarGroupLabel className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {groups.map((group) => {
          const GroupIcon = group.icon;

          return (
            <Collapsible
              key={group.category}
              asChild
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={group.label}
                    className="h-9 font-medium text-sidebar-foreground/90"
                  >
                    <GroupIcon className="size-4 shrink-0" />
                    <span>{group.label}</span>
                    <ChevronRight className="ml-auto size-4 text-sidebar-foreground/60 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 space-y-1 border-sidebar-border/80 py-1">
                    {group.items.map((subItem) => {
                      const active =
                        pathname === subItem.to ||
                        pathname.startsWith(subItem.to + "/") ||
                        (subItem.to === "/dashboard" && (pathname === "/" || pathname === ""));
                      const SubIcon = subItem.icon;
                      return (
                        <SidebarMenuSubItem key={subItem.to}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={active}
                            className="h-8 gap-2.5 px-2.5"
                          >
                            <Link href={subItem.to}>
                              <SubIcon className="size-3.5 shrink-0" />
                              <span className="truncate">{subItem.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavSecondary({ pathname }: { pathname: string }) {
  return (
    <SidebarGroup className="mt-auto pt-4">
      <SidebarGroupLabel className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
        Support
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/profile"}
              tooltip="Support & Send Inquiry"
              className="h-9"
            >
              <Link href="/profile">
                <LifeBuoy className="size-4 shrink-0" />
                <span>Support & Inquiries</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavUser({
  name,
  email,
  initials,
  roleLabel,
  themeLabel,
  ThemeIcon,
  onToggleTheme,
  onSignOut,
}: {
  name: string;
  email: string;
  initials: string;
  roleLabel: string;
  themeLabel: string;
  ThemeIcon: typeof Sun;
  onToggleTheme: () => void;
  onSignOut: () => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/60" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.visit("/profile")}
                className="cursor-pointer"
              >
                <BadgeCheck />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleTheme} className="cursor-pointer">
                <ThemeIcon />
                Theme: {themeLabel}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={onSignOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppShell({
  children,
  userId,
  role,
  roles,
  name,
  email,
}: {
  children: ReactNode;
  userId?: string | undefined;
  role: AppRole;
  roles?: AppRole[];
  name: string;
  email: string;
}) {
  const { url } = usePage();
  const pathname = url.split("?")[0] || "/dashboard";
  const { theme, setTheme } = useTheme();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const removeStart = router.on("start", (event) => {
      if (event.detail.visit.method === "get") {
        setIsNavigating(true);
      }
    });
    const removeFinish = router.on("finish", () => {
      setIsNavigating(false);
    });
    return () => {
      removeStart();
      removeFinish();
    };
  }, []);

  const activeRole: AppRole = role;
  const activeRoles: AppRole[] = roles && roles.length > 0 ? roles : [activeRole];

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

  const primaryCategories: NavCategory[] = ["core", "tracking", "supervision", "governance"];
  const groupedItems = primaryCategories
    .map((category) => ({
      category,
      label: CATEGORY_META[category].label,
      icon: CATEGORY_META[category].icon,
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
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="p-2.5 pb-1">
          <WorkspaceSwitcher activeRole={activeRole} activeRoles={activeRoles} />
        </SidebarHeader>
        <SidebarContent className="gap-2 px-1.5 py-2">
          <NavMain groups={groupedItems} pathname={pathname} />
          <NavSecondary pathname={pathname} />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border/60 p-2.5 pt-2">
          <NavUser
            name={name}
            email={email}
            initials={initials}
            roleLabel={ROLE_LABELS[activeRole]}
            themeLabel={activeThemeOption.label}
            ThemeIcon={ActiveThemeIcon}
            onToggleTheme={() => setTheme(nextThemeOption.mode)}
            onSignOut={signOut}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-x-hidden border border-border/50">
        <header className="sticky top-0 z-20 flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/90 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">{CATEGORY_META[currentNavItem.category].label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate">{currentNavItem.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <NetworkStatusTogglePill />
            <NotificationCenter role={activeRole} userId={userId} />
            <button
              type="button"
              onClick={() => setTheme(nextThemeOption.mode)}
              title={`Theme: ${activeThemeOption.label} (click for ${nextThemeOption.label})`}
              aria-label={`Theme: ${activeThemeOption.label}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <ActiveThemeIcon className="size-4" />
            </button>
          </div>
        </header>

        <NetworkStatusBanner />

        <div className="dashboard-page flex flex-1 flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          {isNavigating ? <PageContentSkeleton /> : children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
