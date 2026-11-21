import { describe, expect, it } from "vitest";
import { StorageService } from "../services/storage.service";

describe("Storage Service & Persistence", () => {
  it("provides valid default profile when storage is empty", () => {
    const profile = StorageService.getUserProfile();
    expect(profile.occupation).toBeDefined();
    expect(profile.commute).toBeDefined();
    expect(profile.household).toBeDefined();
  });

  it("persists and retrieves logged impact actions", () => {
    const updated = StorageService.logImpactAction({
      actionId: "test-metro-shift",
      title: "Test 6 km Metro Shift",
      avoidedKg: 0.87,
    });

    expect(updated.length).toBeGreaterThanOrEqual(1);
    expect(updated[0].avoidedKg).toBe(0.87);

    const retrieved = StorageService.getLoggedActions();
    expect(retrieved.some((a) => a.actionId === "test-metro-shift")).toBe(true);
  });
});
