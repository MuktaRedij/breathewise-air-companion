/**
 * Environment configuration and safe validator.
 * Strictly keeps private API keys (GEMINI_API_KEY, GOOGLE_MAPS_AIR_QUALITY_API_KEY,
 * SUPABASE_SERVICE_ROLE_KEY) server-side only via process.env.
 * Never reads or exposes private secrets through VITE_ client variables.
 */

export const env = {
  // Server-only private keys (never exposed to client bundles)
  get geminiApiKey(): string | undefined {
    return typeof process !== "undefined" ? process.env?.["GEMINI_API_KEY"] : undefined;
  },
  get geminiModel(): string {
    return (
      (typeof process !== "undefined" ? process.env?.["GEMINI_MODEL"] : undefined) ||
      "gemini-1.5-flash"
    );
  },
  get googleMapsAirQualityApiKey(): string | undefined {
    return typeof process !== "undefined"
      ? process.env?.["GOOGLE_MAPS_AIR_QUALITY_API_KEY"]
      : undefined;
  },
  get supabaseServiceKey(): string | undefined {
    return typeof process !== "undefined" ? process.env?.["SUPABASE_SERVICE_ROLE_KEY"] : undefined;
  },

  // Public / client-safe keys
  get supabaseUrl(): string | undefined {
    return typeof process !== "undefined"
      ? process.env?.["VITE_SUPABASE_URL"]
      : (import.meta as unknown as { env?: Record<string, string> }).env?.["VITE_SUPABASE_URL"];
  },
  get supabaseAnonKey(): string | undefined {
    return typeof process !== "undefined"
      ? process.env?.["VITE_SUPABASE_ANON_KEY"]
      : (import.meta as unknown as { env?: Record<string, string> }).env?.[
          "VITE_SUPABASE_ANON_KEY"
        ];
  },
  get host(): string {
    return (typeof process !== "undefined" ? process.env?.["HOST"] : undefined) || "0.0.0.0";
  },
  get port(): number {
    return (typeof process !== "undefined" ? Number(process.env?.["PORT"]) : 0) || 8080;
  },
  get isProduction(): boolean {
    return typeof process !== "undefined" && process.env?.["NODE_ENV"] === "production";
  },
  get isAiConfigured(): boolean {
    return Boolean(this.geminiApiKey);
  },
  get isAirQualityApiConfigured(): boolean {
    return Boolean(this.googleMapsAirQualityApiKey);
  },
  get isSupabaseConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey);
  },
};
