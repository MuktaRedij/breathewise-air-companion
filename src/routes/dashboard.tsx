import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { AirQualityDashboardScreen } from "@/features/air-quality/dashboard-screen";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
  head: () => ({
    meta: [
      { title: "Air Quality Dashboard — BreatheWise" },
      {
        name: "description",
        content:
          "Review sample air-quality readings, pollutant levels, forecasts, and practical daily actions in BreatheWise.",
      },
      { property: "og:title", content: "Air Quality Dashboard — BreatheWise" },
      {
        property: "og:description",
        content:
          "Review sample air-quality readings, pollutant levels, forecasts, and practical daily actions in BreatheWise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function DashboardRoute() {
  return (
    <BreatheWiseAppShell>
      <AirQualityDashboardScreen />
    </BreatheWiseAppShell>
  );
}
