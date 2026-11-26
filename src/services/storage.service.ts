import type { AlertPreferences, ExposureEntry, PollutionAlert } from "../types/air-quality.types";
import type { UserLifestyleProfile } from "../types/ai.types";

export type LoggedActionItem = {
  id: string;
  actionId: string;
  title: string;
  avoidedKg: number;
  timestamp: string;
};

export type CommunityReportItem = {
  id: number;
  category: string;
  neighborhood: string;
  note: string;
  time: string;
  isUserSubmitted?: boolean;
};

const STORAGE_KEYS = {
  USER_PROFILE: "breathewise_user_profile",
  SELECTED_CITY: "breathewise_selected_city",
  SELECTED_STANDARD: "breathewise_selected_standard",
  LOGGED_ACTIONS: "breathewise_logged_actions",
  COMMUNITY_REPORTS: "breathewise_community_reports",
  CHALLENGE_JOINED: "breathewise_challenge_joined",
  EXPOSURE_ENTRIES: "breathewise_exposure_entries",
  ALERT_PREFERENCES: "breathewise_alert_preferences",
  POLLUTION_ALERTS: "breathewise_pollution_alerts",
};

export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  // User Profile
  public static getUserProfile(): UserLifestyleProfile {
    if (!this.isBrowser()) {
      return this.getDefaultProfile();
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : this.getDefaultProfile();
    } catch {
      return this.getDefaultProfile();
    }
  }

  public static saveUserProfile(profile: UserLifestyleProfile): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn("[StorageService] Failed to save user profile:", e);
    }
  }

  // Selected City & Standard
  public static getSelectedCity(defaultCity = "delhi"): string {
    if (!this.isBrowser()) return defaultCity;
    return localStorage.getItem(STORAGE_KEYS.SELECTED_CITY) || defaultCity;
  }

  public static setSelectedCity(cityId: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SELECTED_CITY, cityId);
  }

  public static getSelectedStandard(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(STORAGE_KEYS.SELECTED_STANDARD);
  }

  public static setSelectedStandard(standard: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.SELECTED_STANDARD, standard);
  }

  // Logged Impact Actions
  public static getLoggedActions(): LoggedActionItem[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGGED_ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static logImpactAction(
    action: Omit<LoggedActionItem, "id" | "timestamp">,
  ): LoggedActionItem[] {
    const current = this.getLoggedActions();
    const newItem: LoggedActionItem = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newItem, ...current];
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEYS.LOGGED_ACTIONS, JSON.stringify(updated));
      } catch (e) {
        console.warn("[StorageService] Failed to persist impact action:", e);
      }
    }
    return updated;
  }

  // Community Reports
  public static getCommunityReports(initialDefaults: CommunityReportItem[]): CommunityReportItem[] {
    if (!this.isBrowser()) return initialDefaults;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY_REPORTS);
      if (!stored) return initialDefaults;
      const parsed: CommunityReportItem[] = JSON.parse(stored);
      return [...parsed, ...initialDefaults.filter((d) => !parsed.some((p) => p.id === d.id))];
    } catch {
      return initialDefaults;
    }
  }

  public static addCommunityReport(
    report: Omit<CommunityReportItem, "id" | "time">,
  ): CommunityReportItem[] {
    const newItem: CommunityReportItem = {
      ...report,
      id: Date.now(),
      time: "Just now · Saved locally",
      isUserSubmitted: true,
    };
    if (!this.isBrowser()) return [newItem];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY_REPORTS);
      const list: CommunityReportItem[] = stored ? JSON.parse(stored) : [];
      const updated = [newItem, ...list];
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_REPORTS, JSON.stringify(updated));
      return updated;
    } catch {
      return [newItem];
    }
  }

  // Challenge Status
  public static getChallengeJoined(): boolean {
    if (!this.isBrowser()) return false;
    return localStorage.getItem(STORAGE_KEYS.CHALLENGE_JOINED) === "true";
  }

  public static setChallengeJoined(joined: boolean): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.CHALLENGE_JOINED, String(joined));
  }

  // Personal Exposure Entries
  public static getExposureEntries(): ExposureEntry[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPOSURE_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static addExposureEntry(entry: ExposureEntry): ExposureEntry[] {
    const current = this.getExposureEntries();
    const updated = [entry, ...current];
    if (this.isBrowser()) {
      try {
        localStorage.setItem(STORAGE_KEYS.EXPOSURE_ENTRIES, JSON.stringify(updated));
      } catch (e) {
        console.warn("[StorageService] Failed to persist exposure entry:", e);
      }
    }
    return updated;
  }

  public static clearExposureEntries(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.EXPOSURE_ENTRIES);
  }

  // Smart Pollution Alert Preferences & Alerts
  public static getAlertPreferences(defaultCityId = "delhi"): AlertPreferences {
    const fallback: AlertPreferences = {
      thresholdAqi: 150,
      preferredCityId: defaultCityId,
      enablePoor: true,
      enableVeryPoor: true,
      enableSevere: true,
      enableSuddenSpike: true,
      browserNotificationsEnabled: false,
    };
    if (!this.isBrowser()) return fallback;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERT_PREFERENCES);
      return data ? { ...fallback, ...JSON.parse(data) } : fallback;
    } catch {
      return fallback;
    }
  }

  public static saveAlertPreferences(prefs: AlertPreferences): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ALERT_PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn("[StorageService] Failed to save alert preferences:", e);
    }
  }

  public static getPollutionAlerts(): PollutionAlert[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POLLUTION_ALERTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static savePollutionAlerts(alerts: PollutionAlert[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.POLLUTION_ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.warn("[StorageService] Failed to save pollution alerts:", e);
    }
  }

  private static getDefaultProfile(): UserLifestyleProfile {
    return {
      occupation: "Office-based / Tech",
      commute: "public transit",
      activity: "Light movement",
      household: "Family household",
      preference: "Low-cost options",
      commuteDistanceKm: 6,
      hasAirPurifier: true,
      hasSensitiveMembers: false,
    };
  }
}
