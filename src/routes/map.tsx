import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { PollutionMapScreen } from "@/features/map/pollution-map-screen";

export const Route = createFileRoute("/map")({
  component: PollutionMapRoute,
  head: () => ({
    meta: [
      { title: "Pollution Map — BreatheWise" },
      {
        name: "description",
        content:
          "Explore color-coded air-quality monitoring locations, AQI categories, and pollutant readings.",
      },
    ],
  }),
});

function PollutionMapRoute() {
  return (
    <BreatheWiseAppShell>
      <PollutionMapScreen />
    </BreatheWiseAppShell>
  );
}
