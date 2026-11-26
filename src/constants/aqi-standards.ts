import type { AqiCategoryTier, AqiStandard, PollutantCode } from "../types/air-quality.types";

export type AqiScaleLevel = {
  name: AqiCategoryTier;
  min: number;
  max: number;
  colorClass: string;
  bgClass: string;
  badgeClass: string;
  description: string;
  healthAdvice: string;
  outdoorExerciseAdvice: string;
};

// -----------------------------------------------------------------------------
// US EPA AQI Standard (6 Categories, 0 - 500)
// -----------------------------------------------------------------------------
export const US_EPA_LEVELS: AqiScaleLevel[] = [
  {
    name: "Good",
    min: 0,
    max: 50,
    colorClass: "text-emerald-700 dark:text-emerald-400",
    bgClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
    description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    healthAdvice: "Great day to enjoy outdoor activities.",
    outdoorExerciseAdvice: "Fully safe for outdoor jogging, workouts, and recreation.",
  },
  {
    name: "Moderate",
    min: 51,
    max: 100,
    colorClass: "text-amber-700 dark:text-amber-400",
    bgClass: "bg-amber-500",
    badgeClass:
      "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
    description:
      "Air quality is acceptable; some pollutants may pose a moderate concern for sensitive individuals.",
    healthAdvice:
      "Unusually sensitive individuals should consider reducing prolonged heavy outdoor exertion.",
    outdoorExerciseAdvice:
      "Safe for most people; sensitive individuals should monitor respiratory symptoms.",
  },
  {
    name: "Unhealthy for Sensitive Groups",
    min: 101,
    max: 150,
    colorClass: "text-orange-700 dark:text-orange-400",
    bgClass: "bg-orange-500",
    badgeClass:
      "bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 border-orange-300",
    description:
      "Members of sensitive groups (asthma, children, elderly) may experience health effects.",
    healthAdvice:
      "Children, older adults, and individuals with heart/lung disease should limit prolonged outdoor exertion.",
    outdoorExerciseAdvice:
      "Sensitive groups should move intense cardio workouts indoors or postpone.",
  },
  {
    name: "Unhealthy",
    min: 151,
    max: 200,
    colorClass: "text-rose-700 dark:text-rose-400",
    bgClass: "bg-rose-500",
    badgeClass: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300",
    description:
      "Some members of the general public may experience health effects; sensitive groups more serious effects.",
    healthAdvice:
      "Everyone should reduce heavy outdoor exertion. Keep windows closed and run air filters.",
    outdoorExerciseAdvice: "Avoid strenuous outdoor jogging. Exercise indoors in filtered spaces.",
  },
  {
    name: "Very Unhealthy",
    min: 201,
    max: 300,
    colorClass: "text-purple-700 dark:text-purple-400",
    bgClass: "bg-purple-600",
    badgeClass:
      "bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-300",
    description: "Health alert: The risk of health effects is increased for everyone.",
    healthAdvice:
      "Avoid all outdoor physical activities. Wear an N95 respirator if stepping outside.",
    outdoorExerciseAdvice:
      "Outdoor exercise strictly discouraged. Wear protective filtration outdoors.",
  },
  {
    name: "Hazardous",
    min: 301,
    max: 500,
    colorClass: "text-red-900 dark:text-red-300",
    bgClass: "bg-red-800",
    badgeClass: "bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-200 border-red-500",
    description: "Emergency health warning: Entire population is likely to be affected.",
    healthAdvice:
      "Remain indoors with clean air filtration. Seal doors/windows and avoid creating indoor particulate.",
    outdoorExerciseAdvice: "Do not exercise outdoors under any circumstances.",
  },
];

