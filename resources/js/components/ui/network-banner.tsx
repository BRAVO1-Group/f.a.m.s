import { useEffect, useState } from "react";
import { CloudOff, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type QueuedOfflineAction = {
  id: string;
  type: string;
  label: string;
  createdAt: string;
};

const OFFLINE_QUEUE_KEY = "interntrack_offline_sync_queue_v1";
const SIMULATED_OFFLINE_KEY = "interntrack_simulated_offline_v1";

export function getOfflineQueue(): QueuedOfflineAction[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedOfflineAction[]) : [];
  } catch {
    return [];
  }
}

export function enqueueOfflineAction(type: string, label: string) {
  try {
    const queue = getOfflineQueue();
    const item: QueuedOfflineAction = {
      id: `q-${Date.now()}`,
      type,
      label,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [item, ...queue];
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("interntrack-offline-queue-change"));
  } catch {
    // ignore storage errors
  }
}

export function clearOfflineQueue() {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    window.dispatchEvent(new CustomEvent("interntrack-offline-queue-change"));
  } catch {
    // ignore storage errors
  }
}

export function isAppOffline(): boolean {
  if (typeof window === "undefined") return false;
  const sim = sessionStorage.getItem(SIMULATED_OFFLINE_KEY) === "1";
  return !navigator.onLine || sim;
}

export function NetworkStatusBanner() {
  const [offline, setOffline] = useState<boolean>(() => isAppOffline());
  const [queue, setQueue] = useState<QueuedOfflineAction[]>(getOfflineQueue);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      if (sessionStorage.getItem(SIMULATED_OFFLINE_KEY) === "1") return;
      setOffline(false);
      flushQueue();
    };

    const handleOffline = () => {
      setOffline(true);
      toast.warning("Internet connection lost — Offline Queue Active", {
        description:
          "You can continue saving logbook drafts and attendance punches locally. They will auto-sync when back online.",
      });
    };

    const handleQueueChange = () => {
      setQueue(getOfflineQueue());
      setOffline(isAppOffline());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("interntrack-offline-queue-change", handleQueueChange);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("interntrack-offline-queue-change", handleQueueChange);
    };
  }, []);

  function flushQueue() {
    const current = getOfflineQueue();
    if (current.length === 0) {
      toast.success("Back Online", {
        description: "Live connection restored.",
      });
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      clearOfflineQueue();
      setQueue([]);
      setSyncing(false);
      toast.success(`Back Online — Synced ${current.length} queued record(s)`, {
        description: current.map((i) => i.label).join(", "),
      });
    }, 650);
  }

  function toggleSimulateOffline() {
    const currentlySim = sessionStorage.getItem(SIMULATED_OFFLINE_KEY) === "1";
    if (currentlySim) {
      sessionStorage.removeItem(SIMULATED_OFFLINE_KEY);
      setOffline(false);
      flushQueue();
    } else {
      sessionStorage.setItem(SIMULATED_OFFLINE_KEY, "1");
      setOffline(true);
      toast.warning("Offline Mode Enabled (Local Queue Active)", {
        description:
          "Logbook drafts and attendance check-ins will be saved locally until connection is restored.",
      });
    }
    window.dispatchEvent(new CustomEvent("interntrack-offline-queue-change"));
  }

  return (
    <>
      {offline && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-foreground sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <WifiOff className="size-3.5" />
            </span>
            <div>
              <span className="font-semibold">You are currently offline.</span>{" "}
              <span className="text-muted-foreground">
                Logbook drafts, attendance punches, and placement updates are saved to your local
                queue and will auto-sync when internet returns.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <Badge variant="secondary" className="font-mono text-[11px]">
                {queue.length} queued for sync
              </Badge>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={toggleSimulateOffline}
              className="h-7 text-[11px] font-medium gap-1.5"
            >
              <RefreshCw className={`size-3 ${syncing ? "animate-spin" : ""}`} />
              Reconnect &amp; Sync Now
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export function NetworkStatusTogglePill() {
  const [offline, setOffline] = useState<boolean>(() => isAppOffline());
  const [queueCount, setQueueCount] = useState<number>(() => getOfflineQueue().length);

  useEffect(() => {
    const syncState = () => {
      setOffline(isAppOffline());
      setQueueCount(getOfflineQueue().length);
    };
    window.addEventListener("online", syncState);
    window.addEventListener("offline", syncState);
    window.addEventListener("interntrack-offline-queue-change", syncState);
    return () => {
      window.removeEventListener("online", syncState);
      window.removeEventListener("offline", syncState);
      window.removeEventListener("interntrack-offline-queue-change", syncState);
    };
  }, []);

  function toggleOffline() {
    const currentlySim = sessionStorage.getItem(SIMULATED_OFFLINE_KEY) === "1";
    if (currentlySim) {
      sessionStorage.removeItem(SIMULATED_OFFLINE_KEY);
      const q = getOfflineQueue();
      clearOfflineQueue();
      toast.success(
        q.length > 0
          ? `Online — Auto-synced ${q.length} queued item(s)`
          : "Online connection active",
      );
    } else {
      sessionStorage.setItem(SIMULATED_OFFLINE_KEY, "1");
      toast.warning("Offline Mode Active", {
        description: "Actions will be queued locally and auto-synced when back online.",
      });
    }
    window.dispatchEvent(new CustomEvent("interntrack-offline-queue-change"));
  }

  if (!offline) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleOffline}
      title="Offline Queue Active (click to reconnect & sync)"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-2.5 text-[11px] font-medium text-amber-700 dark:text-amber-300 transition cursor-pointer"
    >
      <CloudOff className="size-3.5 text-amber-600 dark:text-amber-400" />
      <span className="hidden sm:inline">Offline</span>
      {queueCount > 0 && (
        <span className="rounded bg-amber-500/25 px-1 font-mono text-[10px] font-bold">
          {queueCount}
        </span>
      )}
    </button>
  );
}
