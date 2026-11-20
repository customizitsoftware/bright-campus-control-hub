import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navForRole, ROLES } from "@/lib/navigation";
import { useRolePreview } from "./role-context";

export function AppSidebar() {
  const { role } = useRolePreview();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const groups = navForRole(role);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2" aria-label="SchoolOS home">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="size-4" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">SchoolOS</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active = path === item.to || path.startsWith(item.to + "/");
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.to}>
                          <item.icon aria-hidden />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <p className="rounded-md bg-sidebar-accent px-3 py-2 text-xs text-sidebar-foreground">
          Menu shown for <strong>{ROLES.find((r) => r.value === role)?.label}</strong>. Preview only — access control is pending backend integration.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
