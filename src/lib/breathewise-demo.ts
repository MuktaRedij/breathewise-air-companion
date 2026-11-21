export type CityKey = "portland" | "seattle" | "san-francisco" | "new-york";

export type TrendPoint = {
  label: string;
  aqi: number;
};

export type DemoAirQuality = {
  city: string;
  region: string;
  aqi: number;
  pollutants: { name: string; value: string; unit: string }[];
  hourly: TrendPoint[];
  weekly: TrendPoint[];
  forecast: { period: string; aqi: number; note: string }[];
};

export const demoAirQuality: Record<CityKey, DemoAirQuality> = {
  portland: {
    city: "Portland",
    region: "Oregon",
    aqi: 42,
    pollutants: [
      { name: "PM2.5", value: "7.2", unit: "µg/m³" },
      { name: "PM10", value: "12", unit: "µg/m³" },
      { name: "Ozone", value: "31", unit: "ppb" },
      { name: "Nitrogen dioxide", value: "11", unit: "ppb" },
    ],
    hourly: [
      { label: "6 AM", aqi: 34 },
      { label: "8 AM", aqi: 38 },
      { label: "10 AM", aqi: 44 },
      { label: "12 PM", aqi: 48 },
      { label: "2 PM", aqi: 42 },
      { label: "4 PM", aqi: 39 },
      { label: "6 PM", aqi: 36 },
    ],
    weekly: [
      { label: "Mon", aqi: 48 },
      { label: "Tue", aqi: 42 },
      { label: "Wed", aqi: 37 },
      { label: "Thu", aqi: 45 },
      { label: "Fri", aqi: 40 },
      { label: "Sat", aqi: 34 },
      { label: "Sun", aqi: 39 },
    ],
    forecast: [
      { period: "Morning", aqi: 38, note: "Fresh, low-pollution window" },
      { period: "Afternoon", aqi: 48, note: "Slightly higher near traffic" },
      { period: "Evening", aqi: 36, note: "Conditions ease" },
    ],
  },
  seattle: {
    city: "Seattle",
    region: "Washington",
    aqi: 28,
    pollutants: [
      { name: "PM2.5", value: "4.8", unit: "µg/m³" },
      { name: "PM10", value: "9", unit: "µg/m³" },
      { name: "Ozone", value: "24", unit: "ppb" },
      { name: "Nitrogen dioxide", value: "8", unit: "ppb" },
    ],
    hourly: [
      { label: "6 AM", aqi: 24 },
      { label: "8 AM", aqi: 28 },
      { label: "10 AM", aqi: 32 },
      { label: "12 PM", aqi: 35 },
      { label: "2 PM", aqi: 29 },
      { label: "4 PM", aqi: 26 },
      { label: "6 PM", aqi: 23 },
    ],
    weekly: [
      { label: "Mon", aqi: 33 },
      { label: "Tue", aqi: 28 },
      { label: "Wed", aqi: 25 },
      { label: "Thu", aqi: 31 },
      { label: "Fri", aqi: 27 },
      { label: "Sat", aqi: 22 },
      { label: "Sun", aqi: 25 },
    ],
    forecast: [
      { period: "Morning", aqi: 25, note: "Clear conditions" },
      { period: "Afternoon", aqi: 35, note: "A small midday rise" },
      { period: "Evening", aqi: 23, note: "Conditions ease" },
    ],
  },
  "san-francisco": {
    city: "San Francisco",
    region: "California",
    aqi: 56,
    pollutants: [
      { name: "PM2.5", value: "10.4", unit: "µg/m³" },
      { name: "PM10", value: "18", unit: "µg/m³" },
      { name: "Ozone", value: "42", unit: "ppb" },
      { name: "Nitrogen dioxide", value: "15", unit: "ppb" },
    ],
    hourly: [
      { label: "6 AM", aqi: 48 },
      { label: "8 AM", aqi: 52 },
      { label: "10 AM", aqi: 58 },
      { label: "12 PM", aqi: 63 },
      { label: "2 PM", aqi: 56 },
      { label: "4 PM", aqi: 52 },
      { label: "6 PM", aqi: 49 },
    ],
    weekly: [
      { label: "Mon", aqi: 62 },
      { label: "Tue", aqi: 56 },
      { label: "Wed", aqi: 51 },
      { label: "Thu", aqi: 59 },
      { label: "Fri", aqi: 54 },
      { label: "Sat", aqi: 48 },
      { label: "Sun", aqi: 53 },
    ],
    forecast: [
      { period: "Morning", aqi: 52, note: "Moderate near busy roads" },
      { period: "Afternoon", aqi: 63, note: "A little more particulate matter" },
      { period: "Evening", aqi: 49, note: "Conditions ease" },
    ],
  },
  "new-york": {
    city: "New York",
    region: "New York",
    aqi: 78,
    pollutants: [
      { name: "PM2.5", value: "16.1", unit: "µg/m³" },
      { name: "PM10", value: "26", unit: "µg/m³" },
      { name: "Ozone", value: "49", unit: "ppb" },
      { name: "Nitrogen dioxide", value: "23", unit: "ppb" },
    ],
    hourly: [
      { label: "6 AM", aqi: 68 },
      { label: "8 AM", aqi: 73 },
      { label: "10 AM", aqi: 81 },
      { label: "12 PM", aqi: 86 },
      { label: "2 PM", aqi: 78 },
      { label: "4 PM", aqi: 74 },
      { label: "6 PM", aqi: 70 },
    ],
    weekly: [
      { label: "Mon", aqi: 82 },
      { label: "Tue", aqi: 78 },
      { label: "Wed", aqi: 73 },
      { label: "Thu", aqi: 85 },
      { label: "Fri", aqi: 76 },
      { label: "Sat", aqi: 69 },
      { label: "Sun", aqi: 74 },
    ],
    forecast: [
      { period: "Morning", aqi: 73, note: "Busier roads may raise exposure" },
      { period: "Afternoon", aqi: 86, note: "Higher sample reading" },
      { period: "Evening", aqi: 70, note: "Conditions ease" },
    ],
  },
};

export const demoDailyActions = [
  { id: "route", title: "Choose a greener route", detail: "A street away from heavy traffic can reduce roadside exposure." },
  { id: "windows", title: "Check the outdoor reading first", detail: "Use a trusted local source before opening windows or planning exercise." },
  { id: "transit", title: "Try one shared or transit trip", detail: "Small routine changes can lower estimated commute emissions." },
];

export function getAqiCategory(aqi: number): "Good" | "Moderate" | "High" {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  return "High";
}