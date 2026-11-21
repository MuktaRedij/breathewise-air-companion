import { useState } from "react";
import { Bike, BusFront, Car, CircleDollarSign, Footprints, TrainFront, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { estimateAvoidedCo2Kg, estimatedGramsPerKm, type TravelMode } from "@/lib/impact-estimates";

const modes: { id: TravelMode; label: string; icon: typeof Car; note: string }[] = [
  { id: "walk", label: "Walk", icon: Footprints, note: "0 g/km in this estimate" },
  { id: "cycle", label: "Cycle", icon: Bike, note: "0 g/km in this estimate" },
  { id: "transit", label: "Public bus", icon: BusFront, note: "Shared ride estimate" },
  { id: "metro", label: "Metro", icon: TrainFront, note: "Rail passenger estimate" },
  { id: "carpool", label: "Carpool", icon: Users, note: "Shared vehicle estimate" },
  { id: "car", label: "Solo car", icon: Car, note: "Typical passenger estimate" },
];

export function TravelScreen() {
  const [usualMode, setUsualMode] = useState<TravelMode>("car");
  const [alternative, setAlternative] = useState<TravelMode>("metro");
  const [distance, setDistance] = useState("6");
  const [trips, setTrips] = useState("10");
  const oneWayKm = Number(distance);
  const tripsPerWeek = Number(trips);
  const avoidedKg = estimateAvoidedCo2Kg(usualMode, alternative, oneWayKm, tripsPerWeek);
  const usualKg = Math.max(0, estimatedGramsPerKm[usualMode] * Math.max(0, oneWayKm) * Math.max(0, tripsPerWeek) / 1000);
  const alternativeKg = Math.max(0, estimatedGramsPerKm[alternative] * Math.max(0, oneWayKm) * Math.max(0, tripsPerWeek) / 1000);

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Green travel advisor</p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">A better trip can start close to home.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Compare estimated passenger emissions for a commute and explore alternatives that fit your routine.</p>
      </header>

      <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
        <CircleDollarSign aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
        <p><span className="font-semibold text-warning">Estimate only. </span><span className="text-muted-foreground">Results use simplified per-passenger averages and do not account for your vehicle, route, occupancy, or local electricity mix.</span></p>
      </div>

      <section aria-labelledby="usual-mode-heading">
        <div className="mb-4"><p className="text-sm text-muted-foreground">Your baseline</p><h2 id="usual-mode-heading" className="font-display mt-1 text-xl font-semibold">How do you usually travel?</h2></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {modes.map(({ id, label, icon: Icon, note }) => (
            <Button key={id} type="button" variant={usualMode === id ? "secondary" : "outline"} aria-pressed={usualMode === id} onClick={() => setUsualMode(id)} className="h-auto min-h-24 flex-col items-start justify-between whitespace-normal p-3 text-left">
              <span className="flex w-full items-center justify-between"><Icon aria-hidden="true" className="size-5" /><span className="size-2 rounded-full bg-primary" data-selected={usualMode === id ? "true" : "false"} /></span>
              <span><span className="block font-semibold">{label}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{note}</span></span>
            </Button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 border-y border-border py-7 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="text-sm text-muted-foreground">Your weekly commute</p>
          <h2 className="font-display mt-1 text-xl font-semibold">Adjust the estimate</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="grid gap-2 text-sm font-medium">One-way distance
              <span className="relative"><Input type="number" min="0" max="200" step="0.5" value={distance} onChange={(event) => setDistance(event.target.value)} aria-label="One-way distance in kilometers" className="pr-14" /><span className="pointer-events-none absolute right-3 top-2.5 text-sm text-muted-foreground">km</span></span>
            </label>
            <label className="grid gap-2 text-sm font-medium">One-way trips per week
              <Input type="number" min="0" max="30" step="1" value={trips} onChange={(event) => setTrips(event.target.value)} aria-label="One-way trips per week" />
            </label>
          </div>
        </section>
        <section aria-labelledby="alternative-heading">
          <div className="mb-4"><p className="text-sm text-muted-foreground">Try an alternative</p><h2 id="alternative-heading" className="font-display mt-1 text-xl font-semibold">Compare with</h2></div>
          <div className="flex flex-wrap gap-2">
            {modes.filter((mode) => mode.id !== usualMode).map(({ id, label, icon: Icon }) => (
              <Button key={id} type="button" size="sm" variant={alternative === id ? "default" : "outline"} aria-pressed={alternative === id} onClick={() => setAlternative(id)}><Icon aria-hidden="true" /> {label}</Button>
            ))}
          </div>
        </section>
      </div>

      <section aria-labelledby="comparison-heading">
        <div className="mb-5"><p className="text-sm text-muted-foreground">Estimated weekly commute</p><h2 id="comparison-heading" className="font-display mt-1 text-2xl font-semibold">The difference adds up.</h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-md border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{modes.find((mode) => mode.id === usualMode)?.label ?? "Usual"}</p>
            <p className="font-display mt-3 text-3xl font-semibold tabular-nums">{usualKg.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">kg CO₂e</span></p>
            <p className="mt-2 text-xs text-muted-foreground">Estimated from selected distance and trips</p>
          </article>
          <article className="rounded-md border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{modes.find((mode) => mode.id === alternative)?.label ?? "Alternative"}</p>
            <p className="font-display mt-3 text-3xl font-semibold tabular-nums">{alternativeKg.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">kg CO₂e</span></p>
            <p className="mt-2 text-xs text-muted-foreground">Estimated from selected distance and trips</p>
          </article>
          <article className="rounded-md border border-primary/25 bg-secondary/70 p-5">
            <p className="text-sm font-semibold text-primary">Estimated difference</p>
            <p className="font-display mt-3 text-3xl font-semibold tabular-nums text-primary">{avoidedKg.toFixed(1)} <span className="text-sm font-medium">kg CO₂e</span></p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Approximate emissions avoided per week if every selected one-way trip changed.</p>
          </article>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Assumptions: walk 0, cycle 0, public bus 90, metro 35, carpool 95, and solo car 180 grams CO₂e per passenger-kilometer. Simplified averages; actual emissions vary by vehicle, occupancy, route, and energy source.</p>
      </section>
    </div>
  );
}