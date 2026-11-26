import { describe, expect, it } from "vitest";
import { AirQualityService } from "../services/air-quality.service";
import { CITIES_CATALOG } from "../constants/cities";

describe("AirQualityService Evaluation Suite", () => {
  it("resolves air quality for Delhi with Indian CPCB NAQI standard by default", async () => {
    const data = await AirQualityService.getAirQuality("delhi");
    expect(data.city).toContain("Delhi");
    expect(data.country).toBe("India");
    expect(data.standard).toBe("INDIA_CPCB");
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.dominantPollutant).toBeDefined();

    const pm25 = data.pollutants.find((p) => p.code === "pm25");
    const pm10 = data.pollutants.find((p) => p.code === "pm10");
    const no2 = data.pollutants.find((p) => p.code === "no2");
    const o3 = data.pollutants.find((p) => p.code === "o3");
    const co = data.pollutants.find((p) => p.code === "co");

    expect(pm25).toBeDefined();
    expect(pm25?.unit).toBe("µg/m³");
    expect(pm10).toBeDefined();
    expect(pm10?.unit).toBe("µg/m³");
    expect(no2).toBeDefined();
    expect(no2?.unit).toBe("ppb");
    expect(o3).toBeDefined();
    expect(o3?.unit).toBe("ppb");
    expect(co).toBeDefined();
    expect(co?.unit).toBe("ppm");
  });

  it("resolves air quality for New York with US EPA AQI standard by default", async () => {
    const data = await AirQualityService.getAirQuality("new-york");
    expect(data.city).toBe("New York");
    expect(data.country).toBe("United States");
    expect(data.standard).toBe("US_EPA");
    expect(data.aqi).toBeLessThanOrEqual(500);
  });

  it("allows overriding standard dynamically (e.g. evaluating Delhi using US EPA scale)", async () => {
    const data = await AirQualityService.getAirQuality("delhi", "US_EPA");
    expect(data.city).toContain("Delhi");
    expect(data.standard).toBe("US_EPA");
  });

  it("searches city catalog reliably by city name, country, and case-insensitively", () => {
    const delhiSearch = AirQualityService.searchCities("delhi");
    expect(delhiSearch.length).toBeGreaterThanOrEqual(1);
    expect(delhiSearch[0]?.id).toBe("delhi");

    const indiaSearch = AirQualityService.searchCities("india");
    expect(indiaSearch.length).toBeGreaterThanOrEqual(6); // Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad

    const emptySearch = AirQualityService.searchCities("");
    expect(emptySearch.length).toBe(CITIES_CATALOG.length);
  });

  it("handles unknown city gracefully by returning fallback metro with valid data", async () => {
    const data = await AirQualityService.getAirQuality("unknown-city-xyz");
    expect(data).toBeDefined();
    expect(data.aqi).toBeGreaterThan(0);
    expect(data.category).toBeDefined();
  });
});
