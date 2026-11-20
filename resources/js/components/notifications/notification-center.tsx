import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ChevronRight,
  Info,
  ShieldAlert,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/lib/auth";
import {
  dismissNotification,
  getDismissedNotificationIds,
  getNotificationsForRole,
  getReadNotificationIds,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type AppNotification,
  type NotificationSeverity,
} from "@/lib/notifications";

const SEVERITY_STYLES: Record<
  NotificationSeverity,
  {
    icon: typeof ShieldAlert;
    badge: string;
    iconBox: string;
  }
> = {
  critical: {
    icon: ShieldAlert,
    badge: "bg-destructive/10 text-destructive border-destructive/25",
    iconBox: "bg-destructive/10 text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    iconBox: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    badge: "bg-primary/10 text-primary border-primary/20",
    iconBox: "bg-primary/10 text-primary",
  },
};

export function NotificationCenter({
  role,
  userId,
}: {
  role: AppRole;
  userId?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    const events = [
      "internflow-notifications-change",
      "internflow-data-change",
      "internflow-activities-change",
      "internflow-attendance-change",
      "internflow-rbac-change",
    ];
    events.forEach((evt) => window.addEventListener(evt, refresh));
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, refresh));
    };
  }, [refresh]);

  const { visibleItems, unreadCount, hasCriticalUnread, readIds } = useMemo(() => {
    void version;
    const all = getNotificationsForRole(role, userId);
    const dismissed = getDismissedNotificationIds();
    const read = getReadNotificationIds();
    const visible = all.filter((item) => !dismissed.has(item.id));
    const unread = visible.filter((item) => !read.has(item.id));
    const criticalUnread = unread.some((item) => item.severity === "critical");

    return {
      visibleItems: visible,
      unreadCount: unread.length,
      hasCriticalUnread: criticalUnread,
      readIds: read,
    };
  }, [role, userId, version]);

  const displayedItems = useMemo(() => {
    if (filter === "unread") {
      return visibleItems.filter((item) => !readIds.has(item.id));
    }
    return visibleItems;
  }, [visibleItems, readIds, filter]);

  const handleItemClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    setOpen(false);
    router.visit(item.href);
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dismissNotification(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(visibleItems.map((item) => item.id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          title="Notifications"
          className="relative inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-hidden cursor-pointer"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ring-2 ring-background",
                hasCriticalUnread
                  ? "bg-destructive text-white"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-80 sm:w-96 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-semibold bg-primary/10 text-primary"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="mr-1 size-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1 border-b border-border/60 bg-muted/30 px-3 py-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
              filter === "all"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            All ({visibleItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
              filter === "unread"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-96">
          {displayedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2.5">
                <Bell className="size-4" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                {filter === "unread" ? "No unread notifications" : "All caught up"}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {filter === "unread"
                  ? "You have reviewed all current items requiring attention."
                  : "Nothing needs your attention right now."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {displayedItems.map((item) => {
                const isUnread = !readIds.has(item.id);
                const style = SEVERITY_STYLES[item.severity];
                const Icon = style.icon;

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleItemClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleItemClick(item);
                      }
                    }}
                    className={cn(
                      "group relative flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 cursor-pointer",
                      isUnread && "bg-primary/[0.03]",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                        style.iconBox,
                      )}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2 pr-4">
                        <p
                          className={cn(
                            "text-xs leading-snug text-foreground",
                            isUnread ? "font-semibold" : "font-medium",
                          )}
                        >
                          {item.title}
                        </p>
                        {isUnread && (
                          <span
                            aria-label="Unread"
                            className="mt-1 size-1.5 shrink-0 rounded-full bg-primary"
                          />
                        )}
                      </div>

                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn("h-4 px-1.5 text-[10px] font-medium", style.badge)}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {item.timestamp}
                          </span>
                        </div>

                        <span className="inline-flex items-center text-[11px] font-medium text-primary group-hover:underline">
                          {item.actionLabel}
                          <ChevronRight className="ml-0.5 size-3" />
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Dismiss notification"
                      onClick={(e) => handleDismiss(e, item.id)}
                      className="absolute top-2.5 right-2.5 inline-flex size-5 items-center justify-center rounded-md text-muted-foreground/60 opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
