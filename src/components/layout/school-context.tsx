import { createContext, useContext } from 'react';
import type { getWorkspace } from '@/lib/backend.functions';
type Workspace = Awaited<ReturnType<typeof getWorkspace>>;
export const SchoolContext = createContext<Workspace | null>(null);
export function useSchool() {
  const value = useContext(SchoolContext);
  if (!value) throw new Error('School context is unavailable.');
  return value;
}
