import { createContext, useContext, type ReactNode } from "react";
import type { AppRole } from "@/lib/auth";

export type AppUser = {
  userId: string;
  email: string;
  name: string;
  role: AppRole;
  roles: AppRole[];
};

const Ctx = createContext<AppUser | null>(null);

export function AppUserProvider({ value, children }: { value: AppUser; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppUser(): AppUser {
  const value = useContext(Ctx);
  if (!value) throw new Error("useAppUser must be used inside AppUserProvider");
  return value;
}
