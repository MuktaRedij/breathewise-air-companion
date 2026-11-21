export type UserLifestyleProfile = {
  occupation: string;
  commute: string;
  activity: string;
  household: string;
  preference: string;
  commuteDistanceKm?: number;
  hasAirPurifier?: boolean;
  hasSensitiveMembers?: boolean;
};

export type RoutineMoment = {
  time: "Morning" | "Afternoon" | "Evening";
  title: string;
  action: string;
  why: string;
  personalExposureDefense: string;
  ecologicalBenefit: string;
  safetyRating: "Safe" | "Caution" | "Avoid Outdoor";
};

export type DailyRoutinePlan = {
  city: string;
  aqi: number;
  aqiStandard: string;
  category: string;
  generatedAt: string;
  isAiGenerated: boolean;
  moments: RoutineMoment[];
  overallGuidance: string;
};

export type IndoorRecommendation = {
  sourceId: string;
  title: string;
  recommendation: string;
  scientificReason: string;
  appliesToSensitive: boolean;
  requiresFiltration: boolean;
  priority: "High" | "Medium" | "Low";
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
  isAi?: boolean;
  contextApplied?: {
    city: string;
    aqi: number;
    category: string;
  };
};
