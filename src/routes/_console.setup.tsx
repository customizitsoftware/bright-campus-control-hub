import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { TextField, SelectField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { NIGERIAN_STATES } from "@/lib/locale-data";
import { useSchool } from "@/components/layout/school-context";

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

type Setup = {
  name: string; school_type: string | null; country: string | null; state: string | null; timezone: string | null;
  motto: string | null; brand_colour: string | null; logo_path: string | null; onboarding_completed: boolean;
  access_mode: string;
  session: { name: string; current_term: string } | null;
  campuses: string[];
  max_campuses: { enabled: boolean; limit_value: number | null; is_unlimited: boolean } | null;
};

type RpcResult = { data: unknown; error: { message: string } | null };
// The generated types don't know the newest functions yet, so call them through a narrow wrapper.
const rpc = (fn: string, args: Record<string, unknown>) =>
  (supabase as unknown as { rpc: (f: string, a: Record<string, unknown>) => Promise<RpcResult> }).rpc(fn, args);

const STEPS = ["School details", "Location", "Academic session", "Campuses", "Branding", "Review"];
const MAX_LOGO_BYTES = 1024 * 1024;
const LOGO_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

function friendlyError(message: string) {
  if (message.includes("limit_reached")) return "Your plan's campus limit has been reached. Upgrade your plan to add more campuses.";
  if (message.includes("subscription_inactive")) return "Your subscription is not active, so changes can't be saved. Renew to continue.";
  if (message.includes("campus_names_required")) return "Enter at least one campus name.";
  if (message.includes("forbidden")) return "Only a school administrator can save the school setup.";
  return message;
}

function SetupWizard() {
  const workspace = useSchool();
  const selectedSchoolId = workspace.selected?.school_id;
  const selectedRole = workspace.selected?.role;
  const [status, setStatus] = useState<"loading" | "signed_out" | "no_school" | "ready">("loading");
  const [schoolId, setSchoolId] = useState("");
  const [setup, setSetup] = useState<Setup | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [f, setF] = useState<Form>({
    name: "", type: "", country: "NG", state: "", timezone: "Africa/Lagos",
    session: "", currentTerm: "first", campusMode: "single", campusNames: "", motto: "", primaryColor: "#2b3a8c",
  });
  const set = <K extends keyof Form>(k: K) => (v: Form[K]) => setF((s) => ({ ...s, [k]: v }));
  const canNext = step === 0 ? f.name.trim() && f.type : step === 1 ? f.state : step === 2 ? /^\d{4}\/\d{4}$/.test(f.session) : true;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!selectedSchoolId || selectedRole !== 'school_admin') { if (!cancelled) setStatus("no_school"); return; }
      setStatus("loading");
      const { data, error } = await rpc("get_school_setup", { _school_id: selectedSchoolId });
      if (cancelled) return;
      if (error || !data) { toast.error(error ? friendlyError(error.message) : "Could not load your school."); setStatus("no_school"); return; }
      const s = data as Setup;
      setSchoolId(selectedSchoolId);
      setSetup(s);
      setF((prev) => ({
        ...prev,
        name: s.name ?? prev.name,
        type: s.school_type ?? "",
        country: s.country ?? "NG",
        state: s.state ?? "",
        timezone: s.timezone ?? prev.timezone,
        session: s.session?.name ?? "",
        currentTerm: s.session?.current_term ?? "first",
        campusMode: s.campuses.length > 1 ? "multi" : "single",
        campusNames: s.campuses.length > 1 ? s.campuses.join(", ") : "",
        motto: s.motto ?? "",
        primaryColor: s.brand_colour ?? prev.primaryColor,
      }));
      setStatus("ready");
    })();
    return () => { cancelled = true; };
  }, [selectedSchoolId, selectedRole]);

  useEffect(() => {
    if (!logoFile) { setLogoPreview(null); return; }
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  function onLogoChosen(file: File | undefined) {
    if (!file) return;
    if (!LOGO_TYPES[file.type]) { toast.error("Use a PNG, JPEG or WebP image."); return; }
    if (file.size > MAX_LOGO_BYTES) { toast.error("The logo must be 1 MB or smaller."); return; }
    setLogoFile(file);
  }

  const maxCampuses = setup?.max_campuses;
  const singleOnly = !!maxCampuses && !maxCampuses.is_unlimited && (maxCampuses.limit_value ?? 0) <= 1;
  const canSave = setup?.access_mode === "full";
  const existingLogoUrl = setup?.logo_path ? supabase.storage.from("school-logos").getPublicUrl(setup.logo_path).data.publicUrl : null;
  const shownLogo = logoPreview ?? existingLogoUrl;

  async function save() {
    setSaving(true);
    let uploadedPath: string | null = null;
    try {
      if (logoFile) {
        const ext = LOGO_TYPES[logoFile.type];
        uploadedPath = `${schoolId}/logo-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("school-logos").upload(uploadedPath, logoFile, { contentType: logoFile.type, upsert: false });
        if (upErr) { uploadedPath = null; throw new Error(upErr.message); }
      }
      const campusNames = f.campusMode === "multi" ? f.campusNames.split(",").map((s) => s.trim()).filter(Boolean) : [];
      const { error } = await rpc("save_school_setup", {
        _school_id: schoolId, _name: f.name, _type: f.type, _state: f.state, _timezone: f.timezone,
        _session: f.session, _term: f.currentTerm, _campus_mode: f.campusMode, _campus_names: campusNames,
        _motto: f.motto, _brand_colour: f.primaryColor, _logo_path: uploadedPath,
      });
      if (error) throw new Error(error.message);
      toast.success("School setup saved.");
      window.location.assign("/dashboard");
    } catch (err) {
      if (uploadedPath) void supabase.storage.from("school-logos").remove([uploadedPath]);
      toast.error(friendlyError(err instanceof Error ? err.message : "Something went wrong."));
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") return <p role="status" className="p-6 text-sm text-muted-foreground">Loading your school…</p>;
  if (status === "signed_out" || status === "no_school") {
    return (
      <div className="space-y-4 p-6">
        <PageHeader title="School setup" description={status === "signed_out" ? "Sign in to set up your school." : "We couldn't find a school you administer."} breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "School Setup" }]} />
        {status === "signed_out"
          ? <Button asChild><Link to="/login" search={{ redirect: "/setup" }}>Sign in</Link></Button>
          : <Button asChild><Link to="/register">Register your school</Link></Button>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="School setup" description="Tell us about your school. Your answers are saved to your school's workspace." breadcrumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "School Setup" }]} />
      {!canSave && (
        <div role="status" className="rounded-lg border border-border bg-card p-4 text-sm">
          Your workspace isn't fully active ({setup?.access_mode?.replace("_", " ")}). You can review the setup, but saving is disabled until the subscription is active.
        </div>
      )}

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
          onSubmit={(e) => { e.preventDefault(); if (step < STEPS.length - 1) { if (canNext) setStep(step + 1); } else if (canSave) void save(); }}>
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
                    <RadioGroupItem id={o.v} value={o.v} className="mt-0.5" disabled={o.v === "multi" && singleOnly} />
                    <span><span className="block font-medium">{o.l}</span><span className="text-xs font-normal text-muted-foreground">{o.d}</span></span>
                  </Label>
                ))}
              </RadioGroup>
              {singleOnly && <p className="text-xs text-muted-foreground">Your current plan includes one campus. Upgrade your plan to add more.</p>}
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="school-logo">School logo</Label>
                {shownLogo && <img src={shownLogo} alt="School logo preview" className="size-20 rounded-md border border-border bg-background object-contain" />}
                <input id="school-logo" type="file" accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => onLogoChosen(e.target.files?.[0])}
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-2 file:text-sm file:font-medium" />
                <p className="text-xs text-muted-foreground">PNG, JPEG or WebP, up to 1 MB.</p>
              </div>
            </div>
          )}
          {step === 5 && (
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              {[
                ["School name", f.name], ["Type", f.type.replace("_", " ")], ["Country", "Nigeria"], ["State", f.state], ["Timezone", f.timezone],
                ["Session", f.session], ["Term", f.currentTerm], ["Campuses", f.campusMode === "multi" ? f.campusNames || "Multiple" : "Single campus"],
                ["Motto", f.motto || "—"], ["Brand colour", f.primaryColor], ["Logo", logoFile ? logoFile.name : setup?.logo_path ? "Current logo kept" : "None"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-muted px-3 py-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium capitalize">{v || "—"}</dd></div>
              ))}
            </dl>
          )}

          <div className="flex justify-between border-t border-border pt-4">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            <Button type="submit" disabled={!canNext || saving || (step === STEPS.length - 1 && !canSave)}>
              {step === STEPS.length - 1 ? (saving ? "Saving…" : "Save school") : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
