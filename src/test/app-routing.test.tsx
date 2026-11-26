import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("Comprehensive Application Route Matcher", () => {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
  });

  const routesToTest = [
    { path: "/", name: "Home Landing" },
    { path: "/dashboard", name: "Air Quality Dashboard" },
    { path: "/forecast", name: "AI Air Quality Forecast" },
    { path: "/map", name: "Pollution Map" },
    { path: "/exposure", name: "Personal Exposure Tracker" },
    { path: "/alerts", name: "Smart Pollution Alerts" },
    { path: "/routes", name: "Clean Route Navigator" },
    { path: "/planner", name: "Daily Air Planner" },
    { path: "/indoor-air", name: "Indoor Air Quality Advisor" },
    { path: "/travel", name: "Green Travel Advisor" },
    { path: "/impact", name: "Sustainability Impact Tracker" },
    { path: "/community", name: "Community Hub" },
  ];

  routesToTest.forEach(({ path, name }) => {
    it(`correctly resolves ${name} route at "${path}"`, () => {
      const matches = router.matchRoutes(path);
      expect(matches.length).toBeGreaterThan(0);
      const leafMatch = matches.at(-1);
      expect(leafMatch?.routeId).not.toBe(rootRouteId);
    });
  });

  it("handles non-existent routes by falling back to root/not-found", () => {
    const matches = router.matchRoutes("/random-nonexistent-path-123");
    const leafMatch = matches.at(-1);
    expect(leafMatch?.routeId).toBe(rootRouteId);
  });
});
