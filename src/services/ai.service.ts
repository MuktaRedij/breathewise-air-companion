import { env } from "../config/env";
import type { AirQualityData } from "../types/air-quality.types";
import type {
  ChatMessage,
  DailyRoutinePlan,
  IndoorRecommendation,
  RoutineMoment,
  UserLifestyleProfile,
} from "../types/ai.types";

export class AiService {
  /**
   * Generates a context-aware 3-part daily routine tailored to current AQI and lifestyle.
   */
  public static async generateDailyRoutine(
    profile: UserLifestyleProfile,
    airData: AirQualityData,
  ): Promise<DailyRoutinePlan> {
    if (env.isAiConfigured && env.geminiApiKey) {
      try {
        const aiPlan = await this.callGeminiForPlan(profile, airData);
        if (aiPlan) return aiPlan;
      } catch (err) {
        console.warn("[AiService] Gemini API call error, falling back to rule engine:", err);
      }
    }

    return this.buildExpertDailyPlan(profile, airData);
  }

  /**
   * Generates tailored indoor air recommendations based on home sources and outdoor pollution.
   */
  public static generateIndoorAirAdvice(
    airData: AirQualityData,
    _homeProfile?: Partial<UserLifestyleProfile>,
  ): IndoorRecommendation[] {
    const isOutdoorHigh = airData.aqi > 100;
    const isOutdoorSevere = airData.aqi > 200;

    return [
      {
        sourceId: "cooking",
        title: "Cooking Particulates & Gas Stoves",
        recommendation:
          "Use a ducted kitchen range hood on high whenever searing, frying, or boiling. Cover pans with lids to trap aerosolized oil particles.",
        scientificReason:
          "Frying and gas combustion release ultra-fine PM2.5, nitrogen dioxide (NO2), and carbon monoxide directly into breathing zones.",
        appliesToSensitive: true,
        requiresFiltration: false,
        priority: "High",
      },
      {
        sourceId: "ventilation",
        title: isOutdoorHigh ? "Outdoor Infiltration Defense" : "Fresh Air Cross-Ventilation",
        recommendation: isOutdoorHigh
          ? `Keep windows tightly closed while outdoor AQI is ${airData.aqi} (${airData.category}). Switch HVAC systems to recirculate with a high-MERV or HEPA filter.`
          : "Open windows for 20-30 minutes during low-traffic hours (typically 10 AM to 3 PM) to flush accumulated indoor CO2 and VOCs.",
        scientificReason: isOutdoorHigh
          ? "Outdoor ambient fine particles easily infiltrate window gaps and elevate indoor PM2.5 levels to near-outdoor concentrations."
          : "When outdoor air is cleaner than indoor air, natural ventilation rapidly reduces indoor moisture, formaldehyde, and volatile organic compounds.",
        appliesToSensitive: true,
        requiresFiltration: isOutdoorHigh,
        priority: isOutdoorSevere ? "High" : "Medium",
      },
      {
        sourceId: "purification",
        title: "HEPA True Air Purification",
        recommendation:
          "Run a True HEPA (H13 or H14) air purifier sized to deliver at least 4.8 air changes per hour (ACH) in occupied rooms. Strictly avoid ozone-generating or ionizer air cleaners.",
        scientificReason:
          "Mechanical True HEPA captures 99.97% of fine particles down to 0.3 microns without emitting ozone, a known lung irritant.",
        appliesToSensitive: true,
        requiresFiltration: true,
        priority: isOutdoorHigh ? "High" : "Medium",
      },
      {
        sourceId: "cleaning",
        title: "Damp Dusting & Safe Cleaning",
        recommendation:
          "Use damp microfiber cloths rather than dry feather dusters. Choose fragrance-free cleaning products and avoid aerosol sprays.",
        scientificReason:
          "Dry dusting re-suspends allergens into breathable air; synthetic fragrances emit terpenes that react with background ozone to form secondary particulates.",
        appliesToSensitive: false,
        requiresFiltration: false,
        priority: "Medium",
      },
    ];
  }

  /**
   * Generates location and AQI-aware chat answers with scientific rigor.
   */
  public static async generateChatResponse(
    userMessage: string,
    airData: AirQualityData,
    profile: UserLifestyleProfile,
    _history: ChatMessage[] = [],
  ): Promise<string> {
    if (env.isAiConfigured && env.geminiApiKey) {
      try {
        const response = await this.callGeminiChat(userMessage, airData, profile);
        if (response) return response;
      } catch (err) {
        console.warn(
          "[AiService] Gemini chat call failed, falling back to expert rule engine:",
          err,
        );
      }
    }

    return this.expertRuleChatReply(userMessage, airData, profile);
  }

