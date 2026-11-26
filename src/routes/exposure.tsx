import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { ExposureScreen } from "@/features/exposure/exposure-screen";

export const Route = createFileRoute("/exposure")({
  component: ExposureRoute,
  head: () => ({
    meta: [
      { title: "Personal Exposure Tracker — BreatheWise" },
      {
        name: "description",
        content:
          "Estimate your relative daily pollution exposure from ambient AQI, outdoor activity duration, and commute mode.",
      },
    ],
  }),
});

function ExposureRoute() {
  return (
    <BreatheWiseAppShell>
      <ExposureScreen />
    </BreatheWiseAppShell>
  );
}
