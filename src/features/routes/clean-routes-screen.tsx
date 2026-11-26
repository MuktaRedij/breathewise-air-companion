import { useState, type FormEvent } from "react";
import { AlertCircle, Bike, Footprints, Info, Navigation, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAirQuality } from "@/contexts/air-quality-context";
import { RoutesService } from "@/services/routes.service";
import type { CleanRouteOption } from "@/types/air-quality.types";

export function CleanRoutesScreen() {
  const { currentAirData } = useAirQuality();
  const [origin, setOrigin] = useState("Connaught Place Metro");
  const [destination, setDestination] = useState("Lodhi Gardens");
  const [mode, setMode] = useState<"walk" | "cycle">("walk");
  const [error, setError] = useState("");
  const [simulateNoPollutionData, setSimulateNoPollutionData] = useState(false);

  const [comparison, setComparison] = useState<{
    routes: CleanRouteOption[];
    limitationNotice: string;
  }>(() =>
    RoutesService.compareCleanRoutes({
      origin: "Connaught Place Metro",
      destination: "Lodhi Gardens",
      mode: "walk",
      airData: currentAirData,
    }),
  );

  const handleCompare = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError("Please enter both a starting point and a destination.");
      return;
    }
    setError("");
    const result = RoutesService.compareCleanRoutes({
      origin,
      destination,
      mode,
      airData: simulateNoPollutionData ? null : currentAirData,
    });
    setComparison(result);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="AI Clean Route Navigator"
        title="Compare Lower-Exposure Walking & Cycling Routes"
        description={`Evaluate corridor options in ${currentAirData.city} by distance, duration, and relative roadside exposure—distinct from vehicle tailpipe emissions.`}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const next = !simulateNoPollutionData;
              setSimulateNoPollutionData(next);
              if (origin.trim() && destination.trim()) {
                setComparison(
                  RoutesService.compareCleanRoutes({
                    origin,
                    destination,
                    mode,
                    airData: next ? null : currentAirData,
                  }),
                );
              }
            }}
            className="h-9 rounded-lg text-xs"
          >
            {simulateNoPollutionData ? "Use Active City AQI" : "Preview Without Pollution Data"}
          </Button>
        }
      />

      {/* Route Form */}
      <form
        onSubmit={handleCompare}
        noValidate
        className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
          <label className="grid gap-1.5 text-xs font-semibold">
            Starting Point
            <Input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Metro Station, Sector 14"
              aria-invalid={Boolean(error && !origin.trim())}
              className="rounded-lg text-sm"
            />
          </label>

          <label className="grid gap-1.5 text-xs font-semibold">
            Destination
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Central Park, Office"
              aria-invalid={Boolean(error && !destination.trim())}
              className="rounded-lg text-sm"
            />
          </label>

          <div className="flex rounded-lg border border-border bg-muted/40 p-1">
            <Button
              type="button"
              size="sm"
              variant={mode === "walk" ? "secondary" : "ghost"}
              onClick={() => setMode("walk")}
              className="h-8 gap-1.5 text-xs"
            >
              <Footprints aria-hidden="true" className="size-3.5" /> Walk
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "cycle" ? "secondary" : "ghost"}
              onClick={() => setMode("cycle")}
              className="h-8 gap-1.5 text-xs"
            >
              <Bike aria-hidden="true" className="size-3.5" /> Cycle
            </Button>
          </div>

          <Button type="submit" className="h-10 gap-2 rounded-lg text-xs">
            <Navigation aria-hidden="true" className="size-3.5" /> Compare Routes
          </Button>
        </div>

        {error ? (
          <p
            role="status"
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <AlertCircle aria-hidden="true" className="size-3.5" /> {error}
          </p>
        ) : null}
      </form>

      {/* Transparent Limitation / Methodology Notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/35 p-4 text-xs text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>{comparison.limitationNotice}</span>
      </div>

      {/* Route Comparison Cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {comparison.routes.map((route) => (
          <article
            key={route.id}
            className={`flex flex-col justify-between rounded-xl border bg-card p-5 shadow-2xs ${
              route.isRecommended ? "border-primary/45 ring-1 ring-primary/20" : "border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {route.mode === "cycle" ? "Cycling" : "Walking"} Corridor
                </span>
                {route.isRecommended ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    <ShieldCheck aria-hidden="true" className="size-3" /> Recommended
                  </span>
                ) : null}
              </div>

              <h2 className="font-display mt-2 text-lg font-semibold">{route.name}</h2>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <p className="text-muted-foreground">Distance</p>
                  <p className="font-display mt-0.5 text-base font-bold">{route.distanceKm} km</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-2.5">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-display mt-0.5 text-base font-bold">{route.durationMin} min</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-xs">
                <span className="text-muted-foreground">Relative Exposure</span>
                <span
                  className={`font-semibold ${
                    route.relativeExposureLabel === "Lower"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : route.relativeExposureLabel === "Higher"
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-foreground"
                  }`}
                >
                  {route.relativeExposureLabel}
                  {route.estimatedExposureScore !== null
                    ? ` (~${route.estimatedExposureScore} AQI eq.)`
                    : ""}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {route.explanation}
              </p>
            </div>

            <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
              Tailpipe Vehicle Emissions: <strong className="text-foreground">0 g CO₂e</strong>{" "}
              (active travel)
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
