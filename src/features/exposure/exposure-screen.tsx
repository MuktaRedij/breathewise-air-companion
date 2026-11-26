import { useEffect, useState, type FormEvent } from "react";
import { Activity, AlertCircle, CheckCircle2, Info, ShieldCheck, Trash2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAirQuality } from "@/contexts/air-quality-context";
import { ExposureService } from "@/services/exposure.service";
import { StorageService } from "@/services/storage.service";
import type { ExposureEntry } from "@/types/air-quality.types";

const chartConfig = {
  estimatedScore: { label: "Exposure Score", color: "var(--chart-1)" },
};

export function ExposureScreen() {
  const { currentAirData } = useAirQuality();
  const [entries, setEntries] = useState<ExposureEntry[]>([]);
  const [outdoorMinutes, setOutdoorMinutes] = useState("45");
  const [commuteMinutes, setCommuteMinutes] = useState("30");
  const [activityType, setActivityType] = useState<ExposureEntry["activityType"]>("moderate");
  const [commuteMode, setCommuteMode] = useState<ExposureEntry["commuteMode"]>("metro");
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setEntries(StorageService.getExposureEntries());
  }, []);

  const latest = entries[0] ?? null;

  const handleCalculate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const outMin = Number(outdoorMinutes);
    const comMin = Number(commuteMinutes);
    if (
      isNaN(outMin) ||
      isNaN(comMin) ||
      outMin < 0 ||
      comMin < 0 ||
      (outMin === 0 && comMin === 0)
    ) {
      setStatus({
        type: "error",
        text: "Please enter at least 1 minute of outdoor or commute duration.",
      });
      return;
    }

    const entry = ExposureService.calculateExposure({
      airData: currentAirData,
      activityType,
      commuteMode,
      outdoorMinutes: outMin,
      commuteMinutes: comMin,
    });

    const updated = StorageService.addExposureEntry(entry);
    setEntries(updated);
    setStatus({
      type: "success",
      text: `Logged relative exposure estimate: ${entry.estimatedScore} (${entry.exposureBand}).`,
    });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleClear = () => {
    StorageService.clearExposureEntries();
    setEntries([]);
  };

  const chartData = entries
    .slice(0, 7)
    .reverse()
    .map((e, i) => ({
      label: `#${i + 1} (${e.city.slice(0, 3)})`,
      estimatedScore: e.estimatedScore,
    }));

  const tips = latest ? ExposureService.getReductionTips(latest) : [];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Personal Exposure Score"
        title="Estimate your daily pollution intake."
        description={`Combine ambient AQI & PM2.5 in ${currentAirData.city} with your outdoor duration, exertion intensity, and commute shielding.`}
      />

      {/* Explicit Medical Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/35 p-4 text-xs text-muted-foreground">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          <strong>Informational Estimate Only:</strong> BreatheWise calculates a{" "}
          <em>relative pollution exposure score (1–100)</em> from ambient city readings and your
          logged activity duration. This is not a medical diagnosis or a wearable personal dosimeter
          measurement.
        </span>
      </div>

      {/* Form + Score Overview */}
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleCalculate}
          noValidate
          className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold">
            Log Today&apos;s Activity &amp; Commute
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Using active ambient conditions in {currentAirData.city} (AQI {currentAirData.aqi}).
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold">
              Outdoor Duration (min)
              <Input
                type="number"
                min="0"
                max="720"
                value={outdoorMinutes}
                onChange={(e) => setOutdoorMinutes(e.target.value)}
                className="rounded-lg text-sm"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-semibold">
              Commute Duration (min)
              <Input
                type="number"
                min="0"
                max="360"
                value={commuteMinutes}
                onChange={(e) => setCommuteMinutes(e.target.value)}
                className="rounded-lg text-sm"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-semibold">
              Activity Exertion
              <Select
                value={activityType}
                onValueChange={(v) => setActivityType(v as ExposureEntry["activityType"])}
              >
                <SelectTrigger aria-label="Activity exertion" className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light / Resting (1.0×)</SelectItem>
                  <SelectItem value="moderate">Moderate Walk (1.8×)</SelectItem>
                  <SelectItem value="vigorous">Vigorous Jog / Cycle (3.2×)</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-1.5 text-xs font-semibold">
              Commute Mode
              <Select
                value={commuteMode}
                onValueChange={(v) => setCommuteMode(v as ExposureEntry["commuteMode"])}
              >
                <SelectTrigger aria-label="Commute mode" className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metro">Metro / Enclosed Rail</SelectItem>
                  <SelectItem value="car">Car (Recirculate)</SelectItem>
                  <SelectItem value="carpool">Carpool</SelectItem>
                  <SelectItem value="transit">Public Bus</SelectItem>
                  <SelectItem value="walk">Walking</SelectItem>
                  <SelectItem value="cycle">Cycling</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>

          <Button type="submit" className="mt-5 w-full gap-2 rounded-lg text-xs">
            <Activity aria-hidden="true" className="size-4" /> Calculate &amp; Log Exposure Score
          </Button>

          {status ? (
            <p
              role="status"
              className={`mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                status.type === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              {status.type === "error" ? (
                <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
              ) : (
                <CheckCircle2 aria-hidden="true" className="size-3.5 shrink-0" />
              )}
              <span>{status.text}</span>
            </p>
          ) : null}
        </form>

        {/* Latest Exposure Score Card */}
        <section className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6">
          {latest ? (
            <>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Latest Relative Exposure Estimate
                    </p>
                    <h2 className="font-display mt-1 text-xl font-semibold">{latest.city}</h2>
                  </div>
                  <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {latest.exposureBand} Exposure
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold tabular-nums text-primary">
                    {latest.estimatedScore}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">/ 100 index</span>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Influencing Factors:</p>
                  {latest.factors.map((f) => (
                    <p key={f}>• {f}</p>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-primary/20 bg-secondary/45 p-3.5 text-xs">
                <p className="flex items-center gap-1.5 font-semibold text-primary">
                  <ShieldCheck aria-hidden="true" className="size-4" /> Reduction Guidance
                </p>
                <p className="mt-1 leading-relaxed text-foreground">{tips[0]}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center text-xs text-muted-foreground">
              <Activity aria-hidden="true" className="mb-2 size-7 text-primary/60" />
              <p className="font-medium text-foreground">No exposure entries logged yet.</p>
              <p className="mt-1 max-w-xs">
                Submit your outdoor and commute duration on the left to compute your first relative
                exposure estimate.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Weekly Trend Chart & History */}
      {entries.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-xl border-border shadow-2xs">
            <CardHeader className="p-5 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent Trajectory
              </p>
              <CardTitle className="font-display mt-1 text-lg">
                Logged Exposure Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <ChartContainer config={chartConfig} className="aspect-auto h-[210px] w-full">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--color-border)"
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={35}
                    domain={[0, 100]}
                    fontSize={11}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="estimatedScore" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <section className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Saved Logs ({entries.length})</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 aria-hidden="true" className="mr-1 size-3.5" /> Clear
              </Button>
            </div>
            <div className="divide-y divide-border">
              {entries.slice(0, 6).map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2.5 text-xs">
                  <div>
                    <p className="font-semibold">
                      {e.city} · {e.outdoorMinutes}m outdoor + {e.commuteMinutes}m {e.commuteMode}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(e.timestamp).toLocaleString()} · AQI {e.aqiAtTime}
                    </p>
                  </div>
                  <span className="font-bold tabular-nums text-primary">
                    {e.estimatedScore} ({e.exposureBand})
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
