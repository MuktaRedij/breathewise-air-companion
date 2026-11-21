import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { PlannerScreen } from "@/features/planner/planner-screen";

export const Route = createFileRoute("/planner")({
  component: PlannerRoute,
  head: () => ({
    meta: [
      { title: "Daily Air Planner — BreatheWise" },
      {
        name: "description",
        content:
          "Shape a practical daily routine around your commute, activity, household, and air-quality context.",
      },
      { property: "og:title", content: "Daily Air Planner — BreatheWise" },
      {
        property: "og:description",
        content:
          "Shape a practical daily routine around your commute, activity, household, and air-quality context.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function PlannerRoute() {
  return (
    <BreatheWiseAppShell>
      <PlannerScreen />
    </BreatheWiseAppShell>
  );
}
