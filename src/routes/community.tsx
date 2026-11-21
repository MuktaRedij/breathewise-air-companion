import { createFileRoute } from "@tanstack/react-router";

import { BreatheWiseAppShell } from "@/components/breathewise-app-shell";
import { CommunityScreen } from "@/features/community/community-screen";

export const Route = createFileRoute("/community")({
  component: CommunityRoute,
  head: () => ({
    meta: [
      { title: "Community Hub — BreatheWise" },
      { name: "description", content: "Explore sample neighborhood air-quality observations and preview community clean-air challenges." },
      { property: "og:title", content: "Community Hub — BreatheWise" },
      { property: "og:description", content: "Explore sample neighborhood air-quality observations and preview community clean-air challenges." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function CommunityRoute() {
  return <BreatheWiseAppShell><CommunityScreen /></BreatheWiseAppShell>;
}