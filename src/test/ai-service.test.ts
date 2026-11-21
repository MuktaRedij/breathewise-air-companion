import { describe, expect, it } from "vitest";
import { AiService } from "../services/ai.service";
import type { AirQualityData } from "../types/air-quality.types";
import type { UserLifestyleProfile } from "../types/ai.types";

const mockAirData: AirQualityData = {
  id: "delhi",
  city: "New Delhi",
  region: "National Capital Region",
  country: "India",
  coordinates: { lat: 28.6139, lng: 77.209 },
  aqi: 284,
  standard: "INDIA_CPCB",
  category: "Poor",
  categoryColor: "bg-orange-500",
  pollutants: [
    {
      name: "PM2.5",
      code: "pm25",
      value: 142.5,
      unit: "µg/m³",
      category: "Poor",
      healthImpact: "Inhalable fine particles",
    },
  ],
  hourly: [],
  weekly: [],
  forecast: [],
  lastUpdated: "Just now",
  isLive: false,
  dataSource: "CPCB Baseline",
  dominantPollutant: "PM2.5",
  healthSummary: "Breathing discomfort to most people on prolonged exposure.",
  sensitiveGroupNotice: "Sensitive groups must stay indoors.",
};

const mockProfile: UserLifestyleProfile = {
  occupation: "Software Engineer",
  commute: "public transit",
  activity: "Outdoor running / jogging",
  household: "Family with young children",
  preference: "Personal respiratory protection",
  commuteDistanceKm: 8,
};

describe("AI Service & Context-Aware Expert Fallback Engine", () => {
  it("generates a structured daily routine considering real air data", async () => {
    const plan = await AiService.generateDailyRoutine(mockProfile, mockAirData);

    expect(plan.city).toBe("New Delhi");
    expect(plan.aqi).toBe(284);
    expect(plan.moments).toHaveLength(3);
    expect(plan.moments[0].time).toBe("Morning");
    expect(plan.moments[1].time).toBe("Afternoon");
    expect(plan.moments[2].time).toBe("Evening");
    expect(plan.moments[0].personalExposureDefense).toBeDefined();
    expect(plan.moments[0].ecologicalBenefit).toBeDefined();
  });

  describe("Core Required Audit Questions", () => {
    it("answers: Is it safe to go jogging today? with clear contextual risk warning", async () => {
      const reply = await AiService.generateChatResponse(
        "Is it safe to go jogging today?",
        mockAirData,
        mockProfile,
      );
      expect(reply.toLowerCase()).toContain("not recommended");
      expect(reply).toContain("New Delhi");
      expect(reply).toContain("284");
      expect(reply).toContain("HEPA");
    });

    it("answers: How can I protect my family from PM2.5? with HEPA and N95 details", async () => {
      const reply = await AiService.generateChatResponse(
        "How can I protect my family from PM2.5?",
        mockAirData,
        mockProfile,
      );
      expect(reply).toContain("HEPA");
      expect(reply).toContain("N95");
      expect(reply).toContain("PM2.5");
    });

    it("answers: What is the best time to open my windows? with diurnal atmospheric guidance", async () => {
      const reply = await AiService.generateChatResponse(
        "What is the best time to open my windows?",
        mockAirData,
        mockProfile,
      );
      expect(reply).toContain("windows");
      expect(reply).toContain("New Delhi");
    });

    it("answers: How can I reduce pollution exposure during my commute? with route separation advice", async () => {
      const reply = await AiService.generateChatResponse(
        "How can I reduce pollution exposure during my commute?",
        mockAirData,
        mockProfile,
      );
      expect(reply).toContain("Route Separation");
      expect(reply).toContain("Recirculation");
    });

    it("answers: What are the best low-emission travel alternatives? with emissions ranking", async () => {
      const reply = await AiService.generateChatResponse(
        "What are the best low-emission travel alternatives?",
        mockAirData,
        mockProfile,
      );
      expect(reply).toContain("Metro");
      expect(reply).toContain("CO₂e");
      expect(reply).toContain("Walking");
    });

    it("answers: What should I do when AQI becomes hazardous? with emergency protocol", async () => {
      const reply = await AiService.generateChatResponse(
        "What should I do when AQI becomes hazardous?",
        mockAirData,
        mockProfile,
      );
      expect(reply).toContain("CRITICAL ACTION PROTOCOL");
      expect(reply).toContain("HEPA");
      expect(reply).toContain("N95");
    });
  });
});
