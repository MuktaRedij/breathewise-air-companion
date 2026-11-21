import { useState, useEffect } from "react";
import {
  BadgeCheck,
  Bike,
  BusFront,
  CheckCircle2,
  History,
  Leaf,
  Route,
  Sparkles,
  TrainFront,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StorageService, type LoggedActionItem } from "@/services/storage.service";
import { estimateAvoidedCo2Kg } from "@/lib/impact-estimates";

const defaultQuickActions = [
  {
    id: "metro-commute",
    title: "Swap a 6 km car trip for metro",
    icon: TrainFront,
    avoidedKg: estimateAvoidedCo2Kg("car", "metro", 6, 1),
    detail: "Rail transit saves approx 0.87 kg CO₂e compared to solo driving.",
  },
  {
    id: "carpool-commute",
    title: "Share a 6 km carpool ride",
    icon: BusFront,
    avoidedKg: estimateAvoidedCo2Kg("car", "carpool", 6, 1),
    detail: "Splitting vehicle occupancy saves approx 0.51 kg CO₂e.",
  },
  {
    id: "walk-short-trip",
    title: "Walk a 2 km neighborhood errand",
    icon: Bike,
    avoidedKg: estimateAvoidedCo2Kg("car", "walk", 2, 1),
    detail: "Zero tailpipe emissions saves approx 0.36 kg CO₂e.",
  },
];

export function ImpactScreen() {
  const [loggedItems, setLoggedItems] = useState<LoggedActionItem[]>([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setLoggedItems(StorageService.getLoggedActions());
  }, []);

  const totalAvoidedKg = loggedItems.reduce((acc, item) => acc + (item.avoidedKg || 0), 0);
  const totalTrips = loggedItems.length;

  const weeklyProgress = Math.min((totalTrips / 5) * 100, 100);
  const monthlyProgress = Math.min((totalTrips / 20) * 100, 100);

  const handleLogAction = (actionId: string, title: string, avoidedKg: number) => {
    const updated = StorageService.logImpactAction({
      actionId,
      title,
      avoidedKg,
    });
    setLoggedItems(updated);
    setToastMessage(`Action logged! Avoided ~${avoidedKg.toFixed(2)} kg CO₂e.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleClearHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("breathewise_logged_actions");
      setLoggedItems([]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Sustainability Impact
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          Small actions, measurable progress.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Track verified low-emission commute choices and monitor your cumulative greenhouse gas
          reductions with persistent storage.
        </p>
      </header>

      {/* Summary Stats */}
      <section aria-label="Impact summary" className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cumulative CO₂e Avoided
          </p>
          <p className="font-display mt-2 text-3xl font-bold tabular-nums text-primary">
            {totalAvoidedKg.toFixed(2)}{" "}
            <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Persistent cross-session impact</p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sustainable Trips Logged
          </p>
          <p className="font-display mt-2 text-3xl font-bold tabular-nums">{totalTrips}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Transit, walk, cycle, and carpool
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sustainability Score
          </p>
          <p className="font-display mt-2 text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {Math.min(100, Math.round(totalTrips * 8 + totalAvoidedKg * 2))}
            <span className="text-sm font-normal text-muted-foreground"> / 100</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Based on trip volume and consistency
          </p>
        </article>
      </section>

      {/* Goal Progress Bars */}
      <section className="grid gap-6 border-y border-border py-7 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Weekly Target
              </p>
              <h2 className="font-display mt-1 text-base font-semibold">
                5 Sustainable Trips This Week
              </h2>
            </div>
            <Route aria-hidden="true" className="size-5 text-primary" />
          </div>
          <Progress
            value={weeklyProgress}
            className="mt-4 h-2.5"
            aria-label="Weekly goal progress"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {totalTrips} of 5 trips completed ({Math.round(weeklyProgress)}%).
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Monthly Milestone
              </p>
              <h2 className="font-display mt-1 text-base font-semibold">
                20 Sustainable Trips This Month
              </h2>
            </div>
            <Leaf aria-hidden="true" className="size-5 text-primary" />
          </div>
          <Progress
            value={monthlyProgress}
            className="mt-4 h-2.5"
            aria-label="Monthly goal progress"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {totalTrips} of 20 trips completed ({Math.round(monthlyProgress)}%).
          </p>
        </div>
      </section>

      {/* Quick Log Cards */}
      <section aria-labelledby="action-log-heading">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              One-Click Commute Log
            </p>
            <h2 id="action-log-heading" className="font-display mt-1 text-xl font-semibold">
              Log a Green Trip
            </h2>
          </div>
          {toastMessage && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="size-3.5" /> {toastMessage}
            </p>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {defaultQuickActions.map(({ id, title, icon: Icon, avoidedKg, detail }) => (
            <article
              key={id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-xs"
            >
              <div>
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <h3 className="mt-3 font-semibold text-sm">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                <p className="mt-2 text-xs font-medium text-primary">
                  ~{avoidedKg.toFixed(2)} kg CO₂e avoided per trip
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9"
                onClick={() => handleLogAction(id, title, avoidedKg)}
              >
                <Sparkles aria-hidden="true" className="size-3.5" /> Log This Action
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Action History Log */}
      <section
        aria-labelledby="history-heading"
        className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="size-4 text-primary" />
            <h2 id="history-heading" className="font-display text-lg font-semibold">
              Action History ({loggedItems.length})
            </h2>
          </div>
          {loggedItems.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5 mr-1" /> Clear History
            </Button>
          )}
        </div>

        {loggedItems.length > 0 ? (
          <div className="divide-y divide-border">
            {loggedItems.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="font-bold text-primary tabular-nums">
                  +{item.avoidedKg.toFixed(2)} kg CO₂e
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
            No green actions logged yet. Log a trip from the cards above or from the Green Travel
            Advisor.
          </p>
        )}
      </section>

      {/* Milestones */}
      <section aria-labelledby="achievements-heading" className="border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Milestones
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
              totalTrips >= 1
                ? "border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-border text-muted-foreground"
            }`}
          >
            <BadgeCheck aria-hidden="true" className="size-4" /> First Green Trip
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
              totalTrips >= 5
                ? "border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-border text-muted-foreground"
            }`}
          >
            <Bike aria-hidden="true" className="size-4" /> 5 Trips Logged (Weekly Goal)
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
              totalAvoidedKg >= 10
                ? "border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-border text-muted-foreground"
            }`}
          >
            <Leaf aria-hidden="true" className="size-4" /> 10 kg CO₂e Avoided
          </div>
        </div>
      </section>
    </div>
  );
}
