import {
  LayoutDashboard, Users, UserPlus, BookOpen, Briefcase, CalendarCheck, CalendarClock, ClipboardList,
  Wallet, Receipt, MessageSquare, HeartHandshake, BarChart3, Building2, Settings, ShieldCheck,
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
const FINANCE: Role[] = ["platform_super_admin", "proprietor", "school_admin", "bursar"];

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ title: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ALL }] },
  {
    label: "School Management",
    items: [
      { title: "Students", to: "/students", icon: Users, roles: [...LEADERS, "teacher"] },
      { title: "Admissions", to: "/admissions", icon: UserPlus, roles: LEADERS },
      { title: "Classes & Subjects", to: "/academics", icon: BookOpen, roles: [...LEADERS, "teacher"] },
      { title: "Staff", to: "/staff", icon: Briefcase, roles: [...LEADERS, "hr"] },
    ],
  },
  {
    label: "Academics",
    items: [
      { title: "Attendance", to: "/attendance", icon: CalendarCheck, roles: [...LEADERS, "teacher"] },
      { title: "Timetable", to: "/timetable", icon: CalendarClock, roles: [...LEADERS, "teacher", "student", "parent"] },
      { title: "Exams & Results", to: "/exams", icon: ClipboardList, roles: [...LEADERS, "teacher", "parent", "student"] },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Fees & Payments", to: "/finance", icon: Wallet, roles: [...FINANCE, "parent"] },
      { title: "Expenses", to: "/expenses", icon: Receipt, roles: FINANCE },
    ],
  },
  {
    label: "Engagement",
    items: [
      { title: "Communication", to: "/communications", icon: MessageSquare, roles: ALL },
      { title: "Parent Portal", to: "/parent-portal", icon: HeartHandshake, roles: [...LEADERS, "parent"] },
    ],
  },
  { label: "Insights", items: [{ title: "Reports", to: "/reports", icon: BarChart3, roles: [...LEADERS, "bursar", "hr"] }] },
  {
    label: "Administration",
    items: [
      { title: "School Setup", to: "/setup", icon: Building2, roles: ["platform_super_admin", "proprietor", "school_admin"] },
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

export function findNav(pathname: string) {
  for (const g of NAV_GROUPS) {
    for (const i of g.items) if (pathname === i.to || pathname.startsWith(i.to + "/")) return { group: g.label, item: i };
  }
  return null;
}
