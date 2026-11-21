import type { CityCatalogItem } from "../types/air-quality.types";

export const CITIES_CATALOG: CityCatalogItem[] = [
  // Indian Metropolitan Cities (Default: CPCB NAQI)
  {
    id: "delhi",
    city: "New Delhi",
    region: "National Capital Region",
    country: "India",
    defaultStandard: "INDIA_CPCB",
    coordinates: { lat: 28.6139, lng: 77.209 },
    baseAqi: 284, // Poor tier typical for NCR
    pollutants: {
      pm25: 142.5,
      pm10: 228.0,
      o3: 44.0,
      no2: 68.2,
      so2: 18.4,
      co: 2.1,
    },
  },
  {
    id: "mumbai",
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
    defaultStandard: "INDIA_CPCB",
    coordinates: { lat: 19.076, lng: 72.8777 },
    baseAqi: 148, // Moderate tier
    pollutants: {
      pm25: 58.4,
      pm10: 112.0,
      o3: 32.0,
      no2: 42.5,
      so2: 14.1,
      co: 1.4,
    },
  },
  {
    id: "bengaluru",
    city: "Bengaluru",
    region: "Karnataka",
    country: "India",
    defaultStandard: "INDIA_CPCB",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    baseAqi: 68, // Satisfactory
    pollutants: {
      pm25: 22.0,
      pm10: 48.0,
      o3: 26.0,
      no2: 24.0,
      so2: 7.2,
      co: 0.8,
    },
  },
  {
    id: "kolkata",
    city: "Kolkata",
    region: "West Bengal",
    country: "India",
    defaultStandard: "INDIA_CPCB",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    baseAqi: 176, // Moderate
    pollutants: {
      pm25: 78.0,
      pm10: 136.0,
      o3: 35.0,
      no2: 48.0,
      so2: 16.5,
      co: 1.6,
    },
  },
  {
    id: "chennai",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    defaultStandard: "INDIA_CPCB",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    baseAqi: 82, // Satisfactory
    pollutants: {
      pm25: 28.5,
      pm10: 64.0,
      o3: 28.0,
      no2: 26.0,
      so2: 9.1,
      co: 0.9,
    },
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    region: "Telangana",
    country: "India",
    defaultStandard: "INDIA_CPCB",
    coordinates: { lat: 17.385, lng: 78.4867 },
    baseAqi: 115, // Moderate
    pollutants: {
      pm25: 42.0,
      pm10: 88.0,
      o3: 30.0,
      no2: 34.0,
      so2: 11.0,
      co: 1.1,
    },
  },

  // US & International Cities (Default: US EPA)
  {
    id: "portland",
    city: "Portland",
    region: "Oregon",
    country: "United States",
    defaultStandard: "US_EPA",
    coordinates: { lat: 45.5152, lng: -122.6784 },
    baseAqi: 42, // Good
    pollutants: {
      pm25: 7.2,
      pm10: 12.0,
      o3: 31.0,
      no2: 11.0,
      so2: 2.1,
      co: 0.4,
    },
  },
  {
    id: "seattle",
    city: "Seattle",
    region: "Washington",
    country: "United States",
    defaultStandard: "US_EPA",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    baseAqi: 28, // Good
    pollutants: {
      pm25: 4.8,
      pm10: 9.0,
      o3: 24.0,
      no2: 8.0,
      so2: 1.5,
      co: 0.3,
    },
  },
  {
    id: "san-francisco",
    city: "San Francisco",
    region: "California",
    country: "United States",
    defaultStandard: "US_EPA",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    baseAqi: 56, // Moderate
    pollutants: {
      pm25: 10.4,
      pm10: 18.0,
      o3: 42.0,
      no2: 15.0,
      so2: 3.2,
      co: 0.6,
    },
  },
  {
    id: "new-york",
    city: "New York",
    region: "New York",
    country: "United States",
    defaultStandard: "US_EPA",
    coordinates: { lat: 40.7128, lng: -74.006 },
    baseAqi: 78, // Moderate
    pollutants: {
      pm25: 16.1,
      pm10: 26.0,
      o3: 49.0,
      no2: 23.0,
      so2: 4.8,
      co: 0.8,
    },
  },
  {
    id: "london",
    city: "London",
    region: "Greater London",
    country: "United Kingdom",
    defaultStandard: "US_EPA",
    coordinates: { lat: 51.5074, lng: -0.1278 },
    baseAqi: 62, // Moderate
    pollutants: {
      pm25: 12.5,
      pm10: 21.0,
      o3: 38.0,
      no2: 28.0,
      so2: 4.0,
      co: 0.7,
    },
  },
  {
    id: "tokyo",
    city: "Tokyo",
    region: "Kanto",
    country: "Japan",
    defaultStandard: "US_EPA",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    baseAqi: 36, // Good
    pollutants: {
      pm25: 6.5,
      pm10: 14.0,
      o3: 29.0,
      no2: 16.0,
      so2: 2.5,
      co: 0.5,
    },
  },
];
