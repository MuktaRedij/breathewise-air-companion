import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  House,
  Leaf,
  Route,
  ShieldCheck,
  Users,
  Wind,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { getAqiLevel } from "@/constants/aqi-standards";
import { CITIES_CATALOG } from "@/constants/cities";

const featuredTools = [
  {
    to: "/dashboard" as const,
    icon: Activity,
    title: "Real-time AQI & Pollutants",
    description:
      "Track PM2.5, PM10, NO₂, O₃, SO₂, and CO across Indian CPCB NAQI and US EPA scales.",
  },
  {
    to: "/planner" as const,
    icon: CalendarClock,
    title: "AI Daily Routine Planner",
    description:
      "Build a practical morning, afternoon, and evening schedule aligned with pollution peaks.",
  },
  {
    to: "/indoor-air" as const,
    icon: House,
    title: "Indoor Air Advisor",
    description:
      "Get evidence-based HEPA filtration, cooking exhaust, and safe window ventilation windows.",
  },
  {
    to: "/travel" as const,
    icon: Route,
    title: "Sustainable Travel Advisor",
    description:
      "Compare emissions and personal pollution exposure across walking, cycling, metro, and car.",
  },
  {
    to: "/impact" as const,
    icon: Leaf,
    title: "CO₂ Impact Tracker",
    description:
      "Log green trips and monitor cumulative emissions avoided with transparent assumptions.",
  },
  {
    to: "/community" as const,
    icon: Users,
    title: "Community Pollution Hub",
    description:
      "Report local smoke, dust, or traffic hotspots and join neighborhood clean-air challenges.",
  },
];

const steps = [
  {
    number: "01",
    title: "Check your local air",
    text: "Inspect the current AQI, dominant pollutant, and diurnal trajectory calibrated to your regional standard.",
  },
  {
    number: "02",
    title: "Protect your health",
    text: "Receive tailored guidance for outdoor exercise, N95 protection, and indoor HEPA filtration.",
  },
  {
    number: "03",
    title: "Act & lower emissions",
    text: "Choose lower-emission routes, log your sustainable trips, and contribute to cleaner neighborhoods.",
  },
];

export function HomeScreen() {
  const sample = CITIES_CATALOG[0]!; // New Delhi, CPCB
  const level = getAqiLevel(sample.baseAqi, sample.defaultStandard);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="landing-hero relative isolate flex min-h-[600px] items-end overflow-hidden bg-primary text-primary-foreground lg:min-h-[680px]">
        <img
          src="/breathewise-city.webp"
          alt="People walking and cycling along a leafy city waterfront"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/25"
        />

        <header className="absolute inset-x-0 top-0 z-10 border-b border-primary-foreground/15">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <BrandMark tone="light" />
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-7 text-sm font-medium md:flex"
            >
              <a
                href="#how-it-works"
                className="text-primary-foreground/85 transition-colors hover:text-primary-foreground"
              >
                How it works
              </a>
              <a
                href="#everyday-tools"
                className="text-primary-foreground/85 transition-colors hover:text-primary-foreground"
              >
                Capabilities
              </a>
            </nav>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="shrink-0 rounded-lg font-semibold"
            >
              <Link to="/dashboard">
                Open dashboard <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 px-4 pb-12 pt-28 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-20">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Wind aria-hidden="true" className="size-3.5" /> Urban Air Intelligence
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Breathe better.
              <br />
              Live smarter.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
              Understand local air pollution in real time, protect your household&apos;s health, and
              make lower-emission travel choices—guided by scientific standards and AI.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl font-semibold shadow-md"
              >
                <Link to="/dashboard">
                  Explore Air Dashboard <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
              <a
                href="#how-it-works"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                How BreatheWise works <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          {/* Transparent Air-Quality Preview Card */}
          <aside
            aria-label="Reference air quality preview"
            className="w-full max-w-xs rounded-2xl border border-border/70 bg-card/95 p-5 text-card-foreground shadow-xl backdrop-blur-md lg:mb-1"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference Baseline · CPCB
                </p>
                <p className="mt-1 font-display text-base font-semibold">
                  {sample.city}, {sample.country}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${level.badgeClass}`}
              >
                {level.name}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold leading-none tabular-nums">
                {sample.baseAqi}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                AQI
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-primary" />
              <span className="line-clamp-2">{level.healthAdvice}</span>
            </div>
          </aside>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-8 border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:py-20">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              A clearer picture, a better next step
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Informed daily choices start with knowing what&apos;s in the air.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              BreatheWise combines dual-standard air quality monitoring (CPCB NAQI &amp; US EPA)
              with practical health defense and commute emissions tracking.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
              <span className="size-2 rounded-full bg-amber-500" />
              Reference baseline data shown unless live station API keys are configured.
            </p>
          </div>
          <div className="grid gap-0 sm:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="border-t border-border py-5 sm:border-l sm:border-t-0 sm:px-6 sm:first:border-l-0"
              >
                <p className="font-display text-sm font-bold text-primary">{step.number}</p>
                <h3 className="font-display mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="everyday-tools" className="scroll-mt-8 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Complete Environmental Toolkit
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
                Make clean-air habits part of your day.
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-lg">
              <Link to="/dashboard">
                Open dashboard <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map(({ to, icon: Icon, title, description }) => (
              <Link
                key={to}
                to={to}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Open tool{" "}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-8 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Breathe better, together
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
              Build cleaner communities, one informed choice at a time.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Check your city&apos;s air quality, tailor your daily routine, and measure your
              commute carbon savings.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 rounded-xl font-semibold">
            <Link to="/dashboard">
              Launch BreatheWise <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <BrandMark />
          <p>Breathe better. Live smarter. Build cleaner communities.</p>
          <p>Supports Indian CPCB NAQI &amp; US EPA AQI standards.</p>
        </div>
      </footer>
    </main>
  );
}
