import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/_console/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses · SchoolOS" },
      { name: "description", content: "Expenses in SchoolOS." },
      { property: "og:title", content: "Expenses · SchoolOS" },
      { property: "og:description", content: "Expenses in SchoolOS." },
    ],
  }),
  component: () => <ModulePage icon={Receipt} title="Expenses" description="This page's full design is coming next." planned={["Full Expenses layout"]} />,
});
