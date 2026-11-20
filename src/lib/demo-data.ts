/**
 * DEMO / SAMPLE DATA ONLY.
 * Fictional names and figures used to preview layouts. Not real school records.
 * Every screen that renders this data must show a visible "Demo" label.
 */

const FIRST = ["Chiamaka", "Tunde", "Aisha", "Emeka", "Funmilayo", "Ibrahim", "Ngozi", "Oluwaseun", "Zainab", "Chinedu", "Adaeze", "Musa", "Temitope", "Obinna", "Halima", "Kelechi", "Bolanle", "Yusuf", "Ifeoma", "Damilola", "Uche", "Amina", "Segun", "Nneka"];
const LAST = ["Okafor", "Adeyemi", "Bello", "Nwosu", "Balogun", "Abubakar", "Eze", "Ogunleye", "Usman", "Okonkwo", "Afolabi", "Danjuma", "Olawale", "Chukwu", "Ibekwe", "Lawal"];
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length] as T;

export const CLASS_LEVELS = ["Nursery 1", "Nursery 2", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];
export const ARMS = ["A", "B", "C"];

export type StudentStatus = "active" | "suspended" | "withdrawn" | "graduated";
export type DemoStudent = {
  id: string; name: string; admissionNo: string; level: string; arm: string; gender: "Male" | "Female";
  guardian: string; guardianPhone: string; status: StudentStatus; feeStatus: "paid" | "part" | "owing";
};

export const DEMO_STUDENTS: DemoStudent[] = Array.from({ length: 48 }, (_, i) => {
  const first = pick(FIRST, i * 7 + 3);
  const last = pick(LAST, i * 5 + 1);
  const statuses: StudentStatus[] = ["active", "active", "active", "active", "active", "active", "suspended", "withdrawn"];
  return {
    id: `demo-stu-${i + 1}`,
    name: `${first} ${last}`,
    admissionNo: `GFA/2025/${String(101 + i).padStart(4, "0")}`,
    level: pick(CLASS_LEVELS, i * 3 + 2),
    arm: pick(ARMS, i),
    gender: i % 2 === 0 ? "Female" : "Male",
    guardian: `${i % 3 === 0 ? "Mrs." : "Mr."} ${pick(FIRST, i + 11)} ${last}`,
    guardianPhone: `+234 80${(i % 9) + 1} ${String(300 + i * 13).slice(0, 3)} ${String(4000 + i * 37).slice(0, 4)}`,
    status: pick(statuses, i),
    feeStatus: (["paid", "paid", "part", "owing"] as const)[i % 4] ?? "paid",
  };
});

export const DEMO_KPIS = {
  enrolment: { value: 486, delta: "+18 this term" },
  feeCollection: { collected: 38_450_000, expected: 52_800_000 },
  attendanceToday: { present: 441, total: 486 },
  staff: { total: 42, teaching: 31 },
};

export const DEMO_TREND = [
  { month: "Sep", enrolment: 452, fees: 12.4 },
  { month: "Oct", enrolment: 461, fees: 21.8 },
  { month: "Nov", enrolment: 468, fees: 27.1 },
  { month: "Dec", enrolment: 470, fees: 29.6 },
  { month: "Jan", enrolment: 474, fees: 31.2 },
  { month: "Feb", enrolment: 480, fees: 35.0 },
  { month: "Mar", enrolment: 486, fees: 38.45 },
];

export const DEMO_ATTENDANCE_BREAKDOWN = [
  { label: "Present", value: 441, tone: "success" as const },
  { label: "Late", value: 19, tone: "warning" as const },
  { label: "Absent", value: 21, tone: "danger" as const },
  { label: "Excused", value: 5, tone: "info" as const },
];

export const DEMO_EVENTS = [
  { date: "2026-11-24", title: "PTA General Meeting", place: "Main Hall", kind: "Meeting" },
  { date: "2026-11-27", title: "Inter-house Sports Heats", place: "Sports Field", kind: "Sports" },
  { date: "2026-12-01", title: "First Term Examinations Begin", place: "All classes", kind: "Exams" },
  { date: "2026-12-12", title: "Christmas Carol & Prize-giving", place: "Main Hall", kind: "Event" },
  { date: "2026-12-16", title: "First Term Ends", place: "School-wide", kind: "Calendar" },
];

