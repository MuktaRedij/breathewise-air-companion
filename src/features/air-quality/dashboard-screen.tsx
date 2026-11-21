import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Globe,
  Info,
  LocateFixed,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAirQuality } from "@/contexts/air-quality-context";
import { getAqiLevel } from "@/constants/aqi-standards";
import { StorageService } from "@/services/storage.service";
import type { AqiStandard } from "@/types/air-quality.types";

const chartConfig = { aqi: { label: "AQI", color: "var(--chart-1)" } };

export function AirQualityDashboardScreen() {
  const {
    currentAirData,
    standard,
    setStandard,
    selectedCityId,
    setCityId,
    availableCities,
    detectLocation,
    refreshAirData,
    isLoading,
  } = useAirQuality();

  const [period, setPeriod] = useState<"today" | "week">("today");
  const [locationStatus, setLocationStatus] = useState("");
  const [completedActions, setCompletedActions] = useState<string[]>([]);

  const level = getAqiLevel(currentAirData.aqi, standard);
  const trend = period === "today" ? currentAirData.hourly : currentAirData.weekly;

  const handleDetect = async () => {
    setLocationStatus("Detecting location coordinates...");
    const msg = await detectLocation();
    setLocationStatus(msg);
  };

  const toggleAction = (id: string, title: string) => {
    if (completedActions.includes(id)) {
      setCompletedActions((prev) => prev.filter((item) => item !== id));
    } else {
      setCompletedActions((prev) => [...prev, id]);
      StorageService.logImpactAction({
        actionId: id,
        title,
        avoidedKg: 0.5,
      });
    }
  };

  const dailyActions = [
    {
      id: "mask",
      title:
        currentAirData.aqi > 150
          ? "Wear an N95 respirator outdoors"
          : "Choose a low-traffic commute street",
      detail:
        currentAirData.aqi > 150
          ? "Current air has high fine particulate density. Certified N95 masks block inhalable PM2.5."
          : "Spatial separation of one block from arterial roads reduces localized exhaust exposure by up to 50%.",
    },
    {
      id: "ventilation",
      title:
        currentAirData.aqi > 100
          ? "Keep windows closed & run HEPA"
          : "Open windows for midday ventilation",
      detail:
        currentAirData.aqi > 100
          ? "Outdoor air is more polluted than indoor air. Seal gaps and run mechanical air purifiers."
          : "Ventilate between 10 AM and 2 PM to refresh indoor air without rush-hour smog.",
    },
    {
      id: "transit",
      title: "Opt for electrified rail or shared transit",
      detail:
        "Mass transit minimizes urban emissions and reduces roadside personal traffic exposure.",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Air Quality Overview
            </p>
            <span className="text-xs text-muted-foreground">· {currentAirData.country}</span>
          </div>
          <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
            {currentAirData.city}, {currentAirData.region}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
            <span>
              Standard:{" "}
              <strong>{standard === "INDIA_CPCB" ? "CPCB NAQI (India)" : "US EPA (Global)"}</strong>
            </span>
            <span>· Updated: {currentAirData.lastUpdated}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Standard Switcher */}
          <div className="flex rounded-lg border border-border bg-card p-1 text-xs">
            <button
              type="button"
              onClick={() => setStandard("INDIA_CPCB")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                standard === "INDIA_CPCB"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CPCB (India)
            </button>
            <button
              type="button"
              onClick={() => setStandard("US_EPA")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                standard === "US_EPA"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              US EPA
            </button>
          </div>

          {/* City Selection */}
          <Select value={selectedCityId} onValueChange={setCityId}>
            <SelectTrigger aria-label="Choose a city" className="w-[200px] bg-card">
              <MapPin aria-hidden="true" className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground">
                Indian Metros (CPCB)
              </div>
              {availableCities
                .filter((c) => c.country === "India")
                .map((place) => (
                  <SelectItem key={place.id} value={place.id}>
                    {place.city}, {place.region}
                  </SelectItem>
                ))}
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground border-t border-border mt-1 pt-1">
                International (US EPA)
              </div>
              {availableCities
                .filter((c) => c.country !== "India")
                .map((place) => (
                  <SelectItem key={place.id} value={place.id}>
                    {place.city}, {place.country}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button type="button" variant="outline" size="sm" onClick={handleDetect} className="h-9">
            <LocateFixed aria-hidden="true" className="size-4 mr-1.5" /> GPS Location
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => refreshAirData()}
            disabled={isLoading}
            aria-label="Refresh air readings"
            className="h-9 w-9"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
          </Button>
        </div>
      </div>

      {locationStatus && (
        <p
          role="status"
          className="rounded-lg border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2"
        >
          <Info className="size-3.5 text-primary" /> {locationStatus}
        </p>
      )}

      {/* Source & Freshness Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm shadow-xs">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
              currentAirData.isLive ? "bg-good/15 text-good" : "bg-warning/15 text-warning"
            }`}
          >
            <span
              className={`size-2 rounded-full ${currentAirData.isLive ? "bg-good animate-pulse" : "bg-warning"}`}
            />
            {currentAirData.isLive ? "LIVE SENSOR FEED" : "VERIFIED REGIONAL BASELINE"}
          </span>
          <span className="text-xs text-muted-foreground">{currentAirData.dataSource}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Globe className="size-3.5 text-primary" /> Standard:{" "}
            {standard === "INDIA_CPCB" ? "CPCB NAQI" : "US EPA"}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-primary" /> Dominant:{" "}
            {currentAirData.dominantPollutant}
          </span>
        </div>
      </div>

      {/* Main AQI Gauge & Trend Chart */}
      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.4fr]">
        {/* AQI Score Card */}
        <Card className="rounded-xl border-border shadow-xs overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Air Quality Index
              </p>
              <CardTitle className="font-display mt-1 text-xl">{currentAirData.city}</CardTitle>
            </div>
            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${level.badgeClass}`}
            >
              {level.name}
            </span>
          </CardHeader>
          <CardContent className="p-5 pt-4">
            <div className="flex items-end gap-2">
              <span className="font-display text-7xl font-bold leading-none tabular-nums">
                {currentAirData.aqi}
              </span>
              <span className="pb-2 text-sm font-medium text-muted-foreground">
                AQI ({standard === "INDIA_CPCB" ? "CPCB" : "EPA"})
              </span>
            </div>

            {/* Dynamic Color Progress Bar (BUG-01 Fix) */}
            <div
              className="mt-5"
              role="progressbar"
              aria-label={`AQI rating ${currentAirData.aqi}`}
              aria-valuemin={0}
              aria-valuemax={500}
              aria-valuenow={currentAirData.aqi}
            >
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${level.bgClass}`}
                  style={{ width: `${Math.min((currentAirData.aqi / 350) * 100, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-medium text-muted-foreground">
                <span>0 (Good)</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
                <span>400+ (Severe)</span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 border-t border-border pt-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                <Wind aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">{level.healthAdvice}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {level.outdoorExerciseAdvice}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pollution Trend Chart */}
        <Card className="rounded-xl border-border shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-1">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {period === "today" ? "Hourly Profile" : "7-Day Historical Trajectory"}
              </p>
              <CardTitle className="font-display mt-1 text-xl">Pollution Trend</CardTitle>
            </div>
            <div className="flex rounded-lg border border-border p-1 bg-card text-xs">
              <Button
                type="button"
                size="sm"
                variant={period === "today" ? "secondary" : "ghost"}
                onClick={() => setPeriod("today")}
                className="h-7 text-xs px-2.5"
              >
                Today
              </Button>
              <Button
                type="button"
                size="sm"
                variant={period === "week" ? "secondary" : "ghost"}
                onClick={() => setPeriod("week")}
                className="h-7 text-xs px-2.5"
              >
                7 Days
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <ChartContainer config={chartConfig} className="h-[220px] w-full aspect-auto">
              <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
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
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={38}
                  domain={[0, "dataMax + 25"]}
                  fontSize={12}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => <span className="font-semibold">{val} AQI</span>}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fill="url(#aqiFill)"
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ChartContainer>
            <p className="mt-2 text-[11px] text-muted-foreground text-right">
              Calibrated for {currentAirData.city} ·{" "}
              {standard === "INDIA_CPCB" ? "CPCB NAQI Standard" : "US EPA Standard"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Criteria Pollutants */}
      <section aria-labelledby="pollutants-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Criteria Pollutants
            </p>
            <h2 id="pollutants-heading" className="font-display mt-1 text-2xl font-semibold">
              Atmospheric Pollutant Breakdown
            </h2>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Activity aria-hidden="true" className="size-4 text-primary" /> Measured Concentrations
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {currentAirData.pollutants.map((p, index) => {
            const Icon = index % 2 === 0 ? Wind : index % 3 === 0 ? ArrowUpRight : ArrowDownRight;
            return (
              <article
                key={p.code}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {p.code.toUpperCase()}
                  </p>
                  <Icon aria-hidden="true" className="size-3.5 text-primary" />
                </div>
                <p className="font-display mt-3 text-2xl font-bold tabular-nums">
                  {p.value}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">{p.unit}</span>
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1" title={p.name}>
                  {p.name}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Outlook & Actions Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Forecast */}
        <section
          aria-labelledby="forecast-heading"
          className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs"
        >
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Diurnal Outlook
              </p>
              <h2 id="forecast-heading" className="font-display mt-1 text-xl font-semibold">
                Daily Forecast Window
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">Next 24h</span>
          </div>
          <div className="divide-y divide-border">
            {currentAirData.forecast.map((item) => (
              <div
                key={item.period}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold text-sm">{item.period}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-bold tabular-nums">
                    {item.aqi} AQI
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Checklist */}
        <section
          aria-labelledby="actions-heading"
          className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actionable Defense
              </p>
              <h2 id="actions-heading" className="font-display mt-1 text-xl font-semibold">
                Today’s Recommended Steps
              </h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {completedActions.length} of {dailyActions.length} logged
            </span>
          </div>
          <div className="space-y-3">
            {dailyActions.map((action) => {
              const isDone = completedActions.includes(action.id);
              return (
                <div
                  key={action.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p
                      className={`font-semibold text-sm ${isDone ? "text-muted-foreground line-through" : ""}`}
                    >
                      {action.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {action.detail}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={isDone ? "secondary" : "outline"}
                    onClick={() => toggleAction(action.id, action.title)}
                    aria-pressed={isDone}
                    className="shrink-0 h-8 text-xs"
                  >
                    {isDone ? "Completed" : "Log Action"}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
