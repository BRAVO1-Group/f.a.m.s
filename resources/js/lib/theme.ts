import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "interntrack-theme";
const THEME_EVENT = "interntrack-theme-change";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") {
      return raw;
    }
  } catch {
    // Ignore storage access errors in restricted contexts.
  }
  return "system";
}

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") return mode;
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function applyTheme(mode: ThemeMode): "light" | "dark" {
  const resolved = resolveTheme(mode);
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  }
  return resolved;
}

export function setStoredTheme(mode: ThemeMode): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage access errors.
    }
    applyTheme(mode);
    window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: mode }));
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    resolveTheme(getStoredTheme()),
  );

  useEffect(() => {
    const sync = (nextMode: ThemeMode) => {
      setThemeState(nextMode);
      setResolvedTheme(applyTheme(nextMode));
    };

    sync(getStoredTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      const current = getStoredTheme();
      if (current === "system") {
        setResolvedTheme(applyTheme("system"));
      }
    };

    const onThemeEvent = (e: Event) => {
      const custom = e as CustomEvent<ThemeMode>;
      sync(custom.detail ?? getStoredTheme());
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        sync(getStoredTheme());
      }
    };

    media.addEventListener("change", onMediaChange);
    window.addEventListener(THEME_EVENT, onThemeEvent);
    window.addEventListener("storage", onStorage);

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener(THEME_EVENT, onThemeEvent);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = (nextMode: ThemeMode) => {
    setThemeState(nextMode);
    setResolvedTheme(resolveTheme(nextMode));
    setStoredTheme(nextMode);
  };

  return { theme, resolvedTheme, setTheme };
}
