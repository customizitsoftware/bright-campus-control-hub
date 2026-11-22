import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, Bell, BookOpen, Building2, CalendarCheck, Check, ClipboardCheck, GraduationCap, LayoutDashboard,
  Megaphone, Rocket, Search, Settings2, ShieldCheck, Smartphone, TrendingUp, UserPlus, Users, Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IntervalToggle } from "@/components/billing/plan-comparison";
import { supabase } from "@/integrations/supabase/client";
import { catalogQuery } from "@/lib/backend-queries";
import { entitlementLabel, priceFor, type Interval } from "@/lib/backend-model";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SchoolOS — School management software for Nigerian schools" },
      { name: "description", content: "Run admissions, attendance, results, fees and parent communication from one secure workspace. Start a free trial of SchoolOS for your nursery, primary or secondary school." },
      { property: "og:title", content: "SchoolOS — School management software for Nigerian schools" },
      { property: "og:description", content: "One secure workspace for admissions, attendance, results, fees and parent communication. Start a free trial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Landing,
});

/* ------------------------------------------------------------------ */
/* Content. Flip `status` to "live" as each module ships.              */
/* ------------------------------------------------------------------ */
type Status = "live" | "rolling";
const MODULES: { icon: LucideIcon; title: string; text: string; status: Status }[] = [
  { icon: Settings2, title: "School setup & branding", text: "Profile, academic session, campuses, logo and brand colour, guided step by step.", status: "live" },
  { icon: ClipboardCheck, title: "Admissions", text: "Take applications, track every stage and enrol approved students in one click.", status: "rolling" },
  { icon: Users, title: "Students & records", text: "One clean record per student and guardian, from nursery to final year.", status: "rolling" },
  { icon: CalendarCheck, title: "Attendance", text: "Mark the register in seconds and see who is absent before the first lesson ends.", status: "rolling" },
  { icon: BookOpen, title: "Exams & results", text: "Scores, grading, report cards and term results without the spreadsheets.", status: "rolling" },
  { icon: Wallet, title: "Fees & payments", text: "Fee schedules, invoices, receipts and a clear view of who owes what.", status: "rolling" },
  { icon: Megaphone, title: "Communication", text: "Reach parents and staff with announcements, SMS and notices.", status: "rolling" },
  { icon: Smartphone, title: "Parent portal", text: "Parents follow fees, attendance and results from their phone.", status: "rolling" },
  { icon: TrendingUp, title: "Reports & analytics", text: "Enrolment, attendance and fee collection trends for the head and proprietor.", status: "rolling" },
];

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Rocket, title: "Register your school", text: "Choose a plan and start a free trial. No payment details needed to begin." },
  { icon: Settings2, title: "Set up your profile", text: "Add your school details, session, campuses, logo and brand colour." },
  { icon: UserPlus, title: "Bring in your team", text: "Give heads, bursars, registrars and teachers the right level of access." },
  { icon: GraduationCap, title: "Run your school", text: "Move admissions, attendance, results and fees onto one platform." },
];

