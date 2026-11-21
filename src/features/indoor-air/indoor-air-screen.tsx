import { useState } from "react";
import {
  AlertTriangle,
  CookingPot,
  Fan,
  Flame,
  House,
  ShieldCheck,
  Sparkles,
  Wind,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAirQuality } from "@/contexts/air-quality-context";
import { AiService } from "@/services/ai.service";

export function IndoorAirScreen() {
  const { currentAirData, profile } = useAirQuality();
  const [selectedCategory, setSelectedCategory] = useState<string>("cooking");

  const adviceList = AiService.generateIndoorAirAdvice(currentAirData, profile);
  const isOutdoorElevated = currentAirData.aqi > 100;

  const categories = [
    { id: "cooking", label: "Cooking & Combustion", icon: CookingPot },
    { id: "ventilation", label: "Ventilation & Windows", icon: Wind },
    { id: "purification", label: "HEPA Air Purifiers", icon: Fan },
    { id: "cleaning", label: "Dust & Cleaning Chemicals", icon: Sparkles },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Indoor Air Quality Advisor
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          A fresh, safe home—grounded in real physics.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Scientific indoor exposure control, mechanical filtration guidelines, and real-time
          ventilation checks linked to <strong>{currentAirData.city}</strong> outdoor conditions.
        </p>
      </header>

      {/* Hero: Outdoor Infiltration vs Ventilation */}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section
          className={`rounded-xl p-6 sm:p-7 shadow-xs text-primary-foreground ${
            isOutdoorElevated ? "bg-amber-900 dark:bg-amber-950" : "bg-primary"
          }`}
        >
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary-foreground/15">
            <House aria-hidden="true" className="size-5" />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary-foreground/75">
            Active Outdoor Context · {currentAirData.city}
          </p>

          <h2 className="font-display mt-2 text-2xl font-bold">
            {isOutdoorElevated
              ? `Outdoor AQI is ${currentAirData.aqi} (${currentAirData.category}): Keep Windows Closed`
              : `Outdoor AQI is ${currentAirData.aqi} (${currentAirData.category}): Favorable Ventilation Window`}
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-primary-foreground/90">
            {isOutdoorElevated
              ? `Fine particles (PM2.5) in ${currentAirData.city} are elevated. Opening windows will rapidly draw outdoor particulate matter indoors. Rely on mechanical True HEPA filtration and recirculating HVAC.`
              : `Outdoor air is currently cleaner than indoor baseline accumulation. A 20-minute morning or midday cross-ventilation will rapidly flush volatile organic compounds (VOCs) and indoor CO2.`}
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs">
            <ShieldCheck className="size-4 shrink-0 text-primary-foreground" />
            <span>Always run kitchen exhaust hoods to the outside during stovetop cooking.</span>
          </div>
        </section>

        {/* Source Exploration */}
        <section aria-labelledby="sources-heading" className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Source Mitigation
            </p>
            <h2 id="sources-heading" className="font-display mt-1 text-xl font-semibold">
              Explore Common Indoor Pollution Sources
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                type="button"
                variant={selectedCategory === id ? "secondary" : "outline"}
                aria-pressed={selectedCategory === id}
                onClick={() => setSelectedCategory(id)}
                className="gap-2 text-xs h-9"
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Button>
            ))}
          </div>

          <div className="divide-y divide-border border-y border-border">
            {adviceList
              .filter((item) => item.sourceId === selectedCategory || selectedCategory === "all")
              .map((item) => (
                <article key={item.sourceId} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                      Priority: {item.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-foreground font-medium">
                    {item.recommendation}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Scientific Rationale: </strong>
                    {item.scientificReason}
                  </p>
                </article>
              ))}
          </div>
        </section>
      </div>

      {/* Critical Scientific Standards */}
      <section className="grid gap-4 border-t border-border pt-7 md:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Fan className="size-4" />
            <h3>True HEPA Filtration Standards</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Only mechanical True HEPA (H13/H14) filters certified to trap 99.97% of particles down
            to 0.3 µm should be used. Ensure the unit CADR matches your room size (room area in sq
            ft × 2/3 = minimum smoke CADR).
          </p>
        </article>

        <article className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <AlertTriangle className="size-4" />
            <h3>Ozone Device Warning</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Strictly avoid electronic air cleaners, ionizers, or ozone generators. Ozone is a toxic
            lung irritant that damages mucosal membranes and reacts with household terpenes to
            create more ultrafine particles.
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <Info className="size-4 text-primary" />
            <h3>The Houseplant Myth</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Scientific studies confirm houseplants have negligible impact on particulate matter in
            real homes compared to mechanical ventilation and HEPA filtration. Do not rely on plants
            as air purifiers.
          </p>
        </article>
      </section>
    </div>
  );
}
