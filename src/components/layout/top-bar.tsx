import { Link, getRouteApi } from "@tanstack/react-router";
import { Bell, Building, ChevronDown, Search, UserCircle2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES, type Role } from "@/lib/navigation";
import { notifyPending } from "@/lib/pending";
import { useRolePreview } from "./role-context";
import { useSchool } from "./school-context";

export function TopBar() {
  const { role, setRole } = useRolePreview();
  const school = useSchool();
  const navigate = getRouteApi('/_console').useNavigate();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur md:px-5">
      <SidebarTrigger aria-label="Toggle navigation" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2" aria-label="Select school or campus">
            <Building className="size-4" aria-hidden />
            <span className="max-w-40 truncate">{school.selected?.schools?.name ?? "No school selected"}</span>
            <ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 text-sm">
          <p className="font-medium">School & campus</p>
          {school.memberships.length ? (
            <div className="mt-2 space-y-1">
              {school.memberships.map((membership) => <Button key={membership.id} variant={membership.school_id === school.selected?.school_id ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => void navigate({ search: (previous) => ({ ...previous, school: membership.school_id }) })}>{membership.schools?.name ?? 'School'}</Button>)}
            </div>
          ) : <p className="mt-1 text-muted-foreground">You have no active school memberships.</p>}
          <Button asChild size="sm" className="mt-3 w-full"><Link to="/setup">Open setup wizard</Link></Button>
        </PopoverContent>
      </Popover>

      <form
        role="search"
        className="relative ml-auto hidden w-full max-w-sm md:block"
        onSubmit={(e) => { e.preventDefault(); notifyPending("Global search"); }}
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input aria-label="Search students, staff and records" placeholder="Search students, staff, records…" className="pl-9" />
      </form>

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 text-sm">
            <p className="font-medium">Notifications</p>
            <p className="mt-1 text-muted-foreground">You have no notifications. Alerts will arrive here once messaging is connected.</p>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2" aria-label="Profile and role preview">
              <UserCircle2 className="size-5" aria-hidden />
              <span className="hidden text-xs lg:inline">{ROLES.find((r) => r.value === role)?.label}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Preview menu as (not a security control)</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={role} onValueChange={(v) => setRole(v as Role)}>
              {ROLES.map((r) => <DropdownMenuRadioItem key={r.value} value={r.value}>{r.label}</DropdownMenuRadioItem>)}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/login">Go to sign-in page</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
