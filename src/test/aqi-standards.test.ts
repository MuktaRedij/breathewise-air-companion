import { describe, expect, it } from "vitest";
import { getAqiLevel } from "../constants/aqi-standards";

describe("AQI Standards & Breakpoint Calculations", () => {
  describe("US EPA AQI Scale", () => {
    it("classifies 0 - 50 as Good", () => {
      expect(getAqiLevel(25, "US_EPA").name).toBe("Good");
      expect(getAqiLevel(50, "US_EPA").name).toBe("Good");
    });

    it("classifies 51 - 100 as Moderate", () => {
      expect(getAqiLevel(51, "US_EPA").name).toBe("Moderate");
      expect(getAqiLevel(85, "US_EPA").name).toBe("Moderate");
    });

    it("classifies 101 - 150 as Unhealthy for Sensitive Groups", () => {
      expect(getAqiLevel(120, "US_EPA").name).toBe("Unhealthy for Sensitive Groups");
    });

    it("classifies 151 - 200 as Unhealthy", () => {
      expect(getAqiLevel(175, "US_EPA").name).toBe("Unhealthy");
    });

    it("classifies 201 - 300 as Very Unhealthy", () => {
      expect(getAqiLevel(250, "US_EPA").name).toBe("Very Unhealthy");
    });

    it("classifies 301 - 500 as Hazardous", () => {
      expect(getAqiLevel(380, "US_EPA").name).toBe("Hazardous");
    });
  });

  describe("Indian CPCB National AQI (NAQI) Scale", () => {
    it("distinguishes CPCB Satisfactory (51 - 100) from EPA Moderate", () => {
      expect(getAqiLevel(75, "INDIA_CPCB").name).toBe("Satisfactory");
      expect(getAqiLevel(75, "US_EPA").name).toBe("Moderate");
    });

    it("classifies 101 - 200 as CPCB Moderate", () => {
      expect(getAqiLevel(150, "INDIA_CPCB").name).toBe("Moderate");
    });

    it("classifies 201 - 300 as CPCB Poor", () => {
      expect(getAqiLevel(284, "INDIA_CPCB").name).toBe("Poor");
    });

    it("classifies 301 - 400 as CPCB Very Poor", () => {
      expect(getAqiLevel(350, "INDIA_CPCB").name).toBe("Very Poor");
    });

    it("classifies 401 - 500 as CPCB Severe", () => {
      expect(getAqiLevel(440, "INDIA_CPCB").name).toBe("Severe");
    });
  });
});