export const DEMO_ACTIVITY = [
  { who: "Mrs. Ngozi Eze", what: "recorded a payment of ₦185,000 for Tunde Adeyemi (JSS 2B)", when: "12 min ago", kind: "finance" },
  { who: "Mr. Segun Afolabi", what: "marked attendance for Primary 4A", when: "38 min ago", kind: "attendance" },
  { who: "Admissions desk", what: "received a new application for Nursery 1", when: "1 hr ago", kind: "admissions" },
  { who: "Mrs. Halima Usman", what: "submitted CA scores for SS 1 Mathematics", when: "2 hrs ago", kind: "exams" },
  { who: "School Admin", what: "sent an announcement to JSS 3 parents", when: "Yesterday", kind: "communication" },
];

export const DEMO_SETUP_STEPS = [
  { title: "School profile", done: true, to: "/setup" },
  { title: "Academic session & terms", done: true, to: "/setup" },
  { title: "Classes & arms", done: true, to: "/academics" },
  { title: "Fee structure", done: false, to: "/finance" },
  { title: "Invite staff", done: false, to: "/staff" },
  { title: "Connect parents", done: false, to: "/parent-portal" },
];

export const DEMO_CLASSES = CLASS_LEVELS.flatMap((level, li) =>
  ARMS.slice(0, li < 2 ? 2 : 3).map((arm, ai) => ({
    id: `${level}-${arm}`,
    level, arm,
    section: li < 2 ? "Nursery" : li < 8 ? "Primary" : li < 11 ? "Junior Secondary" : "Senior Secondary",
    teacher: `${ai % 2 ? "Mr." : "Mrs."} ${pick(FIRST, li * 3 + ai + 5)} ${pick(LAST, li + ai * 4)}`,
    students: 18 + ((li * 7 + ai * 5) % 15),
    capacity: 35,
    subjects: li < 2 ? 6 : li < 8 ? 10 : li < 11 ? 14 : 9,
  })),
);

export const DEMO_SUBJECTS = [
  { name: "Mathematics", code: "MTH", sections: ["Primary", "Junior Secondary", "Senior Secondary"] },
  { name: "English Language", code: "ENG", sections: ["Primary", "Junior Secondary", "Senior Secondary"] },
  { name: "Basic Science & Technology", code: "BST", sections: ["Primary", "Junior Secondary"] },
  { name: "Civic Education", code: "CVE", sections: ["Junior Secondary", "Senior Secondary"] },
  { name: "Yoruba / Igbo / Hausa", code: "NGL", sections: ["Primary", "Junior Secondary"] },
  { name: "Physics", code: "PHY", sections: ["Senior Secondary"] },
  { name: "Economics", code: "ECO", sections: ["Senior Secondary"] },
  { name: "Literacy & Numeracy", code: "LTN", sections: ["Nursery"] },
];

export type AppStage = "submitted" | "screening" | "exam" | "offered" | "enrolled" | "declined";
export const APP_STAGES: { value: AppStage; label: string }[] = [
  { value: "submitted", label: "Submitted" }, { value: "screening", label: "Screening" },
  { value: "exam", label: "Entrance exam" }, { value: "offered", label: "Offer sent" },
  { value: "enrolled", label: "Enrolled" }, { value: "declined", label: "Declined" },
];
export const DEMO_APPLICANTS = Array.from({ length: 22 }, (_, i) => ({
  id: `demo-app-${i + 1}`,
  name: `${pick(FIRST, i * 5 + 2)} ${pick(LAST, i * 3 + 7)}`,
  ref: `APP-26-${String(301 + i)}`,
  level: pick(["Nursery 1", "Primary 1", "JSS 1", "SS 1", "Primary 3"], i),
  date: `2026-${String(9 + (i % 3)).padStart(2, "0")}-${String(3 + ((i * 4) % 25)).padStart(2, "0")}`,
  stage: pick<AppStage>(["submitted", "screening", "exam", "offered", "enrolled", "submitted", "screening", "declined"], i),
  feePaid: i % 3 !== 2,
}));

export type InvoiceStatus = "paid" | "part" | "unpaid" | "overdue";
export const DEMO_INVOICES = DEMO_STUDENTS.slice(0, 30).map((s, i) => {
  const amount = s.level.startsWith("SS") ? 245_000 : s.level.startsWith("JSS") ? 210_000 : s.level.startsWith("Primary") ? 165_000 : 140_000;
  const status = pick<InvoiceStatus>(["paid", "paid", "part", "unpaid", "overdue", "paid"], i);
  const paid = status === "paid" ? amount : status === "part" ? Math.round(amount * 0.6) : 0;
  return {
    id: `demo-inv-${i + 1}`, invoiceNo: `INV-1T-${String(1001 + i)}`, student: s.name, klass: `${s.level}${s.arm}`,
    amount, paid, status, channel: status === "unpaid" || status === "overdue" ? "—" : pick(["Bank transfer", "Card", "POS", "Cash"], i),
    due: "2026-10-15",
  };
});