// -----------------------------------------------------------------------------
// Indian CPCB National AQI (NAQI) Standard (6 Categories, 0 - 500)
// -----------------------------------------------------------------------------
export const INDIA_CPCB_LEVELS: AqiScaleLevel[] = [
  {
    name: "Good",
    min: 0,
    max: 50,
    colorClass: "text-emerald-700 dark:text-emerald-400",
    bgClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
    description: "Minimal health impact. Clean environmental conditions.",
    healthAdvice: "Clean and safe air for the entire community.",
    outdoorExerciseAdvice: "Optimal for all outdoor sports and morning jogs.",
  },
  {
    name: "Satisfactory",
    min: 51,
    max: 100,
    colorClass: "text-teal-700 dark:text-teal-400",
    bgClass: "bg-teal-500",
    badgeClass: "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border-teal-300",
    description: "Minor breathing discomfort to sensitive people.",
    healthAdvice: "Generally safe. Sensitive individuals should observe minor symptoms.",
    outdoorExerciseAdvice: "Normal outdoor activities can proceed without restriction.",
  },
  {
    name: "Moderate",
    min: 101,
    max: 200,
    colorClass: "text-amber-700 dark:text-amber-400",
    bgClass: "bg-amber-500",
    badgeClass:
      "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
    description: "Breathing discomfort to the people with lungs, asthma and heart diseases.",
    healthAdvice:
      "People with existing respiratory conditions should minimize prolonged outdoor exposure.",
    outdoorExerciseAdvice:
      "Moderate outdoor activities; sensitive individuals should exercise indoors.",
  },
  {
    name: "Poor",
    min: 201,
    max: 300,
    colorClass: "text-orange-700 dark:text-orange-400",
    bgClass: "bg-orange-500",
    badgeClass:
      "bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300 border-orange-300",
    description: "Breathing discomfort to most people on prolonged exposure.",
    healthAdvice: "Wear N95/FFP2 masks outdoors; run HEPA air filtration indoors.",
    outdoorExerciseAdvice: "Avoid morning jogs along vehicular corridors; move workouts indoors.",
  },
  {
    name: "Very Poor",
    min: 301,
    max: 400,
    colorClass: "text-rose-700 dark:text-rose-400",
    bgClass: "bg-rose-600",
    badgeClass: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-400",
    description:
      "Respiratory illness on prolonged exposure. Pronounced effect on people with lung and heart diseases.",
    healthAdvice: "Avoid stepping out without high-grade mask. Keep windows closed tightly.",
    outdoorExerciseAdvice: "Strictly avoid outdoor running or strenuous activities.",
  },
  {
    name: "Severe",
    min: 401,
    max: 500,
    colorClass: "text-red-950 dark:text-red-300",
    bgClass: "bg-red-800",
    badgeClass: "bg-red-100 text-red-950 dark:bg-red-950 dark:text-red-200 border-red-500",
    description: "Affects healthy people and seriously impacts those with existing diseases.",
    healthAdvice: "Emergency clean air protocols. Stay indoors, run air purifiers continuously.",
    outdoorExerciseAdvice: "Emergency outdoor restrictions in place. No outdoor exertion.",
  },
];

export function getLevelsForStandard(standard: AqiStandard): AqiScaleLevel[] {
  return standard === "INDIA_CPCB" ? INDIA_CPCB_LEVELS : US_EPA_LEVELS;
}

export function getAqiLevel(aqi: number, standard: AqiStandard = "US_EPA"): AqiScaleLevel {
  const levels = getLevelsForStandard(standard);
  const clamped = Math.max(0, Math.min(500, Math.round(aqi)));
  const match = levels.find((lvl) => clamped >= lvl.min && clamped <= lvl.max);
  return match ?? (levels[levels.length - 1] as AqiScaleLevel);
}

export const POLLUTANT_METADATA: Record<
  PollutantCode,
  { name: string; unit: string; description: string; epaStandardUnit: string }
> = {
  pm25: {
    name: "Fine Particulate Matter (PM2.5)",
    unit: "µg/m³",
    description:
      "Microscopic inhalable particles <= 2.5 micrometers that penetrate deep into the lungs and bloodstream.",
    epaStandardUnit: "µg/m³",
  },
  pm10: {
    name: "Coarse Particulate Matter (PM10)",
    unit: "µg/m³",
    description:
      "Inhalable dust, pollen, and mold particles <= 10 micrometers that irritate eyes and upper airways.",
    epaStandardUnit: "µg/m³",
  },
  o3: {
    name: "Ground-Level Ozone (O₃)",
    unit: "ppb",
    description:
      "Secondary pollutant formed by sunlight reacting with vehicle emissions and industrial fumes.",
    epaStandardUnit: "ppb",
  },
  no2: {
    name: "Nitrogen Dioxide (NO₂)",
    unit: "ppb",
    description:
      "Combustion gas from vehicular exhaust and thermal power plants, causing airway inflammation.",
    epaStandardUnit: "ppb",
  },
  so2: {
    name: "Sulfur Dioxide (SO₂)",
    unit: "ppb",
    description:
      "Pungent gas emitted from fossil fuel combustion at power plants and industrial facilities.",
    epaStandardUnit: "ppb",
  },
  co: {
    name: "Carbon Monoxide (CO)",
    unit: "ppm",
    description:
      "Colorless, odorless gas emitted by combustion engines that reduces oxygen delivery in blood.",
    epaStandardUnit: "ppm",
  },
};
