import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { CleanRoutesScreen } from "@/features/routes/clean-routes-screen";

export const Route = createFileRoute("/routes")({
  component: CleanRoutesRoute,
  head: () => ({
    meta: [
      { title: "Clean Route Navigator — BreatheWise" },
      {
        name: "description",
        content:
          "Compare walking and cycling corridors by distance, duration, and relative roadside pollution exposure.",
      },
    ],
  }),
});

function CleanRoutesRoute() {
  return (
    <BreatheWiseAppShell>
      <CleanRoutesScreen />
    </BreatheWiseAppShell>
  );
}
