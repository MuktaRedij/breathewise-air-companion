import { useEffect, useState } from "react";
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { estimateAvoidedCo2Kg } from "@/lib/impact-estimates";
import { StorageService, type LoggedActionItem } from "@/services/storage.service";

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

const chartConfig = {
  avoidedKg: { label: "CO₂e Avoided (kg)", color: "var(--chart-1)" },
};

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

  const chartData = loggedItems
    .slice(0, 7)
    .reverse()
    .map((item, idx) => ({
      label: `#${idx + 1}`,
      title: item.title,
      avoidedKg: Number(item.avoidedKg.toFixed(2)),
    }));

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
      <PageHeader
        eyebrow="Sustainability Impact"
        title="Small actions, measurable progress."
        description="Track verified low-emission commute choices and monitor cumulative greenhouse gas reductions."
      />

      {/* Summary Stats */}
      <section aria-label="Impact summary" className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cumulative CO₂e Avoided
          </p>
          <p className="font-display mt-2 text-3xl font-bold tabular-nums text-primary">
            {totalAvoidedKg.toFixed(2)}{" "}
            <span className="text-sm font-normal text-muted-foreground">kg CO₂e</span>
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">Persistent cross-session impact</p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sustainable Trips Logged
          </p>
          <p className="font-display mt-2 text-3xl font-bold tabular-nums">{totalTrips}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Transit, walk, cycle, and carpool
          </p>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 shadow-2xs">
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
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
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

        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              One-Click Commute Log
            </p>
            <h2 id="action-log-heading" className="font-display mt-1 text-xl font-semibold">
              Log a Green Trip
            </h2>
          </div>
          {toastMessage ? (
            <p
              role="status"
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 aria-hidden="true" className="size-3.5" /> {toastMessage}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {defaultQuickActions.map(({ id, title, icon: Icon, avoidedKg, detail }) => (
            <article
              key={id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-2xs transition-colors hover:border-primary/35"
            >
              <div>
                <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                <p className="mt-2 text-xs font-semibold text-primary">
                  ~{avoidedKg.toFixed(2)} kg CO₂e avoided per trip
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 rounded-lg text-xs"
                onClick={() => handleLogAction(id, title, avoidedKg)}
              >
                <Sparkles aria-hidden="true" className="size-3.5" /> Log This Action
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Historical Activity Chart (visible when actions exist) */}
      {chartData.length > 0 ? (
        <Card className="rounded-xl border-border shadow-2xs">
          <CardHeader className="p-5 pb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Activity Trajectory
            </p>
            <CardTitle className="font-display mt-1 text-lg">
              Recent Logged Emissions Savings (kg CO₂e)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} width={38} fontSize={12} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(val) => <span className="font-semibold">{val} kg CO₂e</span>}
                    />
                  }
                />
                <Bar dataKey="avoidedKg" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : null}

      {/* Action History Log */}
      <section
        aria-labelledby="history-heading"
        className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History aria-hidden="true" className="size-4 text-primary" />
            <h2 id="history-heading" className="font-display text-lg font-semibold">
              Action History ({loggedItems.length})
            </h2>
          </div>
          {loggedItems.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="rounded-lg text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 aria-hidden="true" className="mr-1 size-3.5" /> Clear History
            </Button>
          ) : null}
        </div>

        {loggedItems.length > 0 ? (
          <div className="divide-y divide-border">
            {loggedItems.slice(0, 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className="shrink-0 font-bold tabular-nums text-primary">
                  +{item.avoidedKg.toFixed(2)} kg CO₂e
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
            No green actions logged yet. Log a trip from the cards above or from the Green Travel
            Advisor.
          </p>
        )}
      </section>

      {/* Milestones */}
      <section aria-labelledby="achievements-heading" className="border-t border-border pt-6">
        <p
          id="achievements-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Milestones
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              totalTrips >= 1
                ? "border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-border text-muted-foreground"
            }`}
          >
            <BadgeCheck aria-hidden="true" className="size-4" /> First Green Trip
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              totalTrips >= 5
                ? "border-emerald-500/40 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-border text-muted-foreground"
            }`}
          >
            <Bike aria-hidden="true" className="size-4" /> 5 Trips Logged (Weekly Goal)
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
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
