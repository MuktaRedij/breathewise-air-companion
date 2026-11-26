import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { ForecastScreen } from "@/features/forecast/forecast-screen";

export const Route = createFileRoute("/forecast")({
  component: ForecastRoute,
  head: () => ({
    meta: [
      { title: "AI Air Quality Forecast — BreatheWise" },
      {
        name: "description",
        content:
          "Inspect 24-hour hourly air-quality forecasts, predicted pollutant shifts, and safest outdoor windows.",
      },
    ],
  }),
});

function ForecastRoute() {
  return (
    <BreatheWiseAppShell>
      <ForecastScreen />
    </BreatheWiseAppShell>
  );
}
