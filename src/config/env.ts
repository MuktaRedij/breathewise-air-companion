/**
 * Environment configuration and safe validator.
 * Ensures private keys are never leaked to client bundles.
 */

export const env = {
  // Server-only keys
  get geminiApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  },
  get geminiModel(): string {
    return process.env.GEMINI_MODEL || "gemini-1.5-flash";
  },
  get googleMapsAirQualityApiKey(): string | undefined {
    return (
      process.env.GOOGLE_MAPS_AIR_QUALITY_API_KEY ||
      process.env.VITE_GOOGLE_MAPS_AIR_QUALITY_API_KEY
    );
  },
  get supabaseServiceKey(): string | undefined {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  },

  // Public / client-safe keys
  get supabaseUrl(): string | undefined {
    return typeof process !== "undefined"
      ? process.env.VITE_SUPABASE_URL
      : (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL;
  },
  get supabaseAnonKey(): string | undefined {
    return typeof process !== "undefined"
      ? process.env.VITE_SUPABASE_ANON_KEY
      : (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;
  },
  get port(): number {
    return Number(process.env.PORT) || 8080;
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
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
