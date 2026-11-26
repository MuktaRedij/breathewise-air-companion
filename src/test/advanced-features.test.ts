import { describe, expect, it } from "vitest";

import { AirQualityService } from "../services/air-quality.service";
import { AiService } from "../services/ai.service";
import { AlertsService } from "../services/alerts.service";
import { ExposureService } from "../services/exposure.service";
import { RoutesService } from "../services/routes.service";
import { StorageService } from "../services/storage.service";

describe("BreatheWise Advanced Intelligence Features", () => {
  it("generates 24-hour forecast with explicit measured vs predicted distinction and null 48-72h when API key missing", async () => {
    const forecast = await AirQualityService.getForecast("delhi", "INDIA_CPCB");
    expect(forecast.hourly24).toHaveLength(24);
    expect(forecast.isLiveForecast).toBe(false);
    expect(forecast.outlook48_72).toBeNull();
    expect(forecast.unavailableReason).toBeTruthy();
    expect(forecast.safestWindow).toBeTruthy();
  });

  it("calculates relative personal exposure score with factors and band", async () => {
    const airData = await AirQualityService.getAirQuality("delhi", "INDIA_CPCB");
    const entry = ExposureService.calculateExposure({
      airData,
      activityType: "vigorous",
      commuteMode: "walk",
      outdoorMinutes: 45,
      commuteMinutes: 30,
    });
    expect(entry.estimatedScore).toBeGreaterThan(0);
    expect(entry.estimatedScore).toBeLessThanOrEqual(100);
    expect(entry.factors.length).toBeGreaterThanOrEqual(4);
    expect(entry.city).toContain("Delhi");
  });

  it("evaluates pollution alerts and deduplicates identical events on the same day", async () => {
    const airData = await AirQualityService.getAirQuality("delhi", "INDIA_CPCB");
    const prefs = StorageService.getAlertPreferences("delhi");

    const first = AlertsService.evaluateAndMergeAlerts(airData, prefs, []);
    expect(first.newlyTriggered.length).toBeGreaterThan(0);

    const second = AlertsService.evaluateAndMergeAlerts(airData, prefs, first.alerts);
    expect(second.newlyTriggered).toHaveLength(0);
    expect(second.alerts.length).toBe(first.alerts.length);
  });

  it("compares clean routes and handles unavailable pollution data gracefully", async () => {
    const airData = await AirQualityService.getAirQuality("delhi", "INDIA_CPCB");
    const withData = RoutesService.compareCleanRoutes({
      origin: "Connaught Place",
      destination: "Lodhi Gardens",
      mode: "walk",
      airData,
    });
    expect(withData.routes).toHaveLength(3);
    expect(withData.routes[0]?.isRecommended).toBe(true);
    expect(withData.routes[0]?.tailpipeCo2Grams).toBe(0);

    const withoutData = RoutesService.compareCleanRoutes({
      origin: "Connaught Place",
      destination: "Lodhi Gardens",
      mode: "cycle",
      airData: null,
    });
    expect(withoutData.routes[0]?.relativeExposureLabel).toBe("Unavailable");
    expect(withoutData.routes[0]?.estimatedExposureScore).toBeNull();
    expect(withoutData.limitationNotice).toContain("unavailable");
  });

  it("answers forecast, exposure, alert, and clean route questions in AI Assistant", async () => {
    const airData = await AirQualityService.getAirQuality("delhi", "INDIA_CPCB");
    const profile = StorageService.getUserProfile();

    const forecastReply = await AiService.generateChatResponse(
      "What is the air quality forecast?",
      airData,
      profile,
    );
    expect(forecastReply).toContain("Forecast");

    const routeReply = await AiService.generateChatResponse(
      "Recommend a clean walking route",
      airData,
      profile,
    );
    expect(routeReply).toContain("Clean Route");

    const alertReply = await AiService.generateChatResponse(
      "How do I configure pollution alerts?",
      airData,
      profile,
    );
    expect(alertReply).toContain("Alerts");
  });
});
