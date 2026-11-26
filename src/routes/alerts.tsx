import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { AlertsScreen } from "@/features/alerts/alerts-screen";

export const Route = createFileRoute("/alerts")({
  component: AlertsRoute,
  head: () => ({
    meta: [
      { title: "Pollution Alerts — BreatheWise" },
      {
        name: "description",
        content:
          "Configure custom AQI thresholds, review air-quality alerts, and read your daily briefing.",
      },
    ],
  }),
});

function AlertsRoute() {
  return (
    <BreatheWiseAppShell>
      <AlertsScreen />
    </BreatheWiseAppShell>
  );
}