export const DEMO_EXPENSES = [
  { id: "e1", date: "2026-11-18", item: "Diesel for generator", category: "Utilities", amount: 320_000, status: "approved" },
  { id: "e2", date: "2026-11-15", item: "Science lab reagents", category: "Academics", amount: 145_500, status: "pending" },
  { id: "e3", date: "2026-11-12", item: "Bus maintenance", category: "Transport", amount: 210_000, status: "approved" },
  { id: "e4", date: "2026-11-08", item: "Exam printing & stationery", category: "Academics", amount: 98_000, status: "approved" },
  { id: "e5", date: "2026-11-04", item: "Security contractor (Nov)", category: "Services", amount: 450_000, status: "pending" },
];

export type AttendanceMark = "present" | "late" | "absent" | "excused";
export const markFor = (studentIdx: number, dateSeed: number): AttendanceMark =>
  pick<AttendanceMark>(["present", "present", "present", "present", "present", "present", "late", "present", "absent", "present", "present", "excused"], studentIdx * 7 + dateSeed);

export type ExamStage = "draft" | "scoring" | "review" | "approved" | "published";
export const EXAM_STAGES: { value: ExamStage; label: string }[] = [
  { value: "draft", label: "Setup" }, { value: "scoring", label: "Score entry" }, { value: "review", label: "HOD review" },
  { value: "approved", label: "Principal approval" }, { value: "published", label: "Published to parents" },
];
export const DEMO_EXAMS = [
  { id: "x1", name: "First Term Examination", session: "2026/2027", term: "First", classes: "All classes", stage: "scoring" as ExamStage, progress: 64 },
  { id: "x2", name: "Mid-term Continuous Assessment", session: "2026/2027", term: "First", classes: "JSS 1 – SS 3", stage: "published" as ExamStage, progress: 100 },
  { id: "x3", name: "SS 3 Mock (WAEC prep)", session: "2026/2027", term: "First", classes: "SS 3", stage: "review" as ExamStage, progress: 88 },
  { id: "x4", name: "Nursery Termly Observation", session: "2026/2027", term: "First", classes: "Nursery 1 – 2", stage: "draft" as ExamStage, progress: 10 },
];
export const DEMO_RESULTS = DEMO_STUDENTS.filter((s) => s.level === "JSS 2" || s.level.startsWith("JSS")).slice(0, 8).map((s, i) => {
  const ca = 22 + ((i * 7) % 18);
  const exam = 35 + ((i * 11) % 25);
  const total = ca + exam;
  return { id: s.id, name: s.name, klass: `${s.level}${s.arm}`, ca, exam, total, grade: total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 45 ? "D" : "F" };
});

export const STAFF_ROLES = ["Principal", "Vice Principal", "Teacher", "Bursar", "HR Officer", "Admin Officer", "Librarian", "Nurse"];
export const DEMO_STAFF = Array.from({ length: 24 }, (_, i) => ({
  id: `demo-stf-${i + 1}`,
  name: `${i % 2 ? "Mr." : "Mrs."} ${pick(FIRST, i * 3 + 1)} ${pick(LAST, i * 7 + 2)}`,
  staffNo: `STF-${String(201 + i)}`,
  role: i === 0 ? "Principal" : i === 1 ? "Vice Principal" : i === 2 ? "Bursar" : i === 3 ? "HR Officer" : i % 9 === 4 ? "Admin Officer" : i === 13 ? "Nurse" : "Teacher",
  department: pick(["Sciences", "Languages", "Humanities", "Primary", "Nursery", "Administration"], i),
  email: `${pick(FIRST, i * 3 + 1).toLowerCase()}.${pick(LAST, i * 7 + 2).toLowerCase()}@school.example`,
  status: i % 11 === 6 ? "on_leave" : "active",
}));

export const DEMO_TIMETABLE_PERIODS = ["8:00", "8:40", "9:20", "10:00", "10:40", "11:20", "12:00", "12:40"];
export const DEMO_TIMETABLE: Record<string, string[]> = {
  Monday: ["Mathematics", "English", "Basic Science", "Break", "Civic Ed.", "Yoruba", "PHE", "Computer"],
  Tuesday: ["English", "Mathematics", "Agric. Sci.", "Break", "Social Studies", "Music", "French", "Library"],
  Wednesday: ["Basic Tech.", "Mathematics", "English", "Break", "CRS / IRS", "Business St.", "Home Econ.", "Clubs"],
  Thursday: ["Mathematics", "Basic Science", "English", "Break", "Yoruba", "Civic Ed.", "Computer", "PHE"],
  Friday: ["English", "Mathematics", "Social Studies", "Break", "Fine Arts", "Assembly", "Sports", "Sports"],
};
