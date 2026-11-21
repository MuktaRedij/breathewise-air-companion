import { describe, expect, it } from "vitest";

import { estimateAvoidedCo2Kg } from "@/lib/impact-estimates";

describe("estimated commute impact", () => {
  it("estimates 8.7 kg avoided for 10 weekly 6 km one-way car-to-metro trips", () => {
    expect(estimateAvoidedCo2Kg("car", "metro", 6, 10)).toBeCloseTo(8.7);
  });

  it("does not report avoided emissions when the alternative is more polluting", () => {
    expect(estimateAvoidedCo2Kg("metro", "car", 6, 10)).toBe(0);
  });
});
