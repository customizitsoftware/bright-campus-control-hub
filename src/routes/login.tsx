import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { TextField } from "@/components/common/form-field";
import { PendingBanner } from "@/components/common/pending-action";
import { Button } from "@/components/ui/button";
import { notifyPending } from "@/lib/pending";

export const Route = createFileRoute("/login")({
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <AuthLayout title="Sign in" description="Welcome back. Use your school account.">
      <PendingBanner>Sign-in is not connected yet. Your details are not checked or stored.</PendingBanner>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); notifyPending("Sign-in"); }}>
        <TextField label="Email" type="email" autoComplete="email" required value={email} onChange={setEmail} />
        <TextField label="Password" type="password" autoComplete="current-password" required value={password} onChange={setPassword} />
        <div className="flex justify-end text-sm"><Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link></div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Exploring the preview? <Link to="/dashboard" className="text-primary hover:underline">Open the console</Link>
      </p>
    </AuthLayout>
  );
}
