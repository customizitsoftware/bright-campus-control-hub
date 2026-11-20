import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-brand-gradient p-10 text-primary-foreground lg:flex">
        <Link to="/dashboard" className="flex items-center gap-2 font-display text-xl font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><GraduationCap className="size-5" aria-hidden /></span>
          SchoolOS
        </Link>
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-semibold leading-tight">One calm place to run your whole school.</h2>
          <p className="opacity-80">Admissions, academics, fees and parent communication — built for nursery, primary and secondary schools across Nigeria and Africa.</p>
        </div>
        <p className="text-xs opacity-60">© {new Date().getFullYear()} SchoolOS</p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
