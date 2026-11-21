import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { IndoorAirScreen } from "@/features/indoor-air/indoor-air-screen";

export const Route = createFileRoute("/indoor-air")({
  component: IndoorAirRoute,
  head: () => ({
    meta: [
      { title: "Indoor Air Advice — BreatheWise" },
      {
        name: "description",
        content:
          "Explore practical ventilation, purifier, and indoor pollution source-control ideas for your home.",
      },
      { property: "og:title", content: "Indoor Air Advice — BreatheWise" },
      {
        property: "og:description",
        content:
          "Explore practical ventilation, purifier, and indoor pollution source-control ideas for your home.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function IndoorAirRoute() {
  return (
    <BreatheWiseAppShell>
      <IndoorAirScreen />
    </BreatheWiseAppShell>
  );
}
