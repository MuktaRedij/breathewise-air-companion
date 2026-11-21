import { Link } from "@tanstack/react-router";
import { ArrowRight, Activity, House, Leaf, Route, Users, Wind } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { CITIES_CATALOG } from "@/constants/cities";
import { getAqiLevel } from "@/constants/aqi-standards";

const featuredTools = [
  {
    to: "/planner" as const,
    icon: Activity,
    title: "A routine that fits your day",
    description:
      "Build a practical morning, afternoon, and evening plan around your commute and habits.",
  },
  {
    to: "/indoor-air" as const,
    icon: House,
    title: "Make home feel fresher",
    description:
      "Explore ventilation, dust, cooking, and cleaning ideas for a healthier-feeling home.",
  },
  {
    to: "/travel" as const,
    icon: Route,
    title: "Compare cleaner trips",
    description:
      "See how walking, cycling, transit, and shared rides compare with a solo car trip.",
  },
  {
    to: "/impact" as const,
    icon: Leaf,
    title: "Notice the difference",
    description:
      "Track everyday actions and see transparent estimates of commute emissions avoided.",
  },
  {
    to: "/community" as const,
    icon: Users,
    title: "Take action together",
    description: "Share neighborhood observations and join local clean-air challenges.",
  },
];

const steps = [
  {
    number: "01",
    title: "Check your air",
    text: "See the reading, key pollutants, and the next part of the day at a glance.",
  },
  {
    number: "02",
    title: "Choose a small action",
    text: "Turn the information into a route, home, or outdoor plan that fits your routine.",
  },
  {
    number: "03",
    title: "Build a cleaner habit",
    text: "Keep track of the choices that make a difference for you and your neighborhood.",
  },
];

export function HomeScreen() {
  const sample = CITIES_CATALOG[0]; // New Delhi, CPCB
  const level = getAqiLevel(sample.baseAqi, sample.defaultStandard);

  return (
    <main>
      <section className="landing-hero relative isolate flex min-h-[660px] h-[min(840px,78svh)] items-end overflow-hidden bg-primary text-primary-foreground">
        <img
          src="/breathewise-city.webp"
          alt="People walking and cycling along a leafy city waterfront"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 via-primary/55 to-primary/10"
        />
        <header className="absolute inset-x-0 top-0 z-10 border-b border-primary-foreground/20">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <BrandMark />
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
                Explore
              </a>
            </nav>
            <Button asChild variant="secondary" className="shrink-0">
              <Link to="/dashboard">
                Open dashboard <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-20">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary-foreground/35 bg-primary/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
              <Wind aria-hidden="true" className="size-4" /> Air quality for everyday life
            </p>
            <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">
              Breathe better.
              <br />
              Live smarter.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/90 sm:text-xl">
              Breathe better. Live smarter. Build cleaner communities.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Clear air insights, practical daily choices, and neighborhood action—together in one
              place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/dashboard">
                  See the air dashboard <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="#how-it-works"
                className="inline-flex min-h-10 items-center gap-2 px-3 text-sm font-semibold text-primary-foreground transition-colors hover:text-primary-foreground/80"
              >
                How BreatheWise works <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          <aside
            aria-label="Example air quality reading"
            className="w-full max-w-xs rounded-xl border border-border/70 bg-card/95 p-4 text-card-foreground shadow-lg backdrop-blur-md lg:mb-1"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reference Reading · CPCB
                </p>
                <p className="mt-1 font-medium">
                  {sample.city}, {sample.country}
                </p>
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${level.badgeClass}`}
              >
                {level.name}
              </span>
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-5xl font-semibold leading-none">
                {sample.baseAqi}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">AQI</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Calibrated for{" "}
              {sample.defaultStandard === "INDIA_CPCB" ? "CPCB NAQI Standard" : "US EPA Standard"}.
            </p>
          </aside>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:py-20">
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              A clearer picture, a better next step
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Small choices start with knowing what’s in the air.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              BreatheWise brings air-quality context together with everyday actions, so information
              feels useful—not overwhelming.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
              <span className="size-2 rounded-full bg-warning" /> Preview readings are demo data,
              never live measurements.
            </p>
          </div>
          <div className="grid gap-0 sm:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="border-t border-border py-5 sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0"
              >
                <p className="font-display text-sm font-semibold text-primary">{step.number}</p>
                <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="everyday-tools" className="scroll-mt-8 bg-muted/45">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                One neighborhood, many ways to help
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
                Make clean-air habits part of your day.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">
                Explore the dashboard <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map(({ to, icon: Icon, title, description }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/35 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Explore{" "}
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

      <section className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Breathe better, together
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
              Build cleaner communities, one informed choice at a time.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Explore the sample dashboard and see how air quality, daily routines, and local action
              can work together.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link to="/dashboard">
              Open BreatheWise <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/45">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <BrandMark />
          <p>Breathe better. Live smarter. Build cleaner communities.</p>
          <p>All air readings shown here are sample demo data.</p>
        </div>
      </footer>
    </main>
  );
}