  /**
   * Deterministic, scientifically validated expert reasoning engine.
   * Handles the 6 core prompt queries with contextual air quality and user data.
   */
  private static expertRuleChatReply(
    query: string,
    air: AirQualityData,
    profile: UserLifestyleProfile,
  ): string {
    const q = query.toLowerCase();

    // Question 1: Is it safe to go jogging today?
    if (
      q.includes("jog") ||
      q.includes("running") ||
      q.includes("exercise") ||
      q.includes("workout")
    ) {
      if (air.aqi <= 50) {
        return `**Yes, it is safe to jog today in ${air.city}.** The air quality is **${air.category}** (AQI ${air.aqi} on the ${air.standard === "INDIA_CPCB" ? "CPCB NAQI" : "US EPA"} scale). Strenuous outdoor cardiovascular exercise is completely fine today for all individuals, including sensitive groups. Enjoy your workout!`;
      }
      if (air.aqi <= 100) {
        return `**Jogging is acceptable for most people in ${air.city} today** with AQI at **${air.aqi} (${air.category})**. However, if you or family members have asthma or respiratory sensitivity, consider scheduling your run away from heavy vehicular roads, or shifting to indoor cardio during peak afternoon traffic.`;
      }
      if (air.aqi <= 150) {
        return `**Caution is advised for outdoor jogging in ${air.city}** (AQI ${air.aqi} - ${air.category}). High-exertion aerobic exercise dramatically increases inhalation volume (up to 10-20x rest rates), driving fine particles deeper into the pulmonary alveolar region. Sensitive individuals should exercise indoors; others should reduce intensity and distance.`;
      }
      return `**No, outdoor jogging is NOT recommended today in ${air.city}.** With AQI at **${air.aqi} (${air.category})**, outdoor cardio poses acute respiratory and cardiovascular risks. Deep respiration will draw high concentrations of ${air.dominantPollutant} into your lungs. **Recommendation:** Shift your exercise indoors in a closed room with a running HEPA air purifier.`;
    }

    // Question 2: How can I protect my family from PM2.5?
    if (q.includes("pm2.5") || q.includes("protect my family") || q.includes("protect family")) {
      return `### How to Protect Your Family from PM2.5 in ${air.city} (Current AQI: ${air.aqi})

1. **Indoor Air Filtration:** Deploy a mechanical **True HEPA (H13/H14)** purifier in living spaces and bedrooms. HEPA captures 99.97% of fine particles down to 0.3 microns. Ensure the CADR matches your room volume.
2. **Personal Protection Outdoors:** When outdoor AQI exceeds 100, wear a well-fitted **N95, KN95, or FFP2 respirator** when outdoors. Cloth and surgical masks do not create a tight seal and fail to stop sub-micron PM2.5 particles.
3. **Control Indoor Particle Sources:** Always use an exhaust fan venting outdoors while cooking (especially frying or using gas burners). Avoid burning candles, incense, or smoking indoors.
4. **Window Management:** Keep windows closed when outdoor AQI is high. Check BreatheWise hourly trends to identify low-pollution ventilation windows.`;
    }

    // Question 3: What is the best time to open my windows?
    if (q.includes("window") || q.includes("airing") || q.includes("ventilate")) {
      if (air.aqi > 150) {
        return `**Right now is NOT a good time to open windows in ${air.city}** (Current AQI is ${air.aqi} - ${air.category}). Opening windows will allow high concentrations of outdoor particulate pollution into your home. **Best Action:** Keep windows closed, run recirculating HVAC or a HEPA air purifier, and wait for outdoor conditions to improve below 100 AQI.`;
      }
      return `**Optimal Ventilation Windows for ${air.city}:**
- **Best Times:** Mid-morning (10:00 AM – 12:00 PM) or early afternoon (2:00 PM – 4:00 PM), when morning rush hour emissions have dispersed and temperature inversion layers have lifted.
- **Avoid:** Early mornings (6:00 AM – 9:00 AM) and evening rush hours (6:00 PM – 9:00 PM) when ground-level traffic exhaust and cooler boundary layers concentrate pollutants.
- **Rule of Thumb:** Ventilate quickly (15–20 minutes cross-breeze) rather than leaving windows cracked all day.`;
    }

    // Question 4: How can I reduce pollution exposure during my commute?
    if (q.includes("commute") || (q.includes("exposure") && q.includes("travel"))) {
      return `### Reducing Exposure During Your ${profile.commute || "Daily"} Commute:

1. **Route Separation:** Traveling even **one block (50–100 meters) away** from primary arterial truck and bus corridors reduces roadside PM2.5 and NO2 exposure by up to **40–60%**.
2. **In-Vehicle Recirculation:** If driving or in a cab, keep windows closed and switch climate control to **Cabin Air Recirculation**. This prevents drawing exhaust directly through exterior intake vents.
3. **Transit Protection:** If walking, cycling, or waiting at open bus stops near traffic when AQI is elevated, wear an N95 respirator.
4. **Time Buffers:** Shift commuting 30 minutes earlier or later to avoid the peak vehicular congestion gridlock where exhaust buildup is highest.`;
    }

    // Question 5: What are the best low-emission travel alternatives?
    if (
      q.includes("low-emission") ||
      q.includes("travel alternatives") ||
      q.includes("green travel") ||
      q.includes("carbon")
    ) {
      return `### Best Low-Emission Travel Alternatives (Ranked by CO₂e Efficiency):

1. **Walking & Cycling (0 g CO₂e/km):** Zero tailpipe and zero grid emissions. Best for short trips under 3–5 km when outdoor air quality permits.
2. **Metro / Electric Rail (~35 g CO₂e/passenger-km):** Highest passenger capacity and electrified mass transit efficiency. Emits ~80% less CO₂e than a solo gasoline car.
3. **Public Bus / Transit (~90 g CO₂e/passenger-km):** Drastically cuts per-person congestion and emissions compared to individual cars.
4. **Carpooling (~95 g CO₂e/passenger-km):** Sharing a ride with 2–3 colleagues splits vehicular emissions by half or a third.
5. **Comparison:** A typical solo passenger car emits ~**180 g CO₂e/km**. Swapping a 6 km solo car trip for metro avoids approximately **0.87 kg of CO₂e** every single trip.`;
    }

    // Question 6: What should I do when AQI becomes hazardous?
    if (
      q.includes("hazardous") ||
      q.includes("emergency") ||
      q.includes("severe") ||
      q.includes("300") ||
      q.includes("400")
    ) {
      return `### CRITICAL ACTION PROTOCOL: When AQI Becomes Hazardous (>300 US EPA / >400 CPCB)

1. **Stay Strictly Indoors:** Seal windows and exterior doors. Close chimney flues and seal any noticeable draft gaps.
2. **Run Continuous HEPA Filtration:** Operate True HEPA air purifiers at medium-to-high speed in bedrooms and main living areas. Do not turn them off.
3. **Zero Indoor Pollution:** Do not fry food, do not burn candles or incense, do not vacuum with non-HEPA vacuums, and avoid unvented gas heaters.
4. **Respirator Requirement:** If you MUST step outdoors for essential reasons, wear a certified, tightly sealed **N95, KN95, or FFP2 mask**. Normal surgical and cloth masks offer almost zero protection against hazardous fine particulates.
5. **Medical Vigilance:** Individuals with asthma, COPD, cardiovascular conditions, children, and the elderly should have emergency rescue medications accessible.`;
    }

    // Domain 7: Forecasts & safest outdoor window
    if (
      q.includes("forecast") ||
      q.includes("tomorrow") ||
      q.includes("later today") ||
      q.includes("outlook")
    ) {
      return `### Air Quality Forecast Context for ${air.city} (Current AQI: ${air.aqi})

- **Diurnal Pattern:** Urban particulates typically peak during morning rush hours (7:00–9:30 AM) and evening temperature inversions (7:00–10:00 PM).
- **Safest Outdoor Window:** Midday to early afternoon (**11:00 AM – 3:30 PM**) usually offers better vertical atmospheric dispersion.
- **Full Hourly View:** Visit the **Forecast** page to inspect the 24-hour hourly AQI, PM2.5, and PM10 trajectory and see whether live 48–72 hour meteorological outlooks are connected.`;
    }

    // Domain 8: Personal Exposure Score
    if (q.includes("exposure") && !q.includes("commute")) {
      return `### Managing Your Personal Exposure in ${air.city} (AQI ${air.aqi})

- **What Drives Exposure:** Your relative inhaled dose depends on ambient PM2.5, duration outdoors, and breathing rate (vigorous exercise increases inhalation 3× compared to rest).
- **Track It:** Use the **Exposure Tracker** page to log your outdoor and commute minutes and view your 7-day relative exposure trend.
- **Disclaimer:** Exposure scores are informational estimates, not medical diagnoses.`;
    }

    // Domain 9: Pollution Alerts
    if (
      q.includes("alert") ||
      q.includes("notification") ||
      q.includes("threshold") ||
      q.includes("briefing")
    ) {
      return `### Smart Pollution Alerts for ${air.city}

- **Current Status:** ${air.city} is at **AQI ${air.aqi} (${air.category})**.
- **Configure Thresholds:** Open the **Alerts** page to set your custom AQI threshold (e.g., 100, 150, 200), enable Poor / Very Poor / Severe / Sudden Spike alerts, view your daily briefing, and optionally enable browser notifications.`;
    }

    // Domain 10: Clean Route Navigator
    if (q.includes("route") || q.includes("walk") || q.includes("cycl") || q.includes("navigate")) {
      return `### Clean Route Guidance for ${air.city} (AQI ${air.aqi})

- **Corridor Strategy:** Choosing park paths or side streets **50–100 meters away** from arterial bus/truck corridors reduces roadside PM2.5 and NO₂ exposure compared to main roads, while keeping tailpipe emissions at **0 g CO₂e**.
- **Compare Routes:** Open **Clean Routes** in the top navigation to compare Greenway vs. Arterial corridors for your walking or cycling trip.`;
    }

    // Domain 11: Community Reports
    if (q.includes("community") || q.includes("report") || q.includes("neighborhood")) {
      return `### Community Clean Air Hub (${air.city})

- **Local Observations:** You can view and submit hyper-local observations (traffic idling, biomass burning, construction dust) on the **Community** page.
- **Persistence:** Reports are saved locally so your neighborhood observations persist across refreshes.`;
    }

    // General fallback contextual response
    return `In **${air.city}**, current air quality is **${air.category}** with an AQI of **${air.aqi}** (${air.standard === "INDIA_CPCB" ? "CPCB NAQI" : "US EPA"} scale). Dominant pollutant: **${air.dominantPollutant}**.

**Health Context:** ${air.healthSummary}
**Ask me about:**
- *"Is it safe to go jogging today?"*
- *"What is the air quality forecast for today?"*
- *"How can I protect my family from PM2.5?"*
- *"What is the best time to open my windows?"*
- *"Recommend a clean walking route or lower-exposure commute."*
- *"How do I configure pollution alerts or check my exposure score?"*`;
  }

