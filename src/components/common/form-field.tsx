import { useId, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Base = { label: string; hint?: string | undefined; error?: string | undefined; required?: boolean };

function Wrap({ id, label, hint, error, required, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-destructive" aria-hidden>*</span>}
      </Label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function TextField({
  value, onChange, type = "text", placeholder, autoComplete, ...base
}: Base & { value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoComplete?: string }) {
  const id = useId();
  return (
    <Wrap id={id} {...base}>
      <Input
        id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        required={base.required} aria-invalid={!!base.error}
        aria-describedby={base.error ? `${id}-error` : base.hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrap>
  );
}

export function SelectField({
  value, onChange, options, placeholder = "Select…", ...base
}: Base & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  const id = useId();
  return (
    <Wrap id={id} {...base}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-invalid={!!base.error}><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </Wrap>
  );
}
