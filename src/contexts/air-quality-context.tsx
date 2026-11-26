import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import type { AirQualityData, AqiStandard, CityCatalogItem } from "../types/air-quality.types";
import type { UserLifestyleProfile } from "../types/ai.types";
import { AirQualityService } from "../services/air-quality.service";
import { StorageService } from "../services/storage.service";
import { CITIES_CATALOG } from "../constants/cities";

type AirQualityContextType = {
  currentAirData: AirQualityData;
  standard: AqiStandard;
  setStandard: (std: AqiStandard) => void;
  selectedCityId: string;
  setCityId: (id: string) => void;
  availableCities: CityCatalogItem[];
  profile: UserLifestyleProfile;
  updateProfile: (updates: Partial<UserLifestyleProfile>) => void;
  isLoading: boolean;
  detectLocation: () => Promise<string>;
  refreshAirData: () => Promise<void>;
};

const AirQualityContext = createContext<AirQualityContextType | null>(null);

export function AirQualityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCityId, setSelectedCityIdState] = useState<string>(() =>
    StorageService.getSelectedCity("delhi"),
  );
  const [standard, setStandardState] = useState<AqiStandard>(() => {
    const saved = StorageService.getSelectedStandard();
    return saved === "INDIA_CPCB" || saved === "US_EPA" ? (saved as AqiStandard) : "INDIA_CPCB";
  });
  const [profile, setProfileState] = useState<UserLifestyleProfile>(() =>
    StorageService.getUserProfile(),
  );
  const [currentAirData, setCurrentAirData] = useState<AirQualityData>(() => {
    // Initial sync baseline for SSR/hydration
    const initialCity = (CITIES_CATALOG.find((c) => c.id === selectedCityId) || CITIES_CATALOG[0])!;
    return {
      id: initialCity.id,
      city: initialCity.city,
      region: initialCity.region,
      country: initialCity.country,
      coordinates: initialCity.coordinates,
      aqi: initialCity.baseAqi,
      standard,
      category: "Moderate",
      categoryColor: "bg-amber-500",
      pollutants: [],
      hourly: [],
      weekly: [],
      forecast: [],
      lastUpdated: "Just now",
      isLive: false,
      dataSource: "BreatheWise Reference Baseline",
      dominantPollutant: "PM2.5",
      healthSummary: "Loading air conditions...",
      sensitiveGroupNotice: "",
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const loadData = async (cityId: string, std: AqiStandard) => {
    setIsLoading(true);
    try {
      const data = await AirQualityService.getAirQuality(cityId, std);
      startTransition(() => {
        setCurrentAirData(data);
      });
    } catch (err) {
      console.error("[AirQualityProvider] Error loading air data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedCityId, standard);
  }, [selectedCityId, standard]);

  const setCityId = (id: string) => {
    setSelectedCityIdState(id);
    StorageService.setSelectedCity(id);
    const targetCity = CITIES_CATALOG.find((c) => c.id === id);
    if (targetCity && !StorageService.getSelectedStandard()) {
      setStandardState(targetCity.defaultStandard);
    }
  };

  const setStandard = (std: AqiStandard) => {
    setStandardState(std);
    StorageService.setSelectedStandard(std);
  };

  const updateProfile = (updates: Partial<UserLifestyleProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...updates };
      StorageService.saveUserProfile(next);
      return next;
    });
  };

  const refreshAirData = async () => {
    await loadData(selectedCityId, standard);
  };

  const detectLocation = async (): Promise<string> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return "Geolocation is not supported by your browser.";
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Find closest city in catalog
          let closestCity = CITIES_CATALOG[0]!;
          let minDistance = Infinity;

          for (const city of CITIES_CATALOG) {
            const dLat = city.coordinates.lat - latitude;
            const dLng = city.coordinates.lng - longitude;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = city;
            }
          }

          setCityId(closestCity.id);
          resolve(
            `Location detected (${latitude.toFixed(2)}, ${longitude.toFixed(2)}). Set closest city to ${closestCity.city}, ${closestCity.country}.`,
          );
        },
        () => {
          resolve("Location permission was denied. Select your city from the dropdown.");
        },
        { timeout: 8000, maximumAge: 60000 },
      );
    });
  };

  return (
    <AirQualityContext.Provider
      value={{
        currentAirData,
        standard,
        setStandard,
        selectedCityId,
        setCityId,
        availableCities: CITIES_CATALOG,
        profile,
        updateProfile,
        isLoading,
        detectLocation,
        refreshAirData,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  );
}

export function useAirQuality() {
  const context = useContext(AirQualityContext);
  if (!context) {
    throw new Error("useAirQuality must be used within an AirQualityProvider");
  }
  return context;
}