  /**
   * Generates a context-aware daily routine without calling external APIs.
   */
  private static buildExpertDailyPlan(
    profile: UserLifestyleProfile,
    air: AirQualityData,
  ): DailyRoutinePlan {
    const isElevated = air.aqi > 100;
    const isSevere = air.aqi > 200;

    const moments: RoutineMoment[] = [
      {
        time: "Morning",
        title: "Morning Commute & Departure",
        action: isElevated
          ? `Before your ${profile.commute} commute, wear an N95 mask if walking or waiting at transit stops. If driving, keep cabin air on recirculation.`
          : `Enjoy your ${profile.commute} commute. Consider taking a route a block away from the busiest road corridor to minimize roadside exhaust exposure.`,
        why: "Vehicular exhaust creates high localized concentrations of ultrafine PM2.5 and nitrogen dioxide near congested intersections.",
        personalExposureDefense: isElevated
          ? "N95 filtration blocks sub-micron particles from vehicle emissions."
          : "Spatial separation of 50m reduces exhaust exposure by up to 50%.",
        ecologicalBenefit:
          profile.commute.includes("transit") ||
          profile.commute.includes("walk") ||
          profile.commute.includes("cycl")
            ? "Your sustainable commute saves an estimated 0.8–1.5 kg CO₂e compared to solo driving."
            : "Choosing a shared trip or avoiding idling reduces greenhouse gas output.",
        safetyRating: isSevere ? "Avoid Outdoor" : isElevated ? "Caution" : "Safe",
      },
      {
        time: "Afternoon",
        title: "Mid-day Activity & Workplace",
        action: isElevated
          ? `Perform your ${profile.activity.toLowerCase()} indoors today. Keep workplace or home windows closed during peak midday photochemical hours.`
          : `Midday outdoor conditions are favorable. If taking a break or doing ${profile.activity.toLowerCase()}, green parks or open spaces are suitable.`,
        why: "Photochemical reaction of sunlight with vehicle emissions creates ground-level ozone peaks during afternoon hours.",
        personalExposureDefense: isElevated
          ? "Indoor exercise avoids heavy pulmonary uptake of ozone and fine particulate."
          : "Aerobic exercise in moderate conditions is safe for non-sensitive individuals.",
        ecologicalBenefit: "Opting for active indoor movement requires zero transit energy.",
        safetyRating: isElevated ? "Caution" : "Safe",
      },
      {
        time: "Evening",
        title: "Home Recovery & Indoor Air Quality",
        action: `For your ${profile.household.toLowerCase()}: run an extractor fan while cooking, maintain clean indoor surfaces, and ${isElevated ? "keep windows sealed with HEPA air filtration running" : "air out rooms for 15 minutes before bedtime"}.`,
        why: "Indoor cooking and human activity generate indoor particle spikes that must be filtered or ventilated before sleep.",
        personalExposureDefense:
          "Sleeping in clean air (<12 µg/m³ PM2.5) improves nocturnal oxygen saturation and cardiovascular recovery.",
        ecologicalBenefit:
          "Efficient localized exhaust fans use minimal electricity compared to whole-house continuous scrubbing.",
        safetyRating: "Safe",
      },
    ];

    return {
      city: air.city,
      aqi: air.aqi,
      aqiStandard: air.standard === "INDIA_CPCB" ? "CPCB NAQI" : "US EPA",
      category: air.category,
      generatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isAiGenerated: false,
      moments,
      overallGuidance: isElevated
        ? "Air quality is currently elevated. Prioritize respiratory defense during travel and keep indoor air filtered."
        : "Favorable conditions. Ideal day for green transport and normal daily routines.",
    };
  }