const TRUST: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ShieldCheck, title: "Every school is isolated", text: "Each school has its own workspace, users, records and settings. Schools never see each other's data." },
  { icon: Building2, title: "Grows with you", text: "Start with one campus and add more as you grow. Plans set clear limits you can upgrade at any time." },
  { icon: Wallet, title: "Priced in Naira", text: "Simple monthly or annual subscriptions in Naira, with receipts and a full billing history." },
  { icon: Check, title: "Secure by design", text: "Plan access and limits are enforced on the server, so they cannot be switched on from a browser." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Do I need a card to start the free trial?", a: "No. Pick a plan, register your school and start setting up straight away. The length of the free trial is shown on each plan." },
  { q: "What happens when my trial or subscription ends?", a: "Your workspace becomes view-only so your team can still see their records. Nothing is deleted, and you can renew at any time to edit again." },
  { q: "Can I upgrade or downgrade later?", a: "Yes. Upgrades apply straight away with a credit for the unused part of your current period. Downgrades take effect at your next renewal." },
  { q: "Can I run more than one campus?", a: "Yes, if your plan includes it. Each plan sets how many campuses, staff accounts and students you can have." },
  { q: "Is our school's data kept separate from other schools?", a: "Yes. Every school has its own isolated workspace, and access rules are enforced on the server, not just in the app." },
  { q: "How do I pay?", a: "Subscriptions are billed in Naira, monthly or annually. Every payment is verified securely on our servers before your plan is activated." },
];

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#interface", label: "Interface" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const naira = (minor: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(minor / 100);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function Landing() {
  return (
    <div className="bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:shadow-card">
        Skip to content
      </a>
      <LandingHeader />
      <main id="main">
        <Hero />
        <AudienceStrip />
        <Features />
        <Showcase />
        <HowItWorks />
        <Trust />
        <PricingSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function LandingHeader() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-sidebar/95 text-sidebar-foreground backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <span className="flex size-8 items-center justify-center rounded-lg bg-teal text-white"><GraduationCap className="size-5" aria-hidden /></span>
          SchoolOS
        </Link>
        <nav aria-label="Sections" className="hidden items-center gap-6 text-sm md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sidebar-foreground/75 transition-colors hover:text-white">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <Button asChild size="sm" className="bg-white text-sidebar hover:bg-white/90"><Link to="/dashboard">Open dashboard</Link></Button>
          ) : (
            <>
              <Link to="/login" className="px-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:text-white">Sign in</Link>
              <Button asChild size="sm" className="bg-white text-sidebar hover:bg-white/90"><Link to="/register">Get started</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient text-white">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-teal/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 pt-14 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <span className="size-1.5 rounded-full bg-teal" aria-hidden />
            For nursery, primary and secondary schools
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">Run your whole school from one place.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 md:text-lg">
            Admissions, attendance, results, fees and parent communication in one secure workspace. Set up your school in a few guided steps and grow from one campus to many.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-white text-sidebar hover:bg-white/90 sm:w-auto">
              <Link to="/register">Start free trial <ArrowRight aria-hidden /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto">
              <a href="#pricing">See pricing</a>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70">
            <li className="flex items-center gap-1.5"><Check className="size-4 text-teal" aria-hidden />No payment details to start</li>
            <li className="flex items-center gap-1.5"><Check className="size-4 text-teal" aria-hidden />Cancel any time</li>
          </ul>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="max-h-[21rem] overflow-hidden sm:max-h-[27rem]">
            <BrowserFrame label="Illustration of the SchoolOS dashboard with sample data"><DashboardMock /></BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

function AudienceStrip() {
  const items = ["Nursery schools", "Primary schools", "Secondary schools", "Multi-campus groups"];
  return (
    <section aria-label="Who SchoolOS is for" className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 text-sm font-medium text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-widest text-teal">Built for</span>
        {items.map((i) => <span key={i}>{i}</span>)}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-16 px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="The platform" title="Everything your school runs on" text="Modules are released in stages. Your plan decides which modules and limits your school can use." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(({ icon: Icon, title, text, status }) => (
            <article key={title} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary"><Icon className="size-5" aria-hidden /></span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status === "live" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
                  {status === "live" ? "Available" : "Rolling out"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Interface showcase                                                  */
/* ------------------------------------------------------------------ */
const TABS = [
  { id: "fees", label: "Fees & payments", title: "Know exactly who has paid", text: "See collected, outstanding and overdue fees at a glance, then open any student's invoices and receipts.", points: ["Termly fee schedules", "Invoices and receipts", "Overdue reminders for parents"] },
  { id: "attendance", label: "Attendance", title: "A register that takes seconds", text: "Teachers mark attendance on any device, and heads see the whole school's picture before the day gets busy.", points: ["Daily class registers", "Absence at a glance", "Term attendance summaries"] },
  { id: "parents", label: "Parent portal", title: "Parents stay in the loop", text: "Guardians check fees, attendance, results and announcements from their phone, with no phone calls to the office.", points: ["Fees due and paid", "Attendance and results", "School announcements"] },
] as const;
type TabId = (typeof TABS)[number]["id"];

function Showcase() {
  const [tab, setTab] = useState<TabId>("fees");
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  return (
    <section id="interface" className="scroll-mt-16 bg-muted/60 px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="The interface" title="Clear screens your staff will actually use" text="A calm, focused workspace for school leaders, bursars, registrars and teachers." />
        <div role="tablist" aria-label="Interface previews" className="mx-auto mt-10 flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-center">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="showcase-panel" onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id="showcase-panel" aria-labelledby={`tab-${active.id}`} className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="text-2xl font-semibold md:text-3xl">{active.title}</h3>
            <p className="mt-4 text-muted-foreground">{active.text}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {active.points.map((p) => (
                <li key={p} className="flex items-center gap-3"><span className="flex size-5 items-center justify-center rounded-full bg-success-soft text-success"><Check className="size-3" aria-hidden /></span>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            {tab === "fees" && <BrowserFrame label="Illustration of the fees screen with sample data" rounded><FeesMock /></BrowserFrame>}
            {tab === "attendance" && <BrowserFrame label="Illustration of the attendance register with sample data" rounded><AttendanceMock /></BrowserFrame>}
            {tab === "parents" && <PhoneFrame label="Illustration of the parent portal on a phone with sample data"><ParentMock /></PhoneFrame>}
            <p className="mt-3 text-center text-xs text-muted-foreground">Illustrative interface with sample data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrowserFrame({ children, label, rounded }: { children: ReactNode; label: string; rounded?: boolean }) {
  return (
    <div role="img" aria-label={label} className={`overflow-hidden border border-border bg-background text-foreground shadow-2xl ${rounded ? "rounded-xl" : "rounded-t-xl"}`}>
      <div aria-hidden className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/60" /><span className="size-2.5 rounded-full bg-highlight/70" /><span className="size-2.5 rounded-full bg-success/60" />
        <span className="ml-3 hidden flex-1 truncate rounded-md bg-background px-3 py-1 text-[11px] text-muted-foreground sm:block">yourschool · SchoolOS</span>
      </div>
      <div aria-hidden>{children}</div>
    </div>
  );
}

function PhoneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="img" aria-label={label} className="mx-auto w-64 overflow-hidden rounded-[2.25rem] border-[7px] border-sidebar bg-background text-foreground shadow-2xl">
      <div aria-hidden>{children}</div>
    </div>
  );
}

function Kpi({ label, value, note, tone = "text-foreground" }: { label: string; value: string; note?: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-card">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-lg font-semibold tabular-nums ${tone}`}>{value}</p>
      {note && <p className="text-[10px] text-muted-foreground">{note}</p>}
    </div>
  );
}

function DashboardMock() {
  const nav: [LucideIcon, string][] = [
    [LayoutDashboard, "Dashboard"], [Users, "Students"], [ClipboardCheck, "Admissions"], [CalendarCheck, "Attendance"],
    [BookOpen, "Exams & Results"], [Wallet, "Fees & Payments"], [Megaphone, "Communication"], [TrendingUp, "Reports"],
  ];
  const bars = [35, 48, 42, 60, 55, 72, 66, 84];
  const checklist = ["Create your school profile", "Set up classes & subjects", "Invite staff", "Enrol students", "Configure fees", "Connect parents"];
  return (
    <div className="flex min-h-[26rem] text-left">
      <div className="hidden w-48 shrink-0 bg-sidebar p-3 text-sidebar-foreground md:block">
        <div className="mb-4 flex items-center gap-2 px-2 pt-1 font-display text-sm font-semibold text-white">
          <span className="flex size-6 items-center justify-center rounded-md bg-teal"><GraduationCap className="size-4" /></span>SchoolOS
        </div>
        <ul className="space-y-1 text-xs">
          {nav.map(([Icon, label], i) => (
            <li key={label} className={`flex items-center gap-2 rounded-md px-2 py-2 ${i === 0 ? "bg-sidebar-accent text-white" : "text-sidebar-foreground/75"}`}><Icon className="size-3.5" />{label}</li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 flex-1 bg-background">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground"><Building2 className="size-3" />Greenfield Academy</div>
          <div className="hidden flex-1 items-center gap-2 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground sm:flex"><Search className="size-3" />Search students, staff, records…</div>
          <Bell className="size-4 text-muted-foreground" />
        </div>
        <div className="space-y-4 p-4">
          <div>
            <p className="font-display text-base font-semibold">Welcome to SchoolOS</p>
            <p className="text-[11px] text-muted-foreground">Here is how your school is doing today.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Students" value="412" note="Across 12 classes" />
            <Kpi label="Staff" value="38" note="4 roles" />
            <Kpi label="Present today" value="94%" tone="text-success" />
            <Kpi label="Fees collected" value="₦18.4M" note="This term" />
          </div>
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-lg border border-border bg-card p-3 shadow-card">
              <p className="text-[11px] font-medium">Fee collection by week</p>
              <div className="mt-3 flex h-24 items-end gap-2">
                {bars.map((h, i) => <div key={i} style={{ height: `${h}%` }} className="flex-1 rounded-t bg-primary/80" />)}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 shadow-card">
              <p className="text-[11px] font-medium">Onboarding checklist · 3 of 6</p>
              <ul className="mt-2 space-y-1.5">
                {checklist.map((c, i) => (
                  <li key={c} className="flex items-center gap-2 text-[11px]">
                    <span className={`flex size-3.5 items-center justify-center rounded-full border ${i < 3 ? "border-success bg-success text-white" : "border-border"}`}>{i < 3 && <Check className="size-2.5" />}</span>
                    <span className={i < 3 ? "text-muted-foreground line-through" : ""}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeesMock() {
  const rows: [string, string, string, "Paid" | "Part paid" | "Overdue"][] = [
    ["Adaeze O.", "Primary 4B", "₦85,000", "Paid"],
    ["Tunde B.", "JSS 1A", "₦120,000", "Part paid"],
    ["Zainab M.", "Nursery 2", "₦65,000", "Paid"],
    ["Chinedu E.", "Primary 6A", "₦95,000", "Overdue"],
    ["Ifeoma A.", "SS 2C", "₦140,000", "Paid"],
  ];
  const chip = { Paid: "bg-success-soft text-success", "Part paid": "bg-warning-soft text-warning", Overdue: "bg-destructive/10 text-destructive" } as const;
  return (
    <div className="space-y-4 p-4 text-left">
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="Collected" value="₦18.4M" tone="text-success" />
        <Kpi label="Outstanding" value="₦6.2M" tone="text-warning" />
        <Kpi label="Overdue" value="37" note="invoices" tone="text-destructive" />
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="grid grid-cols-[1.2fr_1fr_0.9fr_0.9fr] gap-2 border-b border-border bg-muted px-3 py-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>Student</span><span>Class</span><span>Amount</span><span>Status</span>
        </div>
        {rows.map(([name, cls, amt, status]) => (
          <div key={name} className="grid grid-cols-[1.2fr_1fr_0.9fr_0.9fr] items-center gap-2 border-b border-border px-3 py-2.5 text-[11px] last:border-0">
            <span className="truncate font-medium">{name}</span><span className="truncate text-muted-foreground">{cls}</span>
            <span className="tabular-nums">{amt}</span>
            <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${chip[status]}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendanceMock() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const reg: [string, ("P" | "A" | "L")[]][] = [
    ["Adaeze O.", ["P", "P", "P", "P", "P"]], ["Tunde B.", ["P", "L", "P", "P", "A"]], ["Zainab M.", ["P", "P", "P", "P", "P"]],
    ["Chinedu E.", ["A", "P", "P", "L", "P"]], ["Ifeoma A.", ["P", "P", "P", "P", "P"]], ["Emeka N.", ["P", "P", "A", "P", "P"]],
  ];
  const cell = { P: "bg-success-soft text-success", A: "bg-destructive/10 text-destructive", L: "bg-warning-soft text-warning" } as const;
  return (
    <div className="space-y-4 p-4 text-left">
      <div className="flex items-center justify-between">
        <div><p className="font-display text-base font-semibold">Primary 4B · This week</p><p className="text-[11px] text-muted-foreground">Class teacher: Mrs Bello</p></div>
        <span className="rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-medium text-success">93% present</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="grid grid-cols-[1.3fr_repeat(5,1fr)] gap-1.5 border-b border-border bg-muted px-3 py-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>Student</span>{days.map((d) => <span key={d} className="text-center">{d}</span>)}
        </div>
        {reg.map(([name, marks]) => (
          <div key={name} className="grid grid-cols-[1.3fr_repeat(5,1fr)] items-center gap-1.5 border-b border-border px-3 py-2 text-[11px] last:border-0">
            <span className="truncate font-medium">{name}</span>
            {marks.map((m, i) => <span key={i} className={`mx-auto flex size-6 items-center justify-center rounded-md text-[10px] font-semibold ${cell[m]}`}>{m}</span>)}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground">P present · A absent · L late</p>
    </div>
  );
}

function ParentMock() {
  return (
    <div className="space-y-3 bg-muted/40 p-4 pb-6 text-left">
      <div className="flex items-center justify-between pt-2">
        <div><p className="text-[10px] text-muted-foreground">Good morning,</p><p className="font-display text-sm font-semibold">Mrs Okafor</p></div>
        <span className="flex size-7 items-center justify-center rounded-full bg-accent"><Bell className="size-3.5 text-primary" /></span>
      </div>
      <div className="rounded-xl bg-brand-gradient p-3 text-white">
        <p className="text-[10px] text-white/70">Your child</p>
        <p className="font-display text-sm font-semibold">Adaeze Okafor</p>
        <p className="text-[10px] text-white/70">Primary 4B · Greenfield Academy</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-3 shadow-card">
        <p className="text-[10px] text-muted-foreground">Fees due</p>
        <p className="font-display text-base font-semibold tabular-nums">₦45,000</p>
        <div className="mt-2 rounded-lg bg-primary py-1.5 text-center text-[11px] font-medium text-primary-foreground">Pay now</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 shadow-card"><p className="text-[10px] text-muted-foreground">Attendance</p><p className="font-display text-base font-semibold text-success">96%</p></div>
        <div className="rounded-xl border border-border bg-card p-3 shadow-card"><p className="text-[10px] text-muted-foreground">Latest result</p><p className="font-display text-base font-semibold">Term 1 ready</p></div>
      </div>
      <div className="rounded-xl border border-border bg-card p-3 shadow-card">
        <p className="flex items-center gap-1.5 text-[10px] font-medium text-info"><Megaphone className="size-3" />Announcement</p>
        <p className="mt-1 text-[11px]">Mid-term break begins on Friday. School resumes Monday.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* How it works, trust, pricing, FAQ, CTA, footer                      */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="How it works" title="From sign-up to a running school" text="Four simple steps, and you can start before you pay anything." />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-xl border border-border bg-card p-6 shadow-card">
              <span className="font-display text-sm font-semibold text-teal">Step {i + 1}</span>
              <span className="mt-3 flex size-10 items-center justify-center rounded-lg bg-accent text-primary"><Icon className="size-5" aria-hidden /></span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="bg-sidebar px-5 py-20 text-sidebar-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-primary">Why SchoolOS</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Serious software for school data</h2>
          <p className="mt-4 text-sidebar-foreground/75">Your students' records deserve more than a shared spreadsheet. SchoolOS is built so each school stays private, organised and in control.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary"><Icon className="size-5" aria-hidden /></span>
              <div><h3 className="font-semibold text-white">{title}</h3><p className="mt-1.5 text-sm text-sidebar-foreground/75">{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const { data: catalog, isPending, isError } = useQuery(catalogQuery());
  const [billing, setBilling] = useState<Interval>("monthly");
  const featuredId = catalog && catalog.plans.length === 3 ? catalog.plans[1]?.id : undefined;

  return (
    <section id="pricing" className="scroll-mt-16 bg-muted/60 px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Pricing" title="Simple plans for every school" text="Start with a free trial. Upgrade, downgrade or cancel whenever your school needs." />
        <div className="mt-8 flex justify-center"><IntervalToggle value={billing} onChange={setBilling} /></div>

        {isPending && (
          <div className="mt-10 grid gap-5 md:grid-cols-3" role="status" aria-label="Loading plans">
            {[0, 1, 2].map((i) => <div key={i} className="h-80 animate-pulse rounded-xl border border-border bg-card" />)}
          </div>
        )}
        {isError && (
          <p role="alert" className="mt-10 text-center text-sm text-muted-foreground">
            We couldn't load the plans just now. <Link to="/pricing" className="text-primary underline">View the pricing page</Link>.
          </p>
        )}
        {catalog && (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {catalog.plans.map((plan) => {
              const price = priceFor(catalog, plan.id, billing);
              const limits = ["max_students", "max_staff_accounts", "max_campuses"].flatMap((key) => {
                const f = catalog.features.find((x) => x.key === key);
                return f ? [{ name: f.name, value: entitlementLabel(catalog.entitlements.find((e) => e.plan_id === plan.id && e.feature_key === key), f) }] : [];
              });
              const extras = catalog.features.filter((f) => f.kind === "boolean" && catalog.entitlements.some((e) => e.plan_id === plan.id && e.feature_key === f.key && e.enabled));
              const featured = plan.id === featuredId;
              return (
                <article key={plan.id} className={`relative flex flex-col rounded-xl border bg-card p-6 shadow-card ${featured ? "border-primary ring-1 ring-primary" : "border-border"}`}>
                  {featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">Recommended</span>}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.description}</p>
                  <p className="mt-5 break-words font-display text-4xl font-semibold tabular-nums">{price ? naira(price.amount_minor) : "Unavailable"}</p>
                  <p className="text-sm text-muted-foreground">{billing === "annual" ? "per year" : "per month"}</p>
                  {plan.trial_days > 0 && <p className="mt-3 text-sm font-medium text-teal">{plan.trial_days}-day free trial</p>}
                  <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                    {limits.map((l) => (
                      <div key={l.name} className="flex justify-between gap-3"><dt className="text-muted-foreground">{l.name}</dt><dd className="font-medium">{l.value}</dd></div>
                    ))}
                  </dl>
                  {extras.length > 0 && (
                    <ul className="mt-4 flex-1 space-y-2 text-sm">
                      {extras.slice(0, 5).map((f) => <li key={f.key} className="flex items-center gap-2"><Check className="size-4 shrink-0 text-success" aria-hidden />{f.name}</li>)}
                    </ul>
                  )}
                  <div className="mt-6">
                    {price ? (
                      <Button asChild className="w-full" variant={featured ? "default" : "outline"}><Link to="/register" search={{ plan: plan.code, interval: billing }}>Choose {plan.name}</Link></Button>
                    ) : <Button className="w-full" disabled>Unavailable</Button>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Want every feature side by side? <Link to="/pricing" className="font-medium text-primary hover:underline">Compare all plans</Link>
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 px-5 py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="FAQ" title="Questions schools ask us" />
        <Accordion type="single" collapsible className="mt-10 w-full rounded-xl border border-border bg-card px-5 shadow-card">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 pb-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-brand-gradient px-6 py-14 text-center text-white md:px-12 md:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-teal/25 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-semibold md:text-4xl">Ready to run a better-organised school?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">Register your school today and start your free trial. No payment details needed.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full bg-white text-sidebar hover:bg-white/90 sm:w-auto"><Link to="/register">Start free trial <ArrowRight aria-hidden /></Link></Button>
            <Button asChild size="lg" variant="outline" className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"><Link to="/login">Sign in</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm sm:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-white">
          <span className="flex size-7 items-center justify-center rounded-md bg-teal"><GraduationCap className="size-4" aria-hidden /></span>SchoolOS
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sidebar-foreground/75">
          <Link to="/pricing" className="hover:text-white">Pricing</Link>
          <Link to="/login" className="hover:text-white">Sign in</Link>
          <Link to="/register" className="hover:text-white">Register your school</Link>
        </nav>
        <p className="text-xs text-sidebar-foreground/60">© {new Date().getFullYear()} SchoolOS. All rights reserved.</p>
      </div>
    </footer>
  );
}
