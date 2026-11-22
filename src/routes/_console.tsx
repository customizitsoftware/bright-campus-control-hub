import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { RolePreviewProvider } from "@/components/layout/role-context";
import { useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SchoolContext } from "@/components/layout/school-context";
import { workspaceQuery } from "@/lib/backend-queries";
import { requireConsoleSession, workspaceNotice } from "@/lib/console-state";
import { RouteError, RoutePending } from "@/components/common/route-feedback";
import { z } from "zod";

export const Route = createFileRoute("/_console")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { school?: string } => {
    const school = z.string().uuid().safeParse(search['school']);
    return school.success ? { school: school.data } : {};
  },
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    return { signedInUserId: requireConsoleSession(data.session, location.href) };
  },
  loaderDeps: ({ search }) => ({ school: search.school }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(workspaceQuery(deps.school)),
  errorComponent: RouteError,
  pendingComponent: RoutePending,
  component: ConsoleLayout,
});

function ConsoleLayout() {
  const { school } = Route.useSearch();
  const { data: workspace } = useSuspenseQuery(workspaceQuery(school));
  const notice = workspaceNotice(workspace.mode);
  return (
    <SchoolContext.Provider value={workspace}>
    <RolePreviewProvider>
      <TooltipProvider delayDuration={150}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="bg-background">
              <TopBar />
              {notice && <div role="status" className={`border-b border-border px-4 py-2 text-sm md:px-8 ${workspace.mode === 'suspended' ? 'bg-destructive/10 text-destructive' : 'bg-warning-soft text-warning'}`}>{notice}</div>}
              <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
                <Outlet />
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </RolePreviewProvider>
    </SchoolContext.Provider>
  );
}
