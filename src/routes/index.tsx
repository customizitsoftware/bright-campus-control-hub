import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SchoolOS — School operating system for Africa" },
      { name: "description", content: "SchoolOS helps nursery, primary and secondary schools run admissions, academics, fees and communication." },
      { property: "og:title", content: "SchoolOS — School operating system for Africa" },
      { property: "og:description", content: "Multi-tenant school management for Nigerian and African schools." },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
