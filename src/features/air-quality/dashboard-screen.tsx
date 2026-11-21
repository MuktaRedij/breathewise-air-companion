import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, LocateFixed, MapPin, Wind } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { demoAirQuality, demoDailyActions, getAqiCategory, type CityKey } from "@/lib/breathewise-demo";

const chartConfig = { aqi: { label: "AQI", color: "var(--chart-1)" } };

export function AirQualityDashboardScreen() {
  const [cityKey, setCityKey] = useState<CityKey>("portland");
  const [period, setPeriod] = useState<"today" | "week">("today");
  const [completed, setCompleted] = useState<string[]>([]);
  const [locationStatus, setLocationStatus] = useState("");
  const reading = demoAirQuality[cityKey];
  const category = getAqiCategory(reading.aqi);
  const trend = period === "today" ? reading.hourly : reading.weekly;
  const categoryClass = category === "Good"
    ? "bg-good/15 text-good"
    : category === "Moderate"
      ? "bg-warning/15 text-warning"
      : "bg-destructive/15 text-destructive";

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is unavailable in this browser. Choose a city to view its sample data.");
      return;
    }
    setLocationStatus("Checking your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationStatus(`Location detected (${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}). Air readings are still demo data until live lookup is connected.`);
      },
      () => setLocationStatus("Location permission was not granted. Choose a city to view its sample data."),
      { maximumAge: 60_000, timeout: 8_000 },
    );
  };

  const toggleAction = (id: string) => {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Air quality overview</p>
          <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Your air, at a glance.</h1>
          <p className="mt-2 text-muted-foreground">A simple snapshot to help shape the day ahead.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={cityKey} onValueChange={(value) => {
            if (value in demoAirQuality) setCityKey(value as CityKey);
          }}>
            <SelectTrigger aria-label="Choose a city" className="w-[190px] bg-card">
              <MapPin aria-hidden="true" className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Choose a city" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(demoAirQuality) as [CityKey, (typeof demoAirQuality)[CityKey]][]).map(([key, place]) => (
                <SelectItem key={key} value={key}>{place.city}, {place.region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={detectLocation}>
            <LocateFixed aria-hidden="true" /> Use my location
          </Button>
        </div>
      </div>

      {locationStatus ? <p role="status" className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{locationStatus}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold text-warning"><span className="size-2 rounded-full bg-warning" /> DEMO DATA · Not live</span>
        <span className="text-muted-foreground">Sample city readings for preview only; check an official local source for current conditions.</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.4fr]">
        <Card className="rounded-md border-border shadow-none">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-2">
            <div>
              <p className="text-sm text-muted-foreground">{reading.city}, {reading.region}</p>
              <CardTitle className="font-display mt-1 text-lg">Current sample</CardTitle>
            </div>
            <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${categoryClass}`}>{category}</span>
          </CardHeader>
          <CardContent className="p-5 pt-4">
            <div className="flex items-end gap-2">
              <span className="font-display text-7xl font-semibold leading-none tabular-nums">{reading.aqi}</span>
              <span className="pb-2 text-sm text-muted-foreground">AQI</span>
            </div>
            <div className="mt-5" role="progressbar" aria-label="Sample AQI on a 0 to 200 scale" aria-valuemin={0} aria-valuemax={200} aria-valuenow={reading.aqi}>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-good transition-[width]" style={{ width: `${Math.min(reading.aqi / 2, 100)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>0</span><span>100</span><span>200+</span></div>
            </div>
            <div className="mt-5 flex items-start gap-3 border-t border-border pt-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary"><Wind aria-hidden="true" className="size-4" /></span>
              <p className="text-sm leading-relaxed text-muted-foreground">This preview is not a health assessment. Confirm current local guidance before making outdoor or health decisions.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md border-border shadow-none">
          <CardHeader className="flex flex-row items-start justify-between gap-4 p-5 pb-1">
            <div>
              <p className="text-sm text-muted-foreground">{period === "today" ? "Today" : "Past 7 days"}</p>
              <CardTitle className="font-display mt-1 text-lg">Pollution trend</CardTitle>
            </div>
            <div className="flex rounded-md border border-border p-1" aria-label="Trend period">
              <Button type="button" size="sm" variant={period === "today" ? "secondary" : "ghost"} onClick={() => setPeriod("today")}>Today</Button>
              <Button type="button" size="sm" variant={period === "week" ? "secondary" : "ghost"} onClick={() => setPeriod("week")}>7 days</Button>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <ChartContainer config={chartConfig} className="h-[230px] w-full aspect-auto">
              <AreaChart data={trend} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-aqi)" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="var(--color-aqi)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} width={38} domain={[0, "dataMax + 20"]} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => <span>{value} AQI</span>} />} />
                <Area type="monotone" dataKey="aqi" stroke="var(--color-aqi)" strokeWidth={2.5} fill="url(#aqiFill)" activeDot={{ r: 4 }} />
              </AreaChart>
            </ChartContainer>
            <p className="mt-2 text-xs text-muted-foreground">Illustrative values; not a live sensor history.</p>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="pollutants-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Key readings</p>
            <h2 id="pollutants-heading" className="font-display mt-1 text-xl font-semibold">What’s in the air</h2>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex"><Activity aria-hidden="true" className="size-4" /> Sample values</span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {reading.pollutants.map((pollutant, index) => {
            const Icon = index < 2 ? Wind : index === 2 ? ArrowUpRight : ArrowDownRight;
            return (
              <article key={pollutant.name} className="rounded-md border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-muted-foreground">{pollutant.name}</p>
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                </div>
                <p className="font-display mt-4 text-2xl font-semibold tabular-nums">{pollutant.value}<span className="ml-1 text-xs font-medium text-muted-foreground">{pollutant.unit}</span></p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="forecast-heading" className="rounded-md border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-sm text-muted-foreground">Outlook</p><h2 id="forecast-heading" className="font-display mt-1 text-xl font-semibold">Today’s forecast</h2></div>
            <span className="text-xs text-muted-foreground">Sample</span>
          </div>
          <div className="divide-y divide-border">
            {reading.forecast.map((item) => (
              <div key={item.period} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div><p className="font-medium">{item.period}</p><p className="mt-1 text-sm text-muted-foreground">{item.note}</p></div>
                <span className="rounded-md bg-muted px-3 py-1.5 text-sm font-semibold tabular-nums">{item.aqi}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="actions-heading" className="rounded-md border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><p className="text-sm text-muted-foreground">Small steps</p><h2 id="actions-heading" className="font-display mt-1 text-xl font-semibold">Today’s recommended actions</h2></div>
            <span className="text-xs text-muted-foreground">{completed.length} of {demoDailyActions.length} checked</span>
          </div>
          <div className="space-y-2">
            {demoDailyActions.map((action) => {
              const isDone = completed.includes(action.id);
              return (
                <div key={action.id} className="flex items-start justify-between gap-4 rounded-md bg-muted/60 p-3">
                  <div className="min-w-0">
                    <p className={`font-medium ${isDone ? "text-muted-foreground line-through" : ""}`}>{action.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{action.detail}</p>
                  </div>
                  <Button type="button" size="sm" variant={isDone ? "secondary" : "outline"} onClick={() => toggleAction(action.id)} aria-pressed={isDone}>
                    {isDone ? "Done" : "Mark done"}
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