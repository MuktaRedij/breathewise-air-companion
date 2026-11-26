import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Globe,
  Info,
  LocateFixed,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { AqiGauge } from "@/components/aqi-gauge";
import { PageHeader } from "@/components/page-header";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAqiLevel } from "@/constants/aqi-standards";
import { useAirQuality } from "@/contexts/air-quality-context";
import { StorageService } from "@/services/storage.service";

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
      <PageHeader
        eyebrow="Air Quality Overview"
        meta={
          <span className="text-xs font-medium text-muted-foreground">
            · {currentAirData.country}
          </span>
        }
        title={`${currentAirData.city}, ${currentAirData.region}`}
        description={`Standard: ${standard === "INDIA_CPCB" ? "CPCB NAQI (India)" : "US EPA (Global)"} · Last updated ${currentAirData.lastUpdated}`}
        actions={
          <>
            {/* Standard Switcher */}
            <div
              role="group"
              aria-label="AQI Standard"
              className="flex rounded-lg border border-border bg-card p-1 text-xs shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setStandard("INDIA_CPCB")}
                aria-pressed={standard === "INDIA_CPCB"}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  standard === "INDIA_CPCB"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                CPCB (India)
              </button>
              <button
                type="button"
                onClick={() => setStandard("US_EPA")}
                aria-pressed={standard === "US_EPA"}
                className={`rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  standard === "US_EPA"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                US EPA
              </button>
            </div>

            {/* City Selection */}
            <Select value={selectedCityId} onValueChange={setCityId}>
              <SelectTrigger
                aria-label="Choose a city"
                className="h-9 w-full rounded-lg bg-card sm:w-[210px]"
              >
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-primary" />
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
                <div className="mt-1 border-t border-border px-2 py-1.5 pt-2 text-[11px] font-semibold uppercase text-muted-foreground">
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

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDetect}
              className="h-9 rounded-lg"
            >
              <LocateFixed aria-hidden="true" className="mr-1.5 size-4" />
              GPS
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => refreshAirData()}
              disabled={isLoading}
              aria-label="Refresh air readings"
              className="size-9 rounded-lg"
            >
              <RefreshCw
                aria-hidden="true"
                className={`size-4 ${isLoading ? "animate-spin text-primary" : ""}`}
              />
            </Button>
          </>
        }
      />

      {locationStatus ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground shadow-2xs"
        >
          <Info aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
          <span>{locationStatus}</span>
        </p>
      ) : null}

      {/* Source & Freshness Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
              currentAirData.isLive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                currentAirData.isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            {currentAirData.isLive ? "LIVE SENSOR FEED" : "VERIFIED REGIONAL BASELINE"}
          </span>
          <span className="text-xs text-muted-foreground">{currentAirData.dataSource}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Globe aria-hidden="true" className="size-3.5 text-primary" />
            <span>{standard === "INDIA_CPCB" ? "CPCB NAQI" : "US EPA"}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="size-3.5 text-primary" />
            <span>
              Dominant:{" "}
              <strong className="text-foreground">{currentAirData.dominantPollutant}</strong>
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="size-3.5 text-primary" />
            <span>{currentAirData.lastUpdated}</span>
          </span>
        </div>
      </div>

      {/* Main AQI Gauge & Trend Chart */}
      {isLoading ? (
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.4fr]">
          <Skeleton className="h-[340px] rounded-xl" />
          <Skeleton className="h-[340px] rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.4fr]">
          {/* AQI Gauge Card */}
          <Card className="overflow-hidden rounded-xl border-border shadow-2xs">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Air Quality Index
                </p>
                <CardTitle className="font-display mt-1 text-xl">{currentAirData.city}</CardTitle>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${level.badgeClass}`}
              >
                {level.name}
              </span>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <AqiGauge aqi={currentAirData.aqi} standard={standard} level={level} />

              <div className="mt-5 flex items-start gap-3 border-t border-border pt-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Wind aria-hidden="true" className="size-4" />
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">{level.healthAdvice}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {level.outdoorExerciseAdvice}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pollution Trend Chart */}
          <Card className="rounded-xl border-border shadow-2xs">
            <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {period === "today" ? "Hourly Profile" : "7-Day Historical Trajectory"}
                </p>
                <CardTitle className="font-display mt-1 text-xl">Pollution Trend</CardTitle>
              </div>
              <div className="flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
                <Button
                  type="button"
                  size="sm"
                  variant={period === "today" ? "secondary" : "ghost"}
                  onClick={() => setPeriod("today")}
                  className="h-7 px-2.5 text-xs"
                >
                  Today
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={period === "week" ? "secondary" : "ghost"}
                  onClick={() => setPeriod("week")}
                  className="h-7 px-2.5 text-xs"
                >
                  7 Days
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <ChartContainer config={chartConfig} className="aspect-auto h-[230px] w-full">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
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
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={40}
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
              <p className="mt-2 text-right text-[11px] text-muted-foreground">
                Calibrated for {currentAirData.city} ·{" "}
                {standard === "INDIA_CPCB" ? "CPCB NAQI Standard" : "US EPA Standard"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Criteria Pollutants */}
      <section aria-labelledby="pollutants-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Criteria Pollutants
            </p>
            <h2 id="pollutants-heading" className="font-display mt-1 text-2xl font-semibold">
              Atmospheric Pollutant Breakdown
            </h2>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Activity aria-hidden="true" className="size-4 text-primary" /> Hover any card for
            health impact
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {currentAirData.pollutants.map((p) => {
            const isDominant =
              currentAirData.dominantPollutant.toLowerCase().includes(p.code.toLowerCase()) ||
              (p.code === "pm25" && currentAirData.dominantPollutant.includes("PM2.5"));
            return (
              <Tooltip key={p.code}>
                <TooltipTrigger asChild>
                  <article
                    tabIndex={0}
                    className={`rounded-xl border bg-card p-4 shadow-2xs transition-colors hover:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isDominant ? "border-primary/40 ring-1 ring-primary/15" : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {p.code === "pm25" ? "PM2.5" : p.code.toUpperCase()}
                      </p>
                      {isDominant ? (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          Primary
                        </span>
                      ) : (
                        <Info aria-hidden="true" className="size-3.5 text-muted-foreground/70" />
                      )}
                    </div>
                    <p className="font-display mt-3 text-2xl font-bold tabular-nums">
                      {p.value}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {p.unit}
                      </span>
                    </p>
                    <p
                      className="mt-1 line-clamp-1 text-[11px] text-muted-foreground"
                      title={p.name}
                    >
                      {p.name}
                    </p>
                  </article>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 opacity-90">{p.healthImpact}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </section>

      {/* Outlook & Actions Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Forecast */}
        <section
          aria-labelledby="forecast-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
        >
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Diurnal Outlook
              </p>
              <h2 id="forecast-heading" className="font-display mt-1 text-xl font-semibold">
                Daily Forecast Window
              </h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Next 24h</span>
          </div>
          <div className="divide-y divide-border">
            {currentAirData.forecast.map((item) => {
              const itemLevel = getAqiLevel(item.aqi, standard);
              return (
                <div
                  key={item.period}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.period}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-bold tabular-nums ${itemLevel.badgeClass}`}
                    >
                      {item.aqi} AQI
                    </span>
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Checklist */}
        <section
          aria-labelledby="actions-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actionable Defense
              </p>
              <h2 id="actions-heading" className="font-display mt-1 text-xl font-semibold">
                Today&apos;s Recommended Steps
              </h2>
            </div>
            <span className="text-xs font-semibold text-primary">
              {completedActions.length} of {dailyActions.length} logged
            </span>
          </div>
          <div className="space-y-3">
            {dailyActions.map((action) => {
              const isDone = completedActions.includes(action.id);
              return (
                <div
                  key={action.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-muted/25 p-3.5 transition-colors hover:bg-muted/45"
                >
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        isDone ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
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
                    className="h-8 shrink-0 gap-1.5 rounded-lg text-xs"
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 aria-hidden="true" className="size-3.5 text-primary" />
                        Logged
                      </>
                    ) : (
                      "Log Action"
                    )}
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
