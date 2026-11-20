import {
  LayoutDashboard, Building2, Users, UserPlus, BookOpen, CalendarCheck, ClipboardList,
  Wallet, Briefcase, MessageSquare, HeartHandshake, BarChart3, Settings, ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type Role =
  | "platform_super_admin" | "proprietor" | "school_admin" | "principal" | "teacher"
  | "bursar" | "hr" | "parent" | "student";

export const ROLES: { value: Role; label: string }[] = [
  { value: "platform_super_admin", label: "Platform Super Admin" },
  { value: "proprietor", label: "Proprietor" },
  { value: "school_admin", label: "School Admin" },
  { value: "principal", label: "Principal" },
  { value: "teacher", label: "Teacher" },
  { value: "bursar", label: "Bursar / Accountant" },
  { value: "hr", label: "HR" },
  { value: "parent", label: "Parent" },
  { value: "student", label: "Student" },
];

export type NavItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  /** Navigation preview only. Real authorization must be enforced server-side. */
  roles: Role[];
};

const ALL: Role[] = ROLES.map((r) => r.value);
const LEADERS: Role[] = ["platform_super_admin", "proprietor", "school_admin", "principal"];

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ title: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ALL }] },
  {
    label: "Administration",
    items: [
      { title: "School Setup", to: "/setup", icon: Building2, roles: ["platform_super_admin", "proprietor", "school_admin"] },
      { title: "Students", to: "/students", icon: Users, roles: [...LEADERS, "teacher"] },
      { title: "Admissions", to: "/admissions", icon: UserPlus, roles: LEADERS },
    ],
  },
  {
    label: "Teaching & Learning",
    items: [
      { title: "Academics", to: "/academics", icon: BookOpen, roles: [...LEADERS, "teacher"] },
      { title: "Attendance", to: "/attendance", icon: CalendarCheck, roles: [...LEADERS, "teacher"] },
      { title: "Exams & Results", to: "/exams", icon: ClipboardList, roles: [...LEADERS, "teacher", "parent", "student"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Finance", to: "/finance", icon: Wallet, roles: ["platform_super_admin", "proprietor", "school_admin", "bursar", "parent"] },
      { title: "Staff & HR", to: "/staff", icon: Briefcase, roles: ["platform_super_admin", "proprietor", "school_admin", "principal", "hr"] },
      { title: "Communication", to: "/communications", icon: MessageSquare, roles: ALL },
      { title: "Parent Portal", to: "/parent-portal", icon: HeartHandshake, roles: [...LEADERS, "parent"] },
      { title: "Reports & Insights", to: "/reports", icon: BarChart3, roles: [...LEADERS, "bursar", "hr"] },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", to: "/settings", icon: Settings, roles: ALL },
      { title: "Platform Admin", to: "/platform-admin", icon: ShieldCheck, roles: ["platform_super_admin"] },
    ],
  },
];

export function navForRole(role: Role) {
  return NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) })).filter(
    (g) => g.items.length > 0,
  );
}
