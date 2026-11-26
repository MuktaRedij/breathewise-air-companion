import type {
  AirQualityData,
  AlertCategory,
  AlertPreferences,
  PollutionAlert,
} from "../types/air-quality.types";

export class AlertsService {
  /**
   * Evaluates current air quality and diurnal trajectory against user alert preferences.
   * Deduplicates alerts using an eventKey (`city-category-YYYY-MM-DD`).
   */
  public static evaluateAndMergeAlerts(
    airData: AirQualityData,
    prefs: AlertPreferences,
    existingAlerts: PollutionAlert[],
  ): { alerts: PollutionAlert[]; newlyTriggered: PollutionAlert[] } {
    const todayKey = new Date().toISOString().slice(0, 10);
    const candidates: Omit<PollutionAlert, "id" | "timestamp" | "read">[] = [];

    // 1. Threshold / Severity categories
    if (airData.aqi >= 301 && prefs.enableSevere) {
      candidates.push({
        eventKey: `${airData.id}-Severe-${todayKey}`,
        category: "Severe",
        title: `Severe Air Quality Alert in ${airData.city}`,
        message: `AQI has reached ${airData.aqi} (${airData.category}). Stay indoors, keep windows sealed, and run True HEPA filtration.`,
        city: airData.city,
        aqi: airData.aqi,
      });
    } else if (airData.aqi >= 201 && prefs.enableVeryPoor) {
      candidates.push({
        eventKey: `${airData.id}-VeryPoor-${todayKey}`,
        category: "Very Poor",
        title: `Very Poor Air Quality in ${airData.city}`,
        message: `AQI is ${airData.aqi} (${airData.category}). Avoid outdoor workouts and wear an N95/FFP2 mask outdoors.`,
        city: airData.city,
        aqi: airData.aqi,
      });
    } else if (airData.aqi >= prefs.thresholdAqi && prefs.enablePoor) {
      candidates.push({
        eventKey: `${airData.id}-Threshold-${prefs.thresholdAqi}-${todayKey}`,
        category: "Poor",
        title: `AQI Threshold (${prefs.thresholdAqi}) Exceeded in ${airData.city}`,
        message: `Current AQI is ${airData.aqi} (${airData.category}), crossing your configured alert threshold of ${prefs.thresholdAqi}.`,
        city: airData.city,
        aqi: airData.aqi,
      });
    }

    // 2. Sudden spike check across diurnal forecast
    if (prefs.enableSuddenSpike && airData.forecast.length > 0) {
      const peakForecast = Math.max(...airData.forecast.map((f) => f.aqi));
      if (peakForecast - airData.aqi >= 30) {
        candidates.push({
          eventKey: `${airData.id}-Spike-${todayKey}`,
          category: "Sudden Spike",
          title: `Projected Pollution Spike in ${airData.city}`,
          message: `Diurnal outlook projects AQI rising from ${airData.aqi} up to ${peakForecast} later today. Plan outdoor errands earlier.`,
          city: airData.city,
          aqi: peakForecast,
        });
      }
    }

    const existingKeys = new Set(existingAlerts.map((a) => a.eventKey));
    const newlyTriggered: PollutionAlert[] = candidates
      .filter((c) => !existingKeys.has(c.eventKey))
      .map((c) => ({
        ...c,
        id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        read: false,
      }));

    const merged = [...newlyTriggered, ...existingAlerts].slice(0, 30);
    return { alerts: merged, newlyTriggered };
  }

  public static buildDailyBriefing(airData: AirQualityData): {
    headline: string;
    summary: string;
    safestAction: string;
  } {
    const pm25 = airData.pollutants.find((p) => p.code === "pm25")?.value;
    const headline = `${airData.city} Daily Briefing · AQI ${airData.aqi} (${airData.category})`;
    const summary = `Dominant pollutant is ${airData.dominantPollutant}${pm25 ? ` (PM2.5: ${pm25} µg/m³)` : ""}. ${airData.healthSummary}`;
    const safestAction =
      airData.aqi > 150
        ? "Keep windows closed, run HEPA filtration, and wear an N95 mask for essential outdoor travel."
        : airData.aqi > 100
          ? "Sensitive groups should limit prolonged outdoor exertion; prefer midday ventilation."
          : "Conditions are favorable for outdoor walks and natural cross-ventilation.";

    return { headline, summary, safestAction };
  }

  public static getCategoryBadgeClass(category: AlertCategory): string {
    switch (category) {
      case "Severe":
        return "border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200";
      case "Very Poor":
        return "border-orange-400 bg-orange-100 text-orange-900 dark:border-orange-800 dark:bg-orange-950/60 dark:text-orange-200";
      case "Sudden Spike":
        return "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200";
      default:
        return "border-yellow-400 bg-yellow-100 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-200";
    }
  }
}
