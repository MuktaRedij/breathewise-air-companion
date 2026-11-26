import { useEffect, useState } from "react";
import {
  AlertCircle,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { getAqiLevel } from "@/constants/aqi-standards";
import { useAirQuality } from "@/contexts/air-quality-context";
import { AirQualityService } from "@/services/air-quality.service";
import type { AirQualityForecast } from "@/types/air-quality.types";

const chartConfig = {
  aqi: { label: "Projected AQI", color: "var(--chart-1)" },
  pm25: { label: "PM2.5 (µg/m³)", color: "var(--chart-2)" },
};

export function ForecastScreen() {
  const { selectedCityId, standard, currentAirData } = useAirQuality();
  const [forecast, setForecast] = useState<AirQualityForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metric, setMetric] = useState<"aqi" | "pm25" | "pm10">("aqi");
  const [simulateUnavailable, setSimulateUnavailable] = useState(false);

  const loadForecast = async () => {
    setIsLoading(true);
    try {
      const data = await AirQualityService.getForecast(selectedCityId, standard);
      setForecast(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityId, standard]);

  const TrendIcon =
    forecast?.trendDirection === "improving"
      ? TrendingDown
      : forecast?.trendDirection === "deteriorating"
        ? TrendingUp
        : Minus;

  const trendLabel =
    forecast?.trendDirection === "improving"
      ? "Improving Air Quality"
      : forecast?.trendDirection === "deteriorating"
        ? "Deteriorating Air Quality"
        : "Stable Conditions";

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="AI Air Quality Forecast"
        title={`24-Hour & Multi-Day Outlook · ${currentAirData.city}`}
        description="Hourly trajectory, predicted pollutant shifts, safest outdoor windows, and transparent separation between measured readings and modeled predictions."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSimulateUnavailable((v) => !v)}
              className="h-9 rounded-lg text-xs"
            >
              {simulateUnavailable ? "Show Available Forecast" : "Preview Unavailable State"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadForecast}
              disabled={isLoading}
              className="h-9 gap-1.5 rounded-lg text-xs"
            >
              <RefreshCw
                aria-hidden="true"
                className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        }
      />

      {simulateUnavailable ? (
        <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-2xs">
          <AlertCircle aria-hidden="true" className="mx-auto size-8 text-amber-500" />
          <h2 className="font-display mt-3 text-lg font-semibold">
            Live Forecast Data Temporarily Unavailable
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
            BreatheWise could not retrieve verified hourly meteorological forecast feeds for{" "}
            {currentAirData.city}. Rather than inventing predictions, forecast charts are paused
            until telemetry is restored.
          </p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setSimulateUnavailable(false)}
            className="mt-4 rounded-lg text-xs"
          >
            Restore Baseline Forecast
          </Button>
        </section>
      ) : isLoading || !forecast ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-[340px] rounded-xl" />
        </div>
      ) : (
        <>
          {/* Source & Measured vs Predicted Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-xs shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold ${
                  forecast.isLiveForecast
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    forecast.isLiveForecast ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                {forecast.isLiveForecast
                  ? "LIVE METEOROLOGICAL FORECAST"
                  : "MODELED DIURNAL PREDICTION"}
              </span>
              <span className="text-muted-foreground">{forecast.dataSource}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock aria-hidden="true" className="size-3.5 text-primary" /> Generated{" "}
              {forecast.generatedAt}
            </span>
          </div>

          {/* Trend & Safest Outdoor Window Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trajectory
              </p>
              <div className="mt-2 flex items-center gap-2">
                <TrendIcon aria-hidden="true" className="size-5 text-primary" />
                <p className="font-display text-lg font-bold">{trendLabel}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on next 24-hour diurnal curve
              </p>
            </article>

            <article className="rounded-xl border border-primary/25 bg-secondary/60 p-5 shadow-2xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Safest Outdoor Window
              </p>
              <p className="font-display mt-2 text-lg font-bold text-foreground">
                {forecast.safestWindow}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Lowest predicted particulate concentration
              </p>
            </article>

            <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                AI Interpretation
              </p>
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-foreground">
                <Sparkles aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{forecast.aiExplanation}</span>
              </p>
            </article>
          </div>

          {/* Interactive 24-Hour Forecast Chart */}
          <Card className="rounded-xl border-border shadow-2xs">
            <CardHeader className="flex flex-col gap-3 p-5 pb-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hourly Prediction (Next 24 Hours)
                </p>
                <CardTitle className="font-display mt-1 text-xl">
                  Predicted{" "}
                  {metric === "aqi" ? "AQI" : metric === "pm25" ? "PM2.5 (µg/m³)" : "PM10 (µg/m³)"}{" "}
                  Curve
                </CardTitle>
              </div>
              <div className="flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
                {(["aqi", "pm25", "pm10"] as const).map((m) => (
                  <Button
                    key={m}
                    type="button"
                    size="sm"
                    variant={metric === m ? "secondary" : "ghost"}
                    onClick={() => setMetric(m)}
                    className="h-7 px-2.5 text-xs uppercase"
                  >
                    {m === "pm25" ? "PM2.5" : m}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
                <AreaChart
                  data={forecast.hourly24}
                  margin={{ top: 10, right: 10, left: -14, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    interval={3}
                    fontSize={11}
                  />
                  <YAxis tickLine={false} axisLine={false} width={40} fontSize={11} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(val) => (
                          <span className="font-semibold">
                            {val} {metric === "aqi" ? "AQI" : "µg/m³"}
                          </span>
                        )}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                    fill="url(#forecastFill)"
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Key 6-Hour Intervals Table */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6">
            <h2 className="font-display text-lg font-semibold">Key Forecast Checkpoints</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {forecast.hourly24
                .filter((_, idx) => idx % 6 === 0)
                .map((pt) => {
                  const lvl = getAqiLevel(pt.aqi, standard);
                  return (
                    <div
                      key={pt.hourOffset}
                      className="rounded-xl border border-border/80 bg-muted/25 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{pt.label}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {pt.isMeasured ? "Measured" : "Predicted"}
                        </span>
                      </div>
                      <p className="font-display mt-2 text-2xl font-bold tabular-nums">
                        {pt.aqi}{" "}
                        <span className={`text-xs font-semibold ${lvl.colorClass}`}>
                          {lvl.name}
                        </span>
                      </p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        PM2.5: {pt.pm25} µg/m³ · PM10: {pt.pm10} µg/m³
                      </p>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 48h & 72h Multi-Day Outlook */}
          <section className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">48-Hour &amp; 72-Hour Outlook</h2>
            </div>
            {forecast.outlook48_72 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {forecast.outlook48_72.map((day) => (
                  <div key={day.day} className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {day.day}
                    </p>
                    <p className="font-display mt-1 text-xl font-bold">
                      {day.minAqi}–{day.maxAqi} AQI
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{day.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-dashed border-border bg-muted/25 p-4 text-xs text-muted-foreground">
                <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span>{forecast.unavailableReason}</span>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
