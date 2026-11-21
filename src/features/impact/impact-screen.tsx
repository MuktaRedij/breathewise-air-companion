import { useState } from "react";
import { BadgeCheck, Bike, BusFront, Leaf, Route, Sparkles, TrainFront } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { estimateAvoidedCo2Kg } from "@/lib/impact-estimates";

const impactActions = [
  { id: "metro", title: "Swap a 6 km car trip for metro", icon: TrainFront, avoidedKg: estimateAvoidedCo2Kg("car", "metro", 6, 1) },
  { id: "carpool", title: "Share a 6 km ride instead of driving solo", icon: BusFront, avoidedKg: estimateAvoidedCo2Kg("car", "carpool", 6, 1) },
  { id: "walk", title: "Walk a 2 km trip instead of driving", icon: Bike, avoidedKg: estimateAvoidedCo2Kg("car", "walk", 2, 1) },
];

export function ImpactScreen() {
  const [loggedActions, setLoggedActions] = useState(0);
  const [estimatedKg, setEstimatedKg] = useState(0);
  const weeklyProgress = Math.min((loggedActions / 5) * 100, 100);
  const monthlyProgress = Math.min((loggedActions / 20) * 100, 100);

  const logAction = (avoidedKg: number) => {
    setLoggedActions((count) => count + 1);
    setEstimatedKg((total) => total + avoidedKg);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Sustainability impact</p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Small actions, visible progress.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Log a sustainable commute choice and see an estimate based on clear, simple assumptions.</p>
      </header>

      <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
        <span className="mt-1 size-2 shrink-0 rounded-full bg-warning" />
        <p><span className="font-semibold text-warning">Preview tracker. </span><span className="text-muted-foreground">Actions stay in this tab and reset when you leave. Emissions are estimates, not measured outcomes.</span></p>
      </div>

      <section aria-label="Impact summary" className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-md border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Estimated CO₂e avoided</p><p className="font-display mt-3 text-3xl font-semibold tabular-nums">{estimatedKg.toFixed(2)} <span className="text-sm font-medium text-muted-foreground">kg</span></p></article>
        <article className="rounded-md border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Sustainable trips logged</p><p className="font-display mt-3 text-3xl font-semibold tabular-nums">{loggedActions}</p></article>
        <article className="rounded-md border border-border bg-card p-5"><p className="text-sm text-muted-foreground">Green actions completed</p><p className="font-display mt-3 text-3xl font-semibold tabular-nums">{loggedActions}</p></article>
      </section>

      <section className="grid gap-6 border-y border-border py-7 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">This tab · weekly goal</p><h2 className="font-display mt-1 text-lg font-semibold">5 sustainable trips</h2></div><Route aria-hidden="true" className="size-5 text-primary" /></div>
          <Progress value={weeklyProgress} className="mt-5 h-2.5" aria-label="Weekly goal progress" />
          <p className="mt-2 text-sm text-muted-foreground">{loggedActions} of 5 trips logged in this preview.</p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">This tab · monthly goal</p><h2 className="font-display mt-1 text-lg font-semibold">20 sustainable trips</h2></div><Leaf aria-hidden="true" className="size-5 text-primary" /></div>
          <Progress value={monthlyProgress} className="mt-5 h-2.5" aria-label="Monthly goal progress" />
          <p className="mt-2 text-sm text-muted-foreground">{loggedActions} of 20 trips logged in this preview.</p>
        </div>
      </section>

      <section aria-labelledby="action-log-heading">
        <div className="mb-4"><p className="text-sm text-muted-foreground">Build a streak, not a perfect record</p><h2 id="action-log-heading" className="font-display mt-1 text-xl font-semibold">Log a green trip</h2></div>
        <div className="grid gap-3 lg:grid-cols-3">
          {impactActions.map(({ id, title, icon: Icon, avoidedKg }) => (
            <article key={id} className="flex flex-col justify-between gap-5 rounded-md border border-border bg-card p-5">
              <div><span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary"><Icon aria-hidden="true" className="size-5" /></span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm text-muted-foreground">About {avoidedKg.toFixed(2)} kg CO₂e avoided per trip, estimated.</p></div>
              <Button type="button" variant="outline" onClick={() => logAction(avoidedKg)}><Sparkles aria-hidden="true" /> Log this action</Button>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="achievements-heading" className="border-t border-border pt-7">
        <div className="mb-4"><p className="text-sm text-muted-foreground">A little encouragement</p><h2 id="achievements-heading" className="font-display mt-1 text-xl font-semibold">Milestones</h2></div>
        <div className="flex flex-wrap gap-3">
          <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${loggedActions >= 1 ? "border-good/40 bg-good/10 text-good" : "border-border text-muted-foreground"}`}><BadgeCheck aria-hidden="true" className="size-4" /> First green trip</div>
          <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${loggedActions >= 5 ? "border-good/40 bg-good/10 text-good" : "border-border text-muted-foreground"}`}><Bike aria-hidden="true" className="size-4" /> Five trips logged</div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Estimate basis: solo car 180 g CO₂e/passenger-km, metro 35, carpool 95, and walking 0. Actual travel emissions vary.</p>
      </section>
    </div>
  );
}