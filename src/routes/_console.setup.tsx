import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { PendingBanner } from "@/components/common/pending-action";
import { TextField, SelectField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { notifyPending } from "@/lib/pending";
import { cn } from "@/lib/utils";
import { NIGERIAN_STATES } from "@/lib/locale-data";

export const Route = createFileRoute("/_console/setup")({
  head: () => ({
    meta: [
      { title: "School Setup · SchoolOS" },
      { name: "description", content: "Set up your school profile, session, campuses and branding in SchoolOS." },
      { property: "og:title", content: "School Setup · SchoolOS" },
      { property: "og:description", content: "Set up your school profile, session, campuses and branding in SchoolOS." },
    ],
  }),
  component: SetupWizard,
});

type Form = {
  name: string; type: string; country: string; state: string; timezone: string;
  session: string; currentTerm: string; campusMode: string; campusNames: string;
  motto: string; primaryColor: string;
};

const STEPS = ["School details", "Location", "Academic session", "Campuses", "Branding", "Review"];

function SetupWizard() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>({
    name: "", type: "", country: "NG", state: "", timezone: "Africa/Lagos",
    session: "", currentTerm: "first", campusMode: "single", campusNames: "", motto: "", primaryColor: "#2b3a8c",
  });
  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => setF((s) => ({ ...s, [k]: v }));
  const canNext = step === 0 ? f.name.trim() && f.type : step === 1 ? f.state : step === 2 ? /^\d{4}\/\d{4}$/.test(f.session) : true;

  return (
    <div className="space-y-6">
      <PageHeader title="School setup" description="Tell us about your school. Your answers stay on this screen only." breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "School Setup" }]} />
      <PendingBanner>Saving is not connected yet — nothing you enter here is stored or sent.</PendingBanner>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Setup steps">
          <ol className="flex gap-2 overflow-x-auto lg:flex-col">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button type="button" onClick={() => i <= step && setStep(i)} disabled={i > step}
                  aria-current={i === step ? "step" : undefined}
                  className={cn("flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    i === step ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-muted disabled:hover:bg-transparent")}>
                  <span className={cn("flex size-6 items-center justify-center rounded-full border text-xs",
                    i < step ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </span>
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <form className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-card"
          onSubmit={(e) => { e.preventDefault(); if (step < STEPS.length - 1) { if (canNext) setStep(step + 1); } else notifyPending("Saving your school"); }}>
          <h2 className="text-lg font-semibold">{STEPS[step]}</h2>

          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="School name" required value={f.name} onChange={set("name")} placeholder="e.g. Greenfield Academy" />
              <SelectField label="School type" required value={f.type} onChange={set("type")} options={[
                { value: "nursery", label: "Nursery" }, { value: "primary", label: "Primary" }, { value: "secondary", label: "Secondary" },
                { value: "nursery_primary", label: "Nursery & Primary" }, { value: "all", label: "Nursery, Primary & Secondary" },
              ]} />
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Country" required value={f.country} onChange={set("country")} hint="More African countries are planned."
                options={[{ value: "NG", label: "Nigeria" }]} />
              <SelectField label="State" required value={f.state} onChange={set("state")} options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))} />
              <SelectField label="Timezone" required value={f.timezone} onChange={set("timezone")} options={[{ value: "Africa/Lagos", label: "Africa/Lagos (WAT, UTC+1)" }]} />
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Academic session" required value={f.session} onChange={set("session")} placeholder="2026/2027" hint="Format: YYYY/YYYY"
                error={f.session && !/^\d{4}\/\d{4}$/.test(f.session) ? "Use the format YYYY/YYYY" : undefined} />
              <SelectField label="Current term" value={f.currentTerm} onChange={set("currentTerm")} options={[
                { value: "first", label: "First term" }, { value: "second", label: "Second term" }, { value: "third", label: "Third term" },
              ]} />
            </div>
          )}
          {step === 3 && (
            <fieldset className="space-y-4">
              <legend className="text-sm text-muted-foreground">How is your school organised?</legend>
              <RadioGroup value={f.campusMode} onValueChange={set("campusMode")} className="grid gap-3 md:grid-cols-2">
                {[{ v: "single", l: "Single campus", d: "One location." }, { v: "multi", l: "Multiple campuses", d: "Several branches under one proprietor." }].map((o) => (
                  <Label key={o.v} htmlFor={o.v} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-accent">
                    <RadioGroupItem id={o.v} value={o.v} className="mt-0.5" />
                    <span><span className="block font-medium">{o.l}</span><span className="text-xs font-normal text-muted-foreground">{o.d}</span></span>
                  </Label>
                ))}
              </RadioGroup>
              {f.campusMode === "multi" && (
                <TextField label="Campus names" value={f.campusNames} onChange={set("campusNames")} placeholder="Ikeja, Lekki, Abuja" hint="Separate with commas." />
              )}
            </fieldset>
          )}
          {step === 4 && (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Motto" value={f.motto} onChange={set("motto")} placeholder="Optional" />
              <div className="space-y-1.5">
                <Label htmlFor="brand-color">Primary brand colour</Label>
                <input id="brand-color" type="color" value={f.primaryColor} onChange={(e) => set("primaryColor")(e.target.value)} className="h-9 w-20 cursor-pointer rounded-md border border-input bg-background" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>School logo</Label>
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Logo upload will be available once file storage is connected.</p>
              </div>
            </div>
          )}
          {step === 5 && (
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              {[
                ["School name", f.name], ["Type", f.type], ["Country", "Nigeria"], ["State", f.state], ["Timezone", f.timezone],
                ["Session", f.session], ["Term", f.currentTerm], ["Campuses", f.campusMode === "multi" ? f.campusNames || "Multiple" : "Single campus"],
                ["Motto", f.motto || "—"], ["Brand colour", f.primaryColor],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-muted px-3 py-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium capitalize">{v || "—"}</dd></div>
              ))}
            </dl>
          )}

          <div className="flex justify-between border-t border-border pt-4">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            <Button type="submit" disabled={!canNext}>{step === STEPS.length - 1 ? "Save school" : "Continue"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
