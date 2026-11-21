import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  Check,
  Clock3,
  Sun,
  Moon,
  Sunrise,
  Sparkles,
  MapPin,
  ShieldAlert,
  Leaf,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Daily Routine Planner
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          A day that works with your air.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Personalized daily routine dynamically harmonized with real ambient air quality in{" "}
          <strong>{currentAirData.city}</strong> (AQI {currentAirData.aqi} ·{" "}
          {currentAirData.category}).
        </p>
      </header>

      {/* Context Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-xs shadow-xs">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <MapPin className="size-4 text-primary" /> Active Location: {currentAirData.city},{" "}
          {currentAirData.country}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>
            AQI:{" "}
            <strong>
              {currentAirData.aqi} ({currentAirData.category})
            </strong>
          </span>
          <span>· Persistent Profile Enabled</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile &amp; Habits
          </p>
          <h2 className="font-display mt-1 text-xl font-semibold">Customize Your Lifestyle</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            BreatheWise aligns your physical movement and commuting with pollution peaks so you
            minimize pulmonary particle intake.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-xs font-semibold text-foreground">
            Occupation or Typical Day
            <Input
              value={formState.occupation}
              onChange={(e) => updateField("occupation", e.target.value)}
              placeholder="e.g. Office worker, Field engineer"
              className="text-sm"
            />
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-foreground">
            Daily Commute Method
            <Select value={formState.commute} onValueChange={(v) => updateField("commute", v)}>
              <SelectTrigger aria-label="Daily commute">
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
              <SelectTrigger aria-label="Preferred movement">
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
              <SelectTrigger aria-label="Household setting">
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
              <SelectTrigger aria-label="Primary focus">
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

          <Button type="submit" className="sm:col-span-2 gap-2" disabled={isGenerating}>
            <Check aria-hidden="true" className="size-4" />
            {isGenerating
              ? "Synthesizing Environmental Plan..."
              : "Save Preferences & Regenerate Plan"}
          </Button>
        </div>
      </form>

      {/* Routine Presentation */}
      <section aria-labelledby="plan-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Harmonized Schedule
            </p>
            <h2 id="plan-heading" className="font-display mt-1 text-2xl font-semibold">
              Today’s Daily Plan for {currentAirData.city}
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 aria-hidden="true" className="size-4 text-primary" /> Generated{" "}
            {plan?.generatedAt || "Just now"}
          </span>
        </div>

        {plan && (
          <div className="grid gap-5 lg:grid-cols-3">
            {plan.moments.map((moment) => {
              const Icon = getMomentIcon(moment.time);
              const isCaution = moment.safetyRating === "Caution";
              const isAvoid = moment.safetyRating === "Avoid Outdoor";

              return (
                <article
                  key={moment.time}
                  className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {moment.time}
                      </span>
                      <Icon aria-hidden="true" className="size-5 text-primary" />
                    </div>

                    <h3 className="font-display mt-3 text-lg font-semibold">{moment.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground">{moment.action}</p>

                    <div className="mt-4 space-y-2 border-t border-border pt-3 text-[11px]">
                      {/* Personal Defense */}
                      <div className="flex items-start gap-1.5 text-muted-foreground">
                        <ShieldAlert className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-foreground">Health Defense:</strong>{" "}
                          {moment.personalExposureDefense}
                        </span>
                      </div>

                      {/* Ecological Benefit */}
                      <div className="flex items-start gap-1.5 text-muted-foreground">
                        <Leaf className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-foreground">Emissions Impact:</strong>{" "}
                          {moment.ecologicalBenefit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Outdoor Safety:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md ${
                        isAvoid
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : isCaution
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {moment.safetyRating}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
