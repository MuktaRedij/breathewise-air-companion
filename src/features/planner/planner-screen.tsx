import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Check,
  Clock3,
  Home,
  Leaf,
  MapPin,
  Moon,
  ShieldAlert,
  Sparkles,
  Sun,
  Sunrise,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAirQuality } from "@/contexts/air-quality-context";
import { AiService } from "@/services/ai.service";
import type { DailyRoutinePlan } from "@/types/ai.types";

export function PlannerScreen() {
  const { currentAirData, profile, updateProfile } = useAirQuality();

  const [formState, setFormState] = useState({
    occupation: profile.occupation,
    commute: profile.commute,
    activity: profile.activity,
    household: profile.household,
    preference: profile.preference,
  });

  const [plan, setPlan] = useState<DailyRoutinePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedNotice, setSavedNotice] = useState("");

  const fetchPlan = useCallback(async () => {
    setIsGenerating(true);
    try {
      const generated = await AiService.generateDailyRoutine(
        { ...profile, ...formState },
        currentAirData,
      );
      setPlan(generated);
    } finally {
      setIsGenerating(false);
    }
  }, [profile, formState, currentAirData]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(formState);
    setSavedNotice("Preferences saved. Routine updated for your profile.");
    setTimeout(() => setSavedNotice(""), 3500);
    fetchPlan();
  };

  const updateField = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const getMomentIcon = (time: string) => {
    switch (time) {
      case "Morning":
        return Sunrise;
      case "Afternoon":
        return Sun;
      default:
        return Moon;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="AI Daily Routine Planner"
        title="A day that works with your air."
        description={`Personalized daily routine harmonized with ambient air quality in ${currentAirData.city} (AQI ${currentAirData.aqi} · ${currentAirData.category}).`}
        meta={
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            <MapPin aria-hidden="true" className="size-3 text-primary" />
            {currentAirData.city}
          </span>
        }
      />

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile &amp; Habits
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold">Customize Your Lifestyle</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            BreatheWise aligns your physical movement, commute timing, and household protection with
            diurnal pollution shifts to minimize particulate inhalation.
          </p>
          {savedNotice ? (
            <p
              role="status"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
            >
              <Check aria-hidden="true" className="size-3.5" /> {savedNotice}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-semibold text-foreground">
            Occupation or Typical Day
            <Input
              value={formState.occupation}
              onChange={(e) => updateField("occupation", e.target.value)}
              placeholder="e.g. Office worker, Field engineer"
              className="rounded-lg text-sm"
            />
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-foreground">
            Daily Commute Method
            <Select value={formState.commute} onValueChange={(v) => updateField("commute", v)}>
              <SelectTrigger aria-label="Daily commute" className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public transit">Public Transit / Bus</SelectItem>
                <SelectItem value="metro / train">Metro / Electric Rail</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="carpool">Carpool</SelectItem>
                <SelectItem value="driving solo">Driving Solo</SelectItem>
                <SelectItem value="working from home">Work from Home</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-foreground">
            Preferred Movement / Exercise
            <Select value={formState.activity} onValueChange={(v) => updateField("activity", v)}>
              <SelectTrigger aria-label="Preferred movement" className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Outdoor running / jogging">Outdoor Jogging / Running</SelectItem>
                <SelectItem value="A morning walk">Morning Walk</SelectItem>
                <SelectItem value="Cycling workout">Cycling Workout</SelectItem>
                <SelectItem value="Light movement">Light Movement / Yoga</SelectItem>
                <SelectItem value="Indoor gym workout">Indoor Gym Workout</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-foreground">
            Household Setting
            <Select value={formState.household} onValueChange={(v) => updateField("household", v)}>
              <SelectTrigger aria-label="Household setting" className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Family with young children">
                  Family with Young Children
                </SelectItem>
                <SelectItem value="Family with elderly members">Household with Elderly</SelectItem>
                <SelectItem value="Single-person apartment">Single-Person Apartment</SelectItem>
                <SelectItem value="Shared student / roommate home">
                  Shared Flat / Roommates
                </SelectItem>
                <SelectItem value="Pet household">Pet Household</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-foreground sm:col-span-2">
            Primary Environmental Focus
            <Select
              value={formState.preference}
              onValueChange={(v) => updateField("preference", v)}
            >
              <SelectTrigger aria-label="Primary focus" className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal respiratory protection">
                  Maximize Personal Respiratory Defense
                </SelectItem>
                <SelectItem value="Low-emission choices">
                  Lowest Carbon Emissions (Eco-Impact)
                </SelectItem>
                <SelectItem value="Low-cost options">Affordable, Low-Cost Measures</SelectItem>
                <SelectItem value="Time-saving options">Time-Saving Practical Tweaks</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <Button type="submit" className="gap-2 rounded-lg sm:col-span-2" disabled={isGenerating}>
            <Check aria-hidden="true" className="size-4" />
            {isGenerating
              ? "Synthesizing Environmental Plan..."
              : "Save Preferences & Regenerate Plan"}
          </Button>
        </div>
      </form>

      {/* Routine Timeline */}
      <section aria-labelledby="plan-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Harmonized Schedule
            </p>
            <h2 id="plan-heading" className="font-display mt-1 text-2xl font-semibold">
              Today&apos;s Daily Plan for {currentAirData.city}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {plan ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium">
                <Sparkles aria-hidden="true" className="size-3 text-primary" />
                {plan.isAiGenerated ? "Gemini AI" : "Scientific Rule Engine"}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" className="size-3.5 text-primary" />
              {plan?.generatedAt || "Just now"}
            </span>
          </div>
        </div>

        {/* Overall Guidance Banner */}
        {plan?.overallGuidance && !isGenerating ? (
          <div className="rounded-xl border border-primary/20 bg-secondary/45 px-4 py-3 text-xs leading-relaxed text-foreground">
            <strong className="font-semibold text-primary">Daily Summary: </strong>
            {plan.overallGuidance}
          </div>
        ) : null}

        {isGenerating ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <Skeleton className="h-[290px] rounded-xl" />
            <Skeleton className="h-[290px] rounded-xl" />
            <Skeleton className="h-[290px] rounded-xl" />
          </div>
        ) : plan ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {plan.moments.map((moment) => {
              const Icon = getMomentIcon(moment.time);
              const isCaution = moment.safetyRating === "Caution";
              const isAvoid = moment.safetyRating === "Avoid Outdoor";

              return (
                <article
                  key={moment.time}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs transition-colors hover:border-primary/35 sm:p-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <Icon aria-hidden="true" className="size-4" />
                        {moment.time}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {isAvoid ? (
                          <>
                            <Home aria-hidden="true" className="size-2.5" /> Indoor Focus
                          </>
                        ) : (
                          "Outdoor / Transit"
                        )}
                      </span>
                    </div>

                    <h3 className="font-display mt-3 text-lg font-semibold">{moment.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground">{moment.action}</p>

                    <div className="mt-4 space-y-2.5 border-t border-border pt-3.5 text-[11px]">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <ShieldAlert
                          aria-hidden="true"
                          className="mt-0.5 size-3.5 shrink-0 text-amber-500"
                        />
                        <span>
                          <strong className="text-foreground">Health Defense:</strong>{" "}
                          {moment.personalExposureDefense}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Leaf
                          aria-hidden="true"
                          className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        />
                        <span>
                          <strong className="text-foreground">Emissions Impact:</strong>{" "}
                          {moment.ecologicalBenefit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-[11px]">
                    <span className="font-medium text-muted-foreground">Outdoor Safety</span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-semibold ${
                        isAvoid
                          ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          : isCaution
                            ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {moment.safetyRating}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}
