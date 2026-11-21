import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { ImpactScreen } from "@/features/impact/impact-screen";

export const Route = createFileRoute("/impact")({
  component: ImpactRoute,
  head: () => ({
    meta: [
      { title: "Sustainability Impact — BreatheWise" },
      { name: "description", content: "Log sustainable commute actions and follow clearly labeled, assumption-based emissions estimates." },
      { property: "og:title", content: "Sustainability Impact — BreatheWise" },
      { property: "og:description", content: "Log sustainable commute actions and follow clearly labeled, assumption-based emissions estimates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ImpactRoute() {
  return <BreatheWiseAppShell><ImpactScreen /></BreatheWiseAppShell>;
}