export type AqiStandard = "US_EPA" | "INDIA_CPCB";

export type PollutantCode = "pm25" | "pm10" | "o3" | "no2" | "so2" | "co";

export type AqiCategoryTier =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Unhealthy for Sensitive Groups"
  | "Unhealthy"
  | "Very Poor"
  | "Very Unhealthy"
  | "Severe"
  | "Hazardous";

export type PollutantReading = {
  name: string;
  code: PollutantCode;
  value: number;
  unit: string;
  category: string;
  healthImpact: string;
};

export type TrendPoint = {
  label: string;
  aqi: number;
  category?: string;
};

export type ForecastPeriod = {
  period: string;
  aqi: number;
  category: string;
  note: string;
};

export type HourlyForecastPoint = {
  hourOffset: number;
  label: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  isMeasured: boolean;
};

export type MultiDayOutlook = {
  day: string;
  minAqi: number;
  maxAqi: number;
  summary: string;
};

export type AirQualityForecast = {
  city: string;
  standard: AqiStandard;
  isLiveForecast: boolean;
  dataSource: string;
  generatedAt: string;
  trendDirection: "improving" | "deteriorating" | "stable";
  safestWindow: string;
  aiExplanation: string;
  isAiGenerated: boolean;
  hourly24: HourlyForecastPoint[];
  outlook48_72: MultiDayOutlook[] | null;
  unavailableReason?: string;
};

export type ExposureEntry = {
  id: string;
  date: string;
  city: string;
  activityType: "light" | "moderate" | "vigorous";
  commuteMode: "walk" | "cycle" | "transit" | "metro" | "carpool" | "car";
  outdoorMinutes: number;
  commuteMinutes: number;
  aqiAtTime: number;
  pm25AtTime: number;
  estimatedScore: number;
  exposureBand: "Low" | "Moderate" | "Elevated" | "High";
  factors: string[];
  timestamp: string;
};

export type AlertCategory = "Poor" | "Very Poor" | "Severe" | "Sudden Spike";

export type AlertPreferences = {
  thresholdAqi: number;
  preferredCityId: string;
  enablePoor: boolean;
  enableVeryPoor: boolean;
  enableSevere: boolean;
  enableSuddenSpike: boolean;
  browserNotificationsEnabled: boolean;
};

export type PollutionAlert = {
  id: string;
  eventKey: string;
  category: AlertCategory;
  title: string;
  message: string;
  city: string;
  aqi: number;
  timestamp: string;
  read: boolean;
};

export type CleanRouteOption = {
  id: string;
  name: string;
  corridorType: "greenway" | "mixed" | "arterial";
  mode: "walk" | "cycle";
  distanceKm: number;
  durationMin: number;
  relativeExposureLabel: "Lower" | "Moderate" | "Higher" | "Unavailable";
  estimatedExposureScore: number | null;
  tailpipeCo2Grams: number;
  explanation: string;
  isRecommended: boolean;
  hasPollutionContext: boolean;
};

export type AirQualityData = {
  id: string;
  city: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  aqi: number;
  standard: AqiStandard;
  category: AqiCategoryTier;
  categoryColor: string;
  pollutants: PollutantReading[];
  hourly: TrendPoint[];
  weekly: TrendPoint[];
  forecast: ForecastPeriod[];
  lastUpdated: string;
  isLive: boolean;
  dataSource: string;
  dominantPollutant: string;
  healthSummary: string;
  sensitiveGroupNotice: string;
};

export type CityCatalogItem = {
  id: string;
  city: string;
  region: string;
  country: string;
  defaultStandard: AqiStandard;
  coordinates: {
    lat: number;
    lng: number;
  };
  baseAqi: number;
  pollutants: Record<PollutantCode, number>;
};
