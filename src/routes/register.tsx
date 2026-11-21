import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { catalogQuery } from "@/lib/backend-queries";
import { registerSchool, checkoutInvoice, initializePayment } from "@/lib/backend.functions";
import { formatMinor, priceFor, type Interval } from "@/lib/backend-model";
import { PublicHeader } from "@/components/layout/public-header";
import { IntervalToggle, PlanComparison } from "@/components/billing/plan-comparison";
import { TextField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { RouteError, RouteMissing, RoutePending } from "@/components/common/route-feedback";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { plan?: string; interval?: Interval } => ({
    ...(typeof s["plan"] === "string" ? { plan: s["plan"] } : {}),
    ...(s["interval"] === "annual" ? { interval: "annual" as const } : s["interval"] === "monthly" ? { interval: "monthly" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Register your school · SchoolOS" },
      { name: "description", content: "Create your SchoolOS account, choose a plan and set up your school." },
      { property: "og:title", content: "Register your school · SchoolOS" },
      { property: "og:description", content: "Create your account and choose a subscription plan." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(catalogQuery());
  },
  errorComponent: RouteError,
  notFoundComponent: RouteMissing,
  pendingComponent: RoutePending,
  component: Register,
});

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48).replace(/-+$/g, "");
}
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

function Register() {
  const { data: catalog } = useSuspenseQuery(catalogQuery());
  const search = Route.useSearch();

  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [interval, setInterval] = useState<Interval>(search.interval ?? "monthly");
  const [planCode, setPlanCode] = useState<string>(
    search.plan && catalog.plans.some((p) => p.code === search.plan) ? search.plan : (catalog.plans[0]?.code ?? ""),
  );
  const [mode, setMode] = useState<"trial" | "pay">("trial");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [country, setCountry] = useState("NG");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  const plan = catalog.plans.find((p) => p.code === planCode);
  const price = plan ? priceFor(catalog, plan.id, interval) : undefined;
  const trialAvailable = !!plan && plan.trial_days > 0;
  const effectiveMode = trialAvailable ? mode : "pay";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!plan || !price) {
      toast.error("Choose a plan that has a price for this billing interval.");
      return;
    }
    if (!SLUG_PATTERN.test(slug)) {
      toast.error("The school address must be 3–50 characters: lowercase letters, numbers and hyphens.");
      return;
    }
    setBusy(true);
    try {
      if (!signedIn) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw new Error(error.message);
        if (!data.session) {
          setNotice("We sent a confirmation link to your email. Confirm it, sign in, then return to this page to finish registering your school.");
          return;
        }
      }

      const schoolId = await registerSchool({
        data: {
          name: schoolName.trim(),
          slug,
          country: country.trim().toUpperCase(),
          email: schoolEmail.trim(),
          phone: phone.trim(),
          planCode: plan.code,
          interval,
          startTrial: effectiveMode === "trial",
        },
      });

      if (effectiveMode === "trial") {
        window.location.assign("/dashboard");
        return;
      }

      const invoiceId = await checkoutInvoice({ data: { schoolId, planCode: plan.code, interval } });
      if (!invoiceId) throw new Error("No invoice was created for this plan.");
      const { authorization_url } = await initializePayment({
        data: { invoiceId, callbackUrl: `${window.location.origin}/payment-return` },
      });
      window.location.assign(authorization_url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message.includes("schools_slug_key") ? "That school address is already taken. Try another." : message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-10">
        <div>
          <h1 className="text-3xl font-semibold">Register your school</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a plan, then tell us about your school. Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>

        <section aria-labelledby="plan-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="plan-heading" className="text-lg font-semibold">1. Choose a plan</h2>
            <IntervalToggle value={interval} onChange={setInterval} />
          </div>
          <PlanComparison catalog={catalog} interval={interval} selected={planCode} onSelect={setPlanCode} />
        </section>

        <form className="max-w-xl space-y-8" onSubmit={(e) => void onSubmit(e)}>
          {signedIn === false && (
            <section className="space-y-4" aria-labelledby="account-heading">
              <h2 id="account-heading" className="text-lg font-semibold">2. Your account</h2>
              <TextField label="Your full name" autoComplete="name" required value={fullName} onChange={setFullName} />
              <TextField label="Email" type="email" autoComplete="email" required value={email} onChange={setEmail} />
              <TextField label="Password" type="password" autoComplete="new-password" required value={password} onChange={setPassword} hint="At least 8 characters." />
            </section>
          )}

          <section className="space-y-4" aria-labelledby="school-heading">
            <h2 id="school-heading" className="text-lg font-semibold">{signedIn === false ? "3." : "2."} Your school</h2>
            <TextField
              label="School name" required value={schoolName}
              onChange={(v) => { setSchoolName(v); if (!slugEdited) setSlug(slugify(v)); }}
            />
            <TextField
              label="School address" required value={slug}
              onChange={(v) => { setSlugEdited(true); setSlug(slugify(v)); }}
              hint="Lowercase letters, numbers and hyphens. This identifies your school on SchoolOS."
            />
            <TextField label="Country code" required value={country} onChange={setCountry} hint="Two letters, for example NG." />
            <TextField label="School email" type="email" required value={schoolEmail} onChange={setSchoolEmail} />
            <TextField label="School phone" type="tel" autoComplete="tel" value={phone} onChange={setPhone} />
          </section>

          <fieldset className="space-y-3">
            <legend className="text-lg font-semibold">{signedIn === false ? "4." : "3."} How would you like to start?</legend>
            {trialAvailable && plan && (
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4">
                <input type="radio" name="mode" className="mt-1" checked={effectiveMode === "trial"} onChange={() => setMode("trial")} />
                <span>
                  <span className="block font-medium">Start a {plan.trial_days}-day free trial</span>
                  <span className="text-sm text-muted-foreground">No payment now. Choose to subscribe before the trial ends.</span>
                </span>
              </label>
            )}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4">
              <input type="radio" name="mode" className="mt-1" checked={effectiveMode === "pay"} onChange={() => setMode("pay")} />
              <span>
                <span className="block font-medium">Subscribe and pay now{price ? ` — ${formatMinor(price.amount_minor)}` : ""}</span>
                <span className="text-sm text-muted-foreground">You will be taken to our payment provider. Your workspace opens once the payment is verified.</span>
              </span>
            </label>
          </fieldset>

          {notice && <p role="status" className="rounded-lg border border-border bg-card p-4 text-sm">{notice}</p>}
          <Button type="submit" disabled={busy || !plan || !price}>
            {busy ? "Working…" : effectiveMode === "trial" ? "Start free trial" : "Continue to payment"}
          </Button>
        </form>
      </main>
    </>
  );
}
