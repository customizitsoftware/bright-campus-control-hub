import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { ModulePage } from "@/components/common/module-page";

export const Route = createFileRoute("/_console/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable · SchoolOS" },
      { name: "description", content: "Timetable in SchoolOS." },
      { property: "og:title", content: "Timetable · SchoolOS" },
      { property: "og:description", content: "Timetable in SchoolOS." },
    ],
  }),
  component: () => <ModulePage icon={CalendarClock} title="Timetable" description="This page's full design is coming next." planned={["Full Timetable layout"]} />,
});
