import { useState } from "react";
import {
  AlertTriangle,
  Bike,
  BusFront,
  Car,
  CheckCircle2,
  Footprints,
  Info,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { useAirQuality } from "@/contexts/air-quality-context";
import { estimateAvoidedCo2Kg, estimatedGramsPerKm, type TravelMode } from "@/lib/impact-estimates";
import { StorageService } from "@/services/storage.service";

const modes: {
  id: TravelMode;
  label: string;
  icon: typeof Car;
  note: string;
  factor: number;
  exposureRisk: string;
}[] = [
  {
    id: "walk",
    label: "Walk",
    icon: Footprints,
    note: "0 g CO₂e/km",
    factor: 0,
    exposureRisk: "High if AQI > 150",
  },
  {
    id: "cycle",
    label: "Cycle",
    icon: Bike,
    note: "0 g CO₂e/km",
    factor: 0,
    exposureRisk: "High if AQI > 150",
  },
  {
    id: "metro",
    label: "Metro / Train",
    icon: TrainFront,
    note: "35 g/pkm",
    factor: 35,
    exposureRisk: "Low (enclosed)",
  },
  {
    id: "transit",
    label: "Public bus",
    icon: BusFront,
    note: "90 g/pkm",
    factor: 90,
    exposureRisk: "Moderate",
  },
  {
    id: "carpool",
    label: "Carpool",
    icon: Users,
    note: "95 g/pkm",
    factor: 95,
    exposureRisk: "Low (recirculate)",
  },
  {
    id: "car",
    label: "Solo car",
    icon: Car,
    note: "180 g CO₂e/km",
    factor: 180,
    exposureRisk: "Low (recirculate)",
  },
];

const chartConfig = {
  kg: { label: "Weekly CO₂e (kg)", color: "var(--chart-1)" },
};

export function TravelScreen() {
  const { currentAirData, profile, updateProfile } = useAirQuality();

  const [usualMode, setUsualMode] = useState<TravelMode>("car");
  const [alternative, setAlternative] = useState<TravelMode>("metro");
  const [distance, setDistance] = useState(String(profile.commuteDistanceKm || 6));
  const [trips, setTrips] = useState("10");
  const [loggedStatus, setLoggedStatus] = useState("");

  const oneWayKm = Math.max(0, Number(distance) || 0);
  const tripsPerWeek = Math.max(0, Number(trips) || 0);

  const avoidedKg = estimateAvoidedCo2Kg(usualMode, alternative, oneWayKm, tripsPerWeek);
  const usualKg = Math.max(0, (estimatedGramsPerKm[usualMode] * oneWayKm * tripsPerWeek) / 1000);
  const alternativeKg = Math.max(
    0,
    (estimatedGramsPerKm[alternative] * oneWayKm * tripsPerWeek) / 1000,
  );

  const chartData = modes.map((m) => ({
    mode: m.label,
    id: m.id,
    kg: Number(((m.factor * oneWayKm * tripsPerWeek) / 1000).toFixed(2)),
  }));

  const handleDistanceChange = (val: string) => {
    setDistance(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      updateProfile({ commuteDistanceKm: num });
    }
  };

  const handleLogShift = () => {
    if (avoidedKg <= 0) return;
    const item = StorageService.logImpactAction({
      actionId: `travel-shift-${usualMode}-to-${alternative}`,
      title: `Swapped ${usualMode} for ${alternative} (${oneWayKm} km × ${tripsPerWeek} trips)`,
      avoidedKg,
    });
    setLoggedStatus(
      `Saved! Added ${avoidedKg.toFixed(2)} kg CO₂e avoided to your Impact Tracker (${item.length} total actions).`,
    );
  };

  const isOutdoorUnsafe = currentAirData.aqi > 150;
  const isAltActiveOutdoor = alternative === "walk" || alternative === "cycle";

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Green Travel Advisor"
        title="A better trip can start close to home."
        description="Compare weekly passenger emissions and personal pollution exposure across commute modes."
      />

      {/* Exposure vs Emission Callout */}
      {isOutdoorUnsafe && isAltActiveOutdoor ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-xs leading-relaxed">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p>
            <strong className="text-amber-900 dark:text-amber-300">
              Personal Exposure Warning:{" "}
            </strong>
            Outdoor AQI in {currentAirData.city} is currently{" "}
            <strong>
              {currentAirData.aqi} ({currentAirData.category})
            </strong>
            . Walking or cycling emits 0 g CO₂e, but heavy breathing near traffic elevates lung
            particle intake. Prefer enclosed electrified rail (Metro) or carpooling with cabin air
            on recirculate today.
          </p>
        </div>
      ) : null}

      {/* Baseline Mode Selection */}
      <section aria-labelledby="usual-mode-heading">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Baseline
          </p>
          <h2 id="usual-mode-heading" className="font-display mt-1 text-xl font-semibold">
            How do you usually commute?
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {modes.map(({ id, label, icon: Icon, note }) => (
            <Button
              key={id}
              type="button"
              variant={usualMode === id ? "secondary" : "outline"}
              aria-pressed={usualMode === id}
              onClick={() => setUsualMode(id)}
              className={`h-auto min-h-24 flex-col items-start justify-between whitespace-normal rounded-xl p-3.5 text-left shadow-2xs ${
                usualMode === id ? "border-primary/40 ring-1 ring-primary/20" : ""
              }`}
            >
              <span className="flex w-full items-center justify-between">
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <span
                  className={`size-2 rounded-full ${
                    usualMode === id ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              </span>
              <span>
                <span className="block text-xs font-semibold">{label}</span>
                <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                  {note}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </section>

      {/* Route Parameters & Alternative Selection */}
      <div className="grid gap-6 rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trip Parameters
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold">Adjust Your Route</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="grid gap-1.5 text-xs font-semibold text-foreground">
              One-Way Distance
              <span className="relative">
                <Input
                  type="number"
                  min="0"
                  max="200"
                  step="0.5"
                  value={distance}
                  onChange={(e) => handleDistanceChange(e.target.value)}
                  aria-label="One-way distance in kilometers"
                  className="rounded-lg pr-12 text-sm"
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-muted-foreground">
                  km
                </span>
              </span>
            </label>

            <label className="grid gap-1.5 text-xs font-semibold text-foreground">
              One-Way Trips Per Week
              <Input
                type="number"
                min="0"
                max="30"
                step="1"
                value={trips}
                onChange={(e) => setTrips(e.target.value)}
                aria-label="One-way trips per week"
                className="rounded-lg text-sm"
              />
            </label>
          </div>
        </section>

        <section aria-labelledby="alternative-heading">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cleaner Alternative
            </p>
            <h2 id="alternative-heading" className="font-display mt-1 text-xl font-semibold">
              Compare Against Alternative
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {modes
              .filter((mode) => mode.id !== usualMode)
              .map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={alternative === id ? "default" : "outline"}
                  aria-pressed={alternative === id}
                  onClick={() => setAlternative(id)}
                  className="h-9 gap-2 rounded-lg text-xs"
                >
                  <Icon aria-hidden="true" className="size-4" /> {label}
                </Button>
              ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/45 p-3 text-xs text-muted-foreground">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              Exposure check for <strong>{modes.find((m) => m.id === alternative)?.label}</strong>:{" "}
              <strong className="text-foreground">
                {modes.find((m) => m.id === alternative)?.exposureRisk}
              </strong>
              . Emission savings are calculated separately from personal air intake.
            </span>
          </div>
        </section>
      </div>

      {/* Comparison Cards + Bar Chart */}
      <section aria-labelledby="comparison-heading" className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Impact Analysis
          </p>
          <h2 id="comparison-heading" className="font-display mt-1 text-2xl font-semibold">
            The Difference Adds Up
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
            <p className="text-xs font-medium text-muted-foreground">
              Baseline: {modes.find((m) => m.id === usualMode)?.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold tabular-nums">
              {usualKg.toFixed(1)}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {oneWayKm} km × {tripsPerWeek} trips/week ({estimatedGramsPerKm[usualMode]} g/km)
            </p>
          </article>

          <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
            <p className="text-xs font-medium text-muted-foreground">
              Alternative: {modes.find((m) => m.id === alternative)?.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold tabular-nums">
              {alternativeKg.toFixed(1)}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {oneWayKm} km × {tripsPerWeek} trips/week ({estimatedGramsPerKm[alternative]} g/km)
            </p>
          </article>

          <article className="flex flex-col justify-between rounded-xl border border-primary/25 bg-secondary/70 p-5 shadow-2xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Avoided Emissions
              </p>
              <p className="font-display mt-2 text-3xl font-bold tabular-nums text-primary">
                {avoidedKg.toFixed(1)} <span className="text-sm font-normal">kg CO₂e/week</span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {avoidedKg > 0
                  ? "Cumulative emissions avoided every week by switching mode."
                  : "No emission reduction for this shift."}
              </p>
            </div>

            {avoidedKg > 0 ? (
              <Button
                type="button"
                size="sm"
                onClick={handleLogShift}
                className="mt-4 w-full gap-1.5 rounded-lg text-xs"
              >
                <Sparkles aria-hidden="true" className="size-3.5" /> Log This Shift to My Impact
              </Button>
            ) : null}
          </article>
        </div>

        {loggedStatus ? (
          <p
            role="status"
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
          >
            <CheckCircle2 aria-hidden="true" className="size-3.5" /> {loggedStatus}
          </p>
        ) : null}

        {/* Emissions Comparison Chart */}
        <Card className="rounded-xl border-border shadow-2xs">
          <CardHeader className="p-5 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mode Comparison
            </p>
            <CardTitle className="font-display mt-1 text-lg">
              Weekly CO₂e Emissions by Transport Mode ({oneWayKm} km × {tripsPerWeek} trips)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="mode" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} width={40} fontSize={12} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => <span className="font-semibold">{val} kg CO₂e</span>}
                    />
                  }
                />
                <Bar dataKey="kg" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={
                        entry.id === alternative
                          ? "var(--color-primary)"
                          : entry.id === usualMode
                            ? "var(--color-chart-2)"
                            : "var(--color-muted-foreground)"
                      }
                      fillOpacity={entry.id === alternative || entry.id === usualMode ? 0.95 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 rounded-xl border border-border/80 bg-muted/25 p-3.5 text-[11px] text-muted-foreground">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            <strong>Calculation Assumptions:</strong> Solo car: 180 g CO₂e/km; Public bus: 90
            g/passenger-km; Carpool (3 passengers): 95 g/passenger-km; Metro / Electric Rail: 35
            g/passenger-km; Walking &amp; Cycling: 0 g/km. Actual emissions depend on vehicle
            efficiency, occupancy rate, and grid emission factors.
          </span>
        </div>
      </section>
    </div>
  );
}
