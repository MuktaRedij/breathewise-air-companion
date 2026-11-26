import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Megaphone,
  Send,
  Users,
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
import { useAirQuality } from "@/contexts/air-quality-context";
import { StorageService, type CommunityReportItem } from "@/services/storage.service";

const defaultCommunityReports: CommunityReportItem[] = [
  {
    id: 1,
    category: "Traffic Exhaust",
    neighborhood: "Ring Road / Metro Junction",
    note: "Heavy diesel truck idling near the flyover ramp causing dense visible exhaust.",
    time: "2 hours ago · Community Verified",
  },
  {
    id: 2,
    category: "Biomass / Smoke",
    neighborhood: "Greenbelt Perimeter",
    note: "Agricultural garden waste burning observed. Smoke drifting toward residential apartments.",
    time: "4 hours ago · Community Verified",
  },
  {
    id: 3,
    category: "Construction Dust",
    neighborhood: "Sector 14 Development Site",
    note: "Uncovered dry cement and sand heaps without dust suppression misting.",
    time: "Yesterday · Community Verified",
  },
];

const reportCategories = [
  "All",
  "Traffic Exhaust",
  "Biomass / Smoke",
  "Construction Dust",
  "Industrial Emission",
  "General Observation",
];

export function CommunityScreen() {
  const { currentAirData } = useAirQuality();

  const [reports, setReports] = useState<CommunityReportItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [category, setCategory] = useState("Traffic Exhaust");
  const [neighborhood, setNeighborhood] = useState("");
  const [note, setNote] = useState("");
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setReports(StorageService.getCommunityReports(defaultCommunityReports));
    setJoined(StorageService.getChallengeJoined());
  }, []);

  const submitReport = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanNeighborhood = neighborhood.trim();
    const cleanNote = note.trim();

    if (!cleanNeighborhood || !cleanNote) {
      setStatus({
        type: "error",
        text: "Please enter both a neighborhood / cross street and an observation.",
      });
      return;
    }

    const updated = StorageService.addCommunityReport({
      category,
      neighborhood: `${cleanNeighborhood} (${currentAirData.city})`,
      note: cleanNote,
    });

    setReports(updated);
    setNeighborhood("");
    setNote("");
    setStatus({
      type: "success",
      text: "Your observation has been saved and added to the neighborhood feed.",
    });
    setTimeout(() => setStatus(null), 4000);
  };

  const toggleChallenge = () => {
    const next = !joined;
    setJoined(next);
    StorageService.setChallengeJoined(next);
  };

  const visibleReports = reports.filter(
    (r) => filterCategory === "All" || r.category === filterCategory,
  );

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Community Clean Air Hub"
        title="Cleaner air is a neighborhood effort."
        description="Crowdsource hyper-local pollution observations, join clean commuting campaigns, and build local awareness."
        meta={
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            <MapPin aria-hidden="true" className="size-3 text-primary" /> {currentAirData.city}
          </span>
        }
      />

      {/* Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Reports Feed */}
        <section aria-labelledby="reports-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Crowdsourced Observations
              </p>
              <h2 id="reports-heading" className="font-display mt-1 text-xl font-semibold">
                Neighborhood Feed ({visibleReports.length})
              </h2>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            {reportCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                aria-pressed={filterCategory === cat}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  filterCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {visibleReports.length > 0 ? (
            <div className="space-y-3">
              {visibleReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-2xs transition-colors hover:border-primary/35"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {report.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{report.time}</span>
                  </div>
                  <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
                    {report.neighborhood}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {report.note}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-xs text-muted-foreground">
              No observations found in the &ldquo;{filterCategory}&rdquo; category yet.
            </p>
          )}
        </section>

        {/* Sidebar: Submit Form & Challenge */}
        <div className="space-y-6">
          <form
            onSubmit={submitReport}
            noValidate
            className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Megaphone aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Citizen Reporting
                </p>
                <h2 className="font-display text-base font-semibold">Share a Local Observation</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                Category
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger aria-label="Category" className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Traffic Exhaust">Traffic Exhaust &amp; Idling</SelectItem>
                    <SelectItem value="Biomass / Smoke">Biomass / Leaf Burning</SelectItem>
                    <SelectItem value="Construction Dust">Construction / Road Dust</SelectItem>
                    <SelectItem value="Industrial Emission">Industrial Odor / Fumes</SelectItem>
                    <SelectItem value="General Observation">General Clean Air Note</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                Neighborhood / Cross Streets
                <Input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder={`e.g. Near Metro Station in ${currentAirData.city}`}
                  maxLength={90}
                  aria-invalid={status?.type === "error" && !neighborhood.trim()}
                  className="rounded-lg text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                What Did You Notice?
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Factual observation: visible smoke, heavy soot, dust plume..."
                  maxLength={180}
                  aria-invalid={status?.type === "error" && !note.trim()}
                  className="rounded-lg text-xs"
                />
              </label>

              <Button type="submit" className="mt-2 h-9 w-full gap-2 rounded-lg text-xs">
                <Send aria-hidden="true" className="size-3.5" /> Submit to Neighborhood Feed
              </Button>
            </div>

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

          {/* Clean Air Campaign Card */}
          <section className="rounded-xl bg-primary p-5 text-primary-foreground shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                <HeartHandshake aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/75">
                  Neighborhood Campaign
                </p>
                <h2 className="font-display text-base font-semibold">
                  Weekly Cleaner Commute Challenge
                </h2>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-primary-foreground/90">
              Commit to swapping at least one solo drive for public transit, walking, or cycling
              this week. Every commute shift reduces urban tailpipe emissions.
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary-foreground/20 pt-3">
              <span className="inline-flex items-center gap-1.5 text-xs">
                <Users aria-hidden="true" className="size-4" /> {joined ? 149 : 148} Residents
                Joined
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={toggleChallenge}
                aria-pressed={joined}
                className="h-8 rounded-lg text-xs font-semibold"
              >
                {joined ? "Joined ✓" : "Join Challenge"}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
