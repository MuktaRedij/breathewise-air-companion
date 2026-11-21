import { createFileRoute } from "@tanstack/react-router";

import { HomeScreen } from "@/features/home/home-screen";

export const Route = createFileRoute("/")({
  component: HomeScreen,
  head: () => ({
    meta: [
      { title: "BreatheWise — Breathe better, live smarter" },
      { name: "description", content: "Air-quality insights, practical daily choices, and neighborhood action for cleaner communities." },
      { property: "og:title", content: "BreatheWise — Breathe better, live smarter" },
      { property: "og:description", content: "Air-quality insights, practical daily choices, and neighborhood action for cleaner communities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
