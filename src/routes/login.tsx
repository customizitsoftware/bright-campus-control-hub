import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/auth-layout";
import { TextField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { safeDestination } from "@/lib/backend-model";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => {
    const r = safeDestination(s["redirect"], "");
    return r ? { redirect: r } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign in · SchoolOS" },
      { name: "description", content: "Sign in to your school's SchoolOS console." },
      { property: "og:title", content: "Sign in · SchoolOS" },
      { property: "og:description", content: "Sign in to your school's SchoolOS console." },
    ],
  }),
  component: Login,
});

function Login() {
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    // Full navigation so every query and server call starts with the new session.
    window.location.assign(safeDestination(search.redirect));
  }

  return (
    <AuthLayout title="Sign in" description="Welcome back. Use your school account.">
      <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
        <TextField label="Email" type="email" autoComplete="email" required value={email} onChange={setEmail} />
        <TextField label="Password" type="password" autoComplete="current-password" required value={password} onChange={setPassword} />
        <div className="flex justify-end text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        New to SchoolOS? <Link to="/register" className="text-primary hover:underline">Register your school</Link>
      </p>
    </AuthLayout>
  );
}
