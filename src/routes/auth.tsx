import { createFileRoute, redirect } from "@tanstack/react-router";
import { safeDestination } from "@/lib/backend-model";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => {
    const r = safeDestination(s["redirect"], "");
    return r ? { redirect: r } : {};
  },
  head: () => ({
    meta: [
      { title: "Account access · SchoolOS" },
      { name: "description", content: "Access your SchoolOS account securely." },
      { property: "og:title", content: "Account access · SchoolOS" },
      { property: "og:description", content: "Access your SchoolOS account securely." },
    ],
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/login", search });
  },
});
