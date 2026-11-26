import { useState } from "react";
import {
  AlertTriangle,
  CookingPot,
  Fan,
  House,
  Info,
  Layers,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useAirQuality } from "@/contexts/air-quality-context";
import { AiService } from "@/services/ai.service";

export function IndoorAirScreen() {
  const { currentAirData, profile } = useAirQuality();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const adviceList = AiService.generateIndoorAirAdvice(currentAirData, profile);
  const isOutdoorElevated = currentAirData.aqi > 100;
  const hasSensitiveMembers =
    profile.household.toLowerCase().includes("child") ||
    profile.household.toLowerCase().includes("elderly");

  const categories = [
    { id: "all", label: "All Sources", icon: Layers },
    { id: "cooking", label: "Cooking & Gas", icon: CookingPot },
    { id: "ventilation", label: "Ventilation", icon: Wind },
    { id: "purification", label: "HEPA Filtration", icon: Fan },
    { id: "cleaning", label: "Dust & Cleaning", icon: Sparkles },
  ];

  const filteredAdvice = adviceList.filter(
    (item) => selectedCategory === "all" || item.sourceId === selectedCategory,
  );

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Indoor Air Quality Advisor"
        title="A fresh, safe home—grounded in real physics."
        description={`Scientific indoor exposure control, mechanical filtration guidelines, and ventilation checks linked to ${currentAirData.city} outdoor conditions.`}
        meta={
          hasSensitiveMembers ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              Sensitive Household Priority ({profile.household})
            </span>
          ) : null
        }
      />

      {/* Hero: Outdoor Infiltration vs Ventilation */}
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section
          className={`flex flex-col justify-between rounded-xl p-6 text-primary-foreground shadow-sm sm:p-7 ${
            isOutdoorElevated ? "bg-amber-900 dark:bg-amber-950" : "bg-primary"
          }`}
        >
          <div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
              <House aria-hidden="true" className="size-5" />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary-foreground/75">
              Active Outdoor Context · {currentAirData.city}
            </p>

            <h2 className="font-display mt-2 text-2xl font-bold leading-snug">
              {isOutdoorElevated
                ? `Outdoor AQI is ${currentAirData.aqi} (${currentAirData.category}): Keep Windows Closed`
                : `Outdoor AQI is ${currentAirData.aqi} (${currentAirData.category}): Favorable Ventilation Window`}
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-primary-foreground/90">
              {isOutdoorElevated
                ? `Fine particles (PM2.5) in ${currentAirData.city} are elevated. Opening windows will rapidly draw outdoor particulate matter indoors. Rely on mechanical True HEPA filtration and recirculating HVAC.`
                : `Outdoor air is currently cleaner than indoor baseline accumulation. A 20-minute morning or midday cross-ventilation will rapidly flush volatile organic compounds (VOCs) and indoor CO₂.`}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-2.5 text-xs">
            <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-primary-foreground" />
            <span>Always run ducted kitchen exhaust hoods during stovetop cooking.</span>
          </div>
        </section>

        {/* Source Exploration */}
        <section aria-labelledby="sources-heading" className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Source Mitigation
            </p>
            <h2 id="sources-heading" className="font-display mt-1 text-xl font-semibold">
              Indoor Pollution Controls
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
                className="h-9 gap-2 rounded-lg text-xs"
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Button>
            ))}
          </div>

          <div className="grid gap-3">
            {filteredAdvice.map((item) => (
              <article
                key={item.sourceId}
                className="rounded-xl border border-border bg-card p-4 shadow-2xs transition-colors hover:border-primary/35"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold">{item.title}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      item.priority === "High"
                        ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Priority: {item.priority}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium leading-relaxed text-foreground">
                  {item.recommendation}
                </p>

                <p className="mt-2 border-t border-border/60 pt-2 text-xs leading-relaxed text-muted-foreground">
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
        <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Fan aria-hidden="true" className="size-4" />
            <h3>True HEPA Filtration Standards</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Only mechanical True HEPA (H13/H14) filters certified to trap 99.97% of particles down
            to 0.3 µm should be used. Ensure the unit CADR matches your room size (room area in sq
            ft × 2/3 = minimum smoke CADR).
          </p>
        </article>

        <article className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle aria-hidden="true" className="size-4" />
            <h3>Ozone Device Warning</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Strictly avoid electronic air cleaners, ionizers, or ozone generators. Ozone is a toxic
            lung irritant that damages mucosal membranes and reacts with household terpenes to
            create more ultrafine particles.
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Info aria-hidden="true" className="size-4 text-primary" />
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
