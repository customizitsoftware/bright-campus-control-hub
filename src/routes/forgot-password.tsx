import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { TextField } from "@/components/common/form-field";
import { PendingBanner } from "@/components/common/pending-action";
import { Button } from "@/components/ui/button";
import { notifyPending } from "@/lib/pending";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password · SchoolOS" },
      { name: "description", content: "Request a password reset link for your SchoolOS account." },
      { property: "og:title", content: "Reset password · SchoolOS" },
      { property: "og:description", content: "Request a password reset link for your SchoolOS account." },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  return (
    <AuthLayout title="Reset your password" description="Enter your email and we'll send you a reset link.">
      <PendingBanner>Password reset emails are not connected yet. No email will be sent.</PendingBanner>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); notifyPending("Password reset"); }}>
        <TextField label="Email" type="email" autoComplete="email" required value={email} onChange={setEmail} />
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
      <p className="text-center text-sm"><Link to="/login" className="text-primary hover:underline">Back to sign in</Link></p>
    </AuthLayout>
  );
}
