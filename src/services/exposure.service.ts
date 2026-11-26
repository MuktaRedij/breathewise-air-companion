import type { AirQualityData, ExposureEntry } from "../types/air-quality.types";

const ACTIVITY_VENTILATION_MULTIPLIER: Record<ExposureEntry["activityType"], number> = {
  light: 1.0, // Resting / light stroll (~8 L/min)
  moderate: 1.8, // Brisk walk (~15 L/min)
  vigorous: 3.2, // Jogging / cycling (~26+ L/min)
};

const COMMUTE_SHIELDING_FACTOR: Record<ExposureEntry["commuteMode"], number> = {
  walk: 1.15, // Roadside proximity
  cycle: 1.25, // Roadside + elevated ventilation
  transit: 0.85, // Bus shelter + cabin
  metro: 0.45, // Enclosed filtered rail
  carpool: 0.55, // Cabin recirculation
  car: 0.55, // Cabin recirculation
};

export class ExposureService {
  /**
   * Computes a transparent relative daily exposure estimate (0-100 scale)
   * from ambient AQI/PM2.5, outdoor duration, activity intensity, and commute mode.
   * NOTE: This is an informational estimate, NOT a medical diagnosis or personal dosimeter reading.
   */
  public static calculateExposure(params: {
    airData: AirQualityData;
    activityType: ExposureEntry["activityType"];
    commuteMode: ExposureEntry["commuteMode"];
    outdoorMinutes: number;
    commuteMinutes: number;
  }): ExposureEntry {
    const pm25Reading = params.airData.pollutants.find((p) => p.code === "pm25");
    const pm25 = pm25Reading ? pm25Reading.value : Math.round(params.airData.aqi * 0.45);

    const safeOutdoorMin = Math.max(0, Math.min(720, params.outdoorMinutes));
    const safeCommuteMin = Math.max(0, Math.min(360, params.commuteMinutes));

    const activityMult = ACTIVITY_VENTILATION_MULTIPLIER[params.activityType];
    const commuteMult = COMMUTE_SHIELDING_FACTOR[params.commuteMode];

    // Normalized relative dose index combining outdoor duration + commute shielding
    const outdoorHours = safeOutdoorMin / 60;
    const commuteHours = safeCommuteMin / 60;
    const ambientRatio = params.airData.aqi / 100; // 1.0 at AQI 100

    const rawScore =
      ambientRatio * (outdoorHours * activityMult * 14 + commuteHours * commuteMult * 12);
    const estimatedScore = Math.max(1, Math.min(100, Math.round(rawScore)));

    const exposureBand: ExposureEntry["exposureBand"] =
      estimatedScore <= 25
        ? "Low"
        : estimatedScore <= 50
          ? "Moderate"
          : estimatedScore <= 75
            ? "Elevated"
            : "High";

    const factors: string[] = [
      `Ambient AQI ${params.airData.aqi} (${params.airData.category}) in ${params.airData.city}`,
      `PM2.5 concentration: ${pm25} µg/m³`,
      `${safeOutdoorMin} min outdoor (${params.activityType} exertion, ${activityMult}× breathing multiplier)`,
      `${safeCommuteMin} min commute via ${params.commuteMode} (${commuteMult}× roadside factor)`,
    ];

    const today = new Date().toISOString().slice(0, 10);
    return {
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: today,
      city: params.airData.city,
      activityType: params.activityType,
      commuteMode: params.commuteMode,
      outdoorMinutes: safeOutdoorMin,
      commuteMinutes: safeCommuteMin,
      aqiAtTime: params.airData.aqi,
      pm25AtTime: pm25,
      estimatedScore,
      exposureBand,
      factors,
      timestamp: new Date().toISOString(),
    };
  }

  public static getReductionTips(entry: ExposureEntry): string[] {
    const tips: string[] = [];
    if (entry.aqiAtTime > 150 && entry.activityType === "vigorous") {
      tips.push(
        "Shift vigorous cardio indoors with True HEPA filtration when AQI exceeds 150 to avoid high-volume particulate inhalation.",
      );
    }
    if (entry.commuteMode === "walk" || entry.commuteMode === "cycle") {
      tips.push(
        "Use side streets at least 50–100m away from heavy arterial traffic corridors, or wear a fitted N95 mask on high-AQI days.",
      );
    }
    if (entry.commuteMode === "car" || entry.commuteMode === "carpool") {
      tips.push("Keep vehicle HVAC set to Cabin Recirculation to block direct tailpipe intake.");
    }
    if (tips.length === 0) {
      tips.push(
        "Your current activity timing and commute mode keep relative exposure well controlled. Continue monitoring hourly AQI shifts.",
      );
    }
    return tips;
  }
}