  /**
   * Gemini API integration for generating personalized routine.
   */
  private static async callGeminiForPlan(
    profile: UserLifestyleProfile,
    air: AirQualityData,
  ): Promise<DailyRoutinePlan | null> {
    const key = env.geminiApiKey;
    if (!key) return null;

    const prompt = `You are BreatheWise AI, an expert environmental health assistant.
User Profile:
- Occupation: ${profile.occupation}
- Commute Method: ${profile.commute}
- Activity/Exercise: ${profile.activity}
- Household Type: ${profile.household}
- Primary Preference: ${profile.preference}

Current Air Quality Context:
- City: ${air.city}, ${air.country}
- AQI: ${air.aqi} (${air.category}) [${air.standard} scale]
- Dominant Pollutant: ${air.dominantPollutant}

Generate a structured daily plan in JSON format. Return ONLY valid JSON with no markdown wrapping:
{
  "city": "${air.city}",
  "aqi": ${air.aqi},
  "aqiStandard": "${air.standard}",
  "category": "${air.category}",
  "generatedAt": "now",
  "isAiGenerated": true,
  "overallGuidance": "summary",
  "moments": [
    {
      "time": "Morning",
      "title": "title",
      "action": "practical actionable recommendation",
      "why": "scientific rationale",
      "personalExposureDefense": "how it protects respiratory health",
      "ecologicalBenefit": "how it helps emissions",
      "safetyRating": "Safe" | "Caution" | "Avoid Outdoor"
    },
    {
      "time": "Afternoon",
      "title": "title",
      "action": "action",
      "why": "why",
      "personalExposureDefense": "defense",
      "ecologicalBenefit": "benefit",
      "safetyRating": "Safe" | "Caution" | "Avoid Outdoor"
    },
    {
      "time": "Evening",
      "title": "title",
      "action": "action",
      "why": "why",
      "personalExposureDefense": "defense",
      "ecologicalBenefit": "benefit",
      "safetyRating": "Safe" | "Caution" | "Avoid Outdoor"
    }
  ]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
        }),
      },
    );

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;
    return JSON.parse(rawText) as DailyRoutinePlan;
  }

  /**
   * Gemini API integration for chat.
   */
  private static async callGeminiChat(
    userMessage: string,
    air: AirQualityData,
    profile: UserLifestyleProfile,
  ): Promise<string | null> {
    const key = env.geminiApiKey;
    if (!key) return null;

    const systemPrompt = `You are BreatheWise, an expert AI Urban Air Quality Assistant.
Always base your advice on the user's REAL environment:
- Location: ${air.city}, ${air.country}
- Real AQI: ${air.aqi} (${air.category}) on the ${air.standard} scale
- Dominant Pollutant: ${air.dominantPollutant}
- User Profile: ${profile.occupation}, commute by ${profile.commute}, household: ${profile.household}

Guidelines:
1. NEVER invent or hallucinate AQI values or pollutant numbers. Use the exact values provided above.
2. Clearly distinguish between "Personal Exposure Defense" (e.g. N95 masks, HEPA filtration) and "Ecological Emissions Benefit" (e.g. taking metro).
3. Do not endorse unscientific methods like houseplants for heavy air cleaning.
4. Keep advice practical, affordable, and actionable.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }] },
          ],
          generationConfig: { temperature: 0.3 },
        }),
      },
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }
}
