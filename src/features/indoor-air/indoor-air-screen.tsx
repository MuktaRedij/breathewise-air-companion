import { useState } from "react";
import { CookingPot, Fan, House, Sparkles, Wind } from "lucide-react";

import { Button } from "@/components/ui/button";
import { demoAirQuality } from "@/lib/breathewise-demo";

const sourceAdvice = {
  cooking: {
    label: "Cooking",
    icon: CookingPot,
    suggestion: "Use an extractor fan that vents outdoors when available, and keep it running during cooking. A lid can also help reduce particles from high-heat cooking.",
    reason: "Cooking can add particles and moisture to indoor air; source ventilation helps move them outside.",
  },
  cleaning: {
    label: "Cleaning products",
    icon: Sparkles,
    suggestion: "Use only the amount on the label, ventilate the area when outdoor conditions allow, and never mix cleaning products.",
    reason: "Some products release vapors; following label directions and avoiding mixtures are practical first steps.",
  },
  dust: {
    label: "Dust and textiles",
    icon: House,
    suggestion: "Damp-dust surfaces and wash bedding regularly. If using a vacuum, choose a well-sealed model with a suitable filter when available.",
    reason: "Gentle dust removal can reduce how much settled material is stirred back into the room.",
  },
  traffic: {
    label: "Nearby traffic",
    icon: Wind,
    suggestion: "Check a current outdoor reading before opening windows. When traffic is heavy, consider airing rooms at a quieter time if conditions are otherwise suitable.",
    reason: "Outdoor pollution can vary by street and time of day; a live local reading is more useful than a general schedule.",
  },
} as const;

type SourceKey = keyof typeof sourceAdvice;

export function IndoorAirScreen() {
  const [selectedSources, setSelectedSources] = useState<SourceKey[]>(["cooking"]);
  const sampleAqi = demoAirQuality.portland.aqi;

  const toggleSource = (key: SourceKey) => {
    setSelectedSources((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Indoor air assistant</p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">A fresher-feeling home, one source at a time.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Explore practical ventilation, dust, and source-control ideas. Recommendations are general information, not a substitute for professional advice.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-md bg-primary p-6 text-primary-foreground sm:p-7">
          <div className="flex size-11 items-center justify-center rounded-md bg-primary-foreground/15"><House aria-hidden="true" className="size-5" /></div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary-foreground/75">Ventilation check · sample only</p>
          <h2 className="font-display mt-2 text-2xl font-semibold">Start with what’s happening outside.</h2>
          <p className="mt-3 leading-relaxed text-primary-foreground/85">The Portland sample reads AQI {sampleAqi}. It is not live and should not guide a real ventilation decision; confirm current local air quality first.</p>
          <div className="mt-5 flex items-center gap-2 rounded-md border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-2 text-sm">
            <Fan aria-hidden="true" className="size-4 shrink-0" /> Use kitchen and bathroom exhaust fans when available.
          </div>
        </section>

        <section aria-labelledby="sources-heading" className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Select what sounds familiar</p>
            <h2 id="sources-heading" className="font-display mt-1 text-xl font-semibold">Possible indoor sources</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(sourceAdvice) as SourceKey[]).map((key) => {
              const item = sourceAdvice[key];
              const Icon = item.icon;
              const selected = selectedSources.includes(key);
              return (
                <Button key={key} type="button" variant={selected ? "secondary" : "outline"} aria-pressed={selected} onClick={() => toggleSource(key)}>
                  <Icon aria-hidden="true" /> {item.label}
                </Button>
              );
            })}
          </div>
          {selectedSources.length > 0 ? (
            <div className="divide-y divide-border border-y border-border">
              {selectedSources.map((key) => (
                <article key={key} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-semibold">{sourceAdvice[key].label}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{sourceAdvice[key].suggestion}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">Why: </span>{sourceAdvice[key].reason}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">Choose a source above to see relevant suggestions.</p>
          )}
        </section>
      </div>

      <section className="grid gap-4 border-t border-border pt-7 md:grid-cols-3">
        <article className="border-l-2 border-primary pl-4"><h3 className="font-display font-semibold">Air purifier guidance</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">If choosing a purifier, compare room size, clean-air delivery rate, filter replacement cost, and noise. Avoid devices that intentionally generate ozone.</p></article>
        <article className="border-l-2 border-accent pl-4"><h3 className="font-display font-semibold">Dust management</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Damp cleaning and regular filter maintenance are low-cost starting points. Follow product and appliance instructions.</p></article>
        <article className="border-l-2 border-warning pl-4"><h3 className="font-display font-semibold">Keep context in mind</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Weather, outdoor pollution, pets, and the building itself all affect indoor air. These sample suggestions cannot identify a specific hazard.</p></article>
      </section>
    </div>
  );
}