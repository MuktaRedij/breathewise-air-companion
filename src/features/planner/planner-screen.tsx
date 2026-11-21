import { useState, type FormEvent } from "react";
import { Check, Clock3, Sun, Moon, Sunrise } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PlannerDetails = {
  occupation: string;
  commute: string;
  activity: string;
  household: string;
  preference: string;
};

export function PlannerScreen() {
  const [details, setDetails] = useState<PlannerDetails>({
    occupation: "Office-based",
    commute: "public transit",
    activity: "Light movement",
    household: "Family household",
    preference: "Low-cost options",
  });
  const [showPlan, setShowPlan] = useState(true);

  const update = (key: keyof PlannerDetails, value: string) => setDetails((current) => ({ ...current, [key]: value }));
  const createPlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPlan(true);
  };

  const plan = [
    {
      time: "Morning",
      icon: Sunrise,
      title: "Before you head out",
      action: `Check a trusted local air reading before your ${details.commute} commute; when practical, choose a route a block away from busy traffic.`,
      why: "Roadside pollution can differ from a neighborhood-wide reading, so a quieter route is a useful everyday option.",
    },
    {
      time: "Afternoon",
      icon: Sun,
      title: "A calmer mid-day reset",
      action: `${details.activity} can fit indoors if outdoor conditions are elevated or you would rather avoid the busiest streets.`,
      why: "Keeping a flexible option makes it easier to adjust your routine when conditions or schedules change.",
    },
    {
      time: "Evening",
      icon: Moon,
      title: "Wind down at home",
      action: `Use a low-cost step that works for your ${details.household.toLowerCase()}: keep cooking ventilation clear and check outdoor conditions before airing rooms.`,
      why: "Small source and ventilation checks are practical starting points; confirm current readings before acting.",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Daily planner</p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">A day that works with your air.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Shape a practical routine around your commute, movement, and household. This local preview is not personalized medical advice.</p>
      </header>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
        <span className="font-semibold text-warning">DEMO GUIDANCE</span>
        <span className="text-muted-foreground">The live air-quality and AI services are not connected yet; sample suggestions are generated in this page only.</span>
      </div>

      <form onSubmit={createPlan} className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm text-muted-foreground">Your routine</p>
          <h2 className="font-display mt-1 text-xl font-semibold">Make it yours</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your choices stay in this preview and are not saved to an account yet.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">Occupation or typical day
            <Input value={details.occupation} onChange={(event) => update("occupation", event.target.value)} placeholder="e.g. Office-based" />
          </label>
          <label className="grid gap-2 text-sm font-medium">Daily commute
            <Select value={details.commute} onValueChange={(value) => update("commute", value)}>
              <SelectTrigger aria-label="Daily commute"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public transit">Public transit</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="carpool">Carpool</SelectItem>
                <SelectItem value="driving">Driving</SelectItem>
                <SelectItem value="working from home">Working from home</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium">Movement you enjoy
            <Select value={details.activity} onValueChange={(value) => update("activity", value)}>
              <SelectTrigger aria-label="Movement you enjoy"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A morning walk">A morning walk</SelectItem>
                <SelectItem value="A bike ride">A bike ride</SelectItem>
                <SelectItem value="Outdoor exercise">Outdoor exercise</SelectItem>
                <SelectItem value="Light movement">Light movement</SelectItem>
                <SelectItem value="Indoor exercise">Indoor exercise</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium">Household
            <Select value={details.household} onValueChange={(value) => update("household", value)}>
              <SelectTrigger aria-label="Household"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Family household">Family household</SelectItem>
                <SelectItem value="Single-person household">Single-person household</SelectItem>
                <SelectItem value="Shared household">Shared household</SelectItem>
                <SelectItem value="Pet household">Pet household</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-medium sm:col-span-2">What matters most
            <Select value={details.preference} onValueChange={(value) => update("preference", value)}>
              <SelectTrigger aria-label="Lifestyle preference"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low-cost options">Low-cost options</SelectItem>
                <SelectItem value="Time-saving options">Time-saving options</SelectItem>
                <SelectItem value="Outdoor time">More outdoor time</SelectItem>
                <SelectItem value="Lower-emission choices">Lower-emission choices</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <Button type="submit" className="sm:col-span-2"><Check aria-hidden="true" /> Refresh my day</Button>
        </div>
      </form>

      <section aria-labelledby="plan-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-sm text-muted-foreground">{details.preference}</p><h2 id="plan-heading" className="font-display mt-1 text-2xl font-semibold">Your day, in three moments</h2></div>
          <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:inline-flex"><Clock3 aria-hidden="true" className="size-4" /> Flexible suggestions</span>
        </div>
        {showPlan ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {plan.map(({ time, icon: Icon, title, action, why }) => (
              <article key={time} className="rounded-md border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold text-primary">{time}</span><Icon aria-hidden="true" className="size-5 text-primary" /></div>
                <h3 className="font-display mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed">{action}</p>
                <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">Why it may help: </span>{why}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}