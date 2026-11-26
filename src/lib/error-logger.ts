type ErrorContext = Record<string, unknown>;

export function logRuntimeError(error: unknown, context: ErrorContext = {}): void {
  const message = describeThrown(error);
  const route = typeof window !== "undefined" ? window.location.pathname : "ssr";

  if (process.env["NODE_ENV"] !== "production") {
    console.error("[BreatheWise Error]", { message, route, ...context, raw: error });
  } else {
    // Production telemetry hook (e.g. Sentry or CloudWatch) can be attached here
    console.error(`[BreatheWise Error][${route}] ${message}`);
  }
}

export function describeThrown(error: unknown): string {
  if (error instanceof Response) {
    return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  const { message } = (error ?? {}) as { message?: unknown };
  if (typeof message === "string" && message.length > 0) return message;
  try {
    return JSON.stringify(error)?.slice(0, 2000) ?? String(error);
  } catch {
    return String(error);
  }
}
