import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "@/lib/navigation";

type Ctx = { role: Role; setRole: (r: Role) => void };
const RoleContext = createContext<Ctx | null>(null);

/** Preview-only role switch. Not a security boundary: authorization is pending backend integration. */
export function RolePreviewProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("school_admin");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRolePreview() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRolePreview must be used inside RolePreviewProvider");
  return ctx;
}
