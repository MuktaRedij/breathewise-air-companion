import { useState } from "react";
import {
  Bike,
  BusFront,
  Car,
  Footprints,
  TrainFront,
  Users,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAirQuality } from "@/contexts/air-quality-context";
import { StorageService } from "@/services/storage.service";
import { estimateAvoidedCo2Kg, estimatedGramsPerKm, type TravelMode } from "@/lib/impact-estimates";

const modes: { id: TravelMode; label: string; icon: typeof Car; note: string; factor: number }[] = [
  { id: "walk", label: "Walk", icon: Footprints, note: "0 g CO₂e/km", factor: 0 },
  { id: "cycle", label: "Cycle", icon: Bike, note: "0 g CO₂e/km", factor: 0 },
  { id: "transit", label: "Public bus", icon: BusFront, note: "90 g/passenger-km", factor: 90 },
  { id: "metro", label: "Metro / Train", icon: TrainFront, note: "35 g/passenger-km", factor: 35 },
  { id: "carpool", label: "Carpool", icon: Users, note: "95 g/passenger-km", factor: 95 },
  { id: "car", label: "Solo car", icon: Car, note: "180 g CO₂e/km", factor: 180 },
];

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
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Green Travel Advisor
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          A better trip can start close to home.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Compare estimated passenger greenhouse gas emissions for your regular commute and evaluate
          clean alternatives.
        </p>
      </header>

      {/* Exposure vs Emission Callout */}
      {isOutdoorUnsafe && isAltActiveOutdoor && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs">
          <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
          <p>
            <strong className="text-amber-900 dark:text-amber-300">
              Health Warning for Active Travel:{" "}
            </strong>
            Outdoor AQI in {currentAirData.city} is currently{" "}
            <strong>
              {currentAirData.aqi} ({currentAirData.category})
            </strong>
            . While walking or cycling yields 0 g CO₂e, heavy breathing near traffic will
            dramatically increase pulmonary particulate intake. When AQI is elevated, electrified
            enclosed rail (Metro) or carpooling with cabin air on recirculate is the safer choice.
          </p>
        </div>
      )}

      {/* Mode Selection */}
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
              className="h-auto min-h-24 flex-col items-start justify-between whitespace-normal p-3 text-left rounded-xl shadow-xs"
            >
              <span className="flex w-full items-center justify-between">
                <Icon aria-hidden="true" className="size-5" />
                <span
                  className={`size-2 rounded-full ${usualMode === id ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
              </span>
              <span>
                <span className="block font-semibold text-xs">{label}</span>
                <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                  {note}
                </span>
              </span>
            </Button>
          ))}
        </div>
      </section>

      {/* Adjust Inputs */}
      <div className="grid gap-6 border-y border-border py-7 lg:grid-cols-[0.8fr_1.2fr]">
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
                  className="pr-12 text-sm"
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
                className="text-sm"
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
                  className="gap-2 text-xs"
                >
                  <Icon aria-hidden="true" className="size-4" /> {label}
                </Button>
              ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Selecting an alternative recalculates total avoided greenhouse gases across your weekly
            trips.
          </p>
        </section>
      </div>

      {/* Comparison Cards */}
      <section aria-labelledby="comparison-heading">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Impact Analysis
          </p>
          <h2 id="comparison-heading" className="font-display mt-1 text-2xl font-semibold">
            The Difference Adds Up
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">
              Baseline: {modes.find((m) => m.id === usualMode)?.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold tabular-nums">
              {usualKg.toFixed(1)}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Based on {oneWayKm} km × {tripsPerWeek} trips/week ({estimatedGramsPerKm[usualMode]}{" "}
              g/km)
            </p>
          </article>

          <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <p className="text-xs font-medium text-muted-foreground">
              Alternative: {modes.find((m) => m.id === alternative)?.label}
            </p>
            <p className="font-display mt-2 text-3xl font-bold tabular-nums">
              {alternativeKg.toFixed(1)}{" "}
              <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Based on {oneWayKm} km × {tripsPerWeek} trips/week ({estimatedGramsPerKm[alternative]}{" "}
              g/km)
            </p>
          </article>

          <article className="rounded-xl border border-primary/25 bg-secondary/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Avoided Emissions
              </p>
              <p className="font-display mt-2 text-3xl font-bold tabular-nums text-primary">
                {avoidedKg.toFixed(1)} <span className="text-sm font-normal">kg CO₂e/week</span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {avoidedKg > 0
                  ? "Cumulative emissions saved every week by switching mode."
                  : "No emission reduction for this shift."}
              </p>
            </div>

            {avoidedKg > 0 && (
              <Button
                type="button"
                size="sm"
                onClick={handleLogShift}
                className="mt-4 gap-1.5 w-full text-xs"
              >
                <Sparkles className="size-3.5" /> Log This Shift to My Impact
              </Button>
            )}
          </article>
        </div>

        {loggedStatus && (
          <p className="mt-3 text-xs text-primary font-medium flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5" /> {loggedStatus}
          </p>
        )}

        <div className="mt-5 rounded-lg border border-border/80 bg-muted/20 p-3.5 text-[11px] text-muted-foreground flex items-start gap-2">
          <Info className="size-4 shrink-0 mt-0.5 text-primary" />
          <span>
            <strong>Calculation Assumptions:</strong> Solo car: 180 g CO₂e/km; Public bus: 90
            g/passenger-km; Carpool (3 passengers): 95 g/passenger-km; Metro / Electric Rail: 35
            g/passenger-km; Walking &amp; Cycling: 0 g/km. Actual emissions depend on vehicle
            efficiency, occupancy rate, and electricity grid emission factors.
          </span>
        </div>
      </section>
    </div>
  );
}
