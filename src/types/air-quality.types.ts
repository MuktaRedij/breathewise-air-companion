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
