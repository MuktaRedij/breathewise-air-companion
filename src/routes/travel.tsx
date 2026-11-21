import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { TravelScreen } from "@/features/travel/travel-screen";

export const Route = createFileRoute("/travel")({
  component: TravelRoute,
  head: () => ({
    meta: [
      { title: "Green Travel Advisor — BreatheWise" },
      {
        name: "description",
        content:
          "Compare walking, cycling, public transit, metro, carpooling, and driving with transparent emissions estimates.",
      },
      { property: "og:title", content: "Green Travel Advisor — BreatheWise" },
      {
        property: "og:description",
        content:
          "Compare walking, cycling, public transit, metro, carpooling, and driving with transparent emissions estimates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function TravelRoute() {
  return (
    <BreatheWiseAppShell>
      <TravelScreen />
    </BreatheWiseAppShell>
  );
}
