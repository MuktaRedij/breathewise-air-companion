export const estimatedGramsPerKm = {
  walk: 0,
  cycle: 0,
  transit: 90,
  metro: 35,
  carpool: 95,
  car: 180,
} as const;

export type TravelMode = keyof typeof estimatedGramsPerKm;

export function estimateAvoidedCo2Kg(
  from: TravelMode,
  to: TravelMode,
  oneWayKm: number,
  oneWayTripsPerWeek: number,
): number {
  const distance = Number.isFinite(oneWayKm) ? Math.max(0, oneWayKm) : 0;
  const trips = Number.isFinite(oneWayTripsPerWeek) ? Math.max(0, oneWayTripsPerWeek) : 0;
  const gramsSaved = (estimatedGramsPerKm[from] - estimatedGramsPerKm[to]) * distance * trips;
  return Math.max(0, gramsSaved / 1000);
}