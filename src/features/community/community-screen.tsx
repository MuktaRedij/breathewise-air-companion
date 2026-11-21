import { useState, useEffect, type FormEvent } from "react";
import { CheckCircle2, HeartHandshake, MapPin, Megaphone, Send, Users } from "lucide-react";

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

export function CommunityScreen() {
  const { currentAirData } = useAirQuality();

  const [reports, setReports] = useState<CommunityReportItem[]>([]);
  const [category, setCategory] = useState("Traffic Exhaust");
  const [neighborhood, setNeighborhood] = useState("");
  const [note, setNote] = useState("");
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setReports(StorageService.getCommunityReports(defaultCommunityReports));
    setJoined(StorageService.getChallengeJoined());
  }, []);

  const submitReport = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanNeighborhood = neighborhood.trim();
    const cleanNote = note.trim();

    if (!cleanNeighborhood || !cleanNote) {
      setStatus("Please enter both a specific neighborhood and an observation.");
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
    setStatus("Your observation has been persisted and added to your community feed!");
    setTimeout(() => setStatus(""), 4000);
  };

  const toggleChallenge = () => {
    const next = !joined;
    setJoined(next);
    StorageService.setChallengeJoined(next);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Community Clean Air Hub
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">
          Cleaner air is a neighborhood effort.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Crowdsource hyper-local pollution observations, join clean commuting campaigns, and foster
          neighborhood environmental awareness.
        </p>
      </header>

      {/* Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Reports Feed */}
        <section aria-labelledby="reports-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Crowdsourced Data
              </p>
              <h2 id="reports-heading" className="font-display mt-1 text-xl font-semibold">
                Neighborhood Observations ({reports.length})
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" /> Active in{" "}
              {currentAirData.city}
            </span>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {reports.map((report) => (
              <article key={report.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {report.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{report.time}</span>
                </div>
                <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <MapPin aria-hidden="true" className="size-3.5 text-primary" />{" "}
                  {report.neighborhood}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{report.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Sidebar: Submit Form & Challenge */}
        <div className="space-y-6">
          {/* Submit Observation Form */}
          <form
            onSubmit={submitReport}
            className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs"
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
                  <SelectTrigger aria-label="Category">
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
                  placeholder={`e.g. Near Metro Station / Main Road in ${currentAirData.city}`}
                  maxLength={90}
                  className="text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold text-foreground">
                What Did You Notice?
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Factual observation: visible smoke, heavy soot, dust plume..."
                  maxLength={180}
                  className="text-xs"
                />
              </label>

              <Button type="submit" className="w-full gap-2 text-xs h-9 mt-2">
                <Send aria-hidden="true" className="size-3.5" /> Submit to Neighborhood Feed
              </Button>
            </div>

            {status && (
              <p
                role="status"
                className="mt-3 text-xs text-primary font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-3.5" /> {status}
              </p>
            )}
          </form>

          {/* Clean Air Campaign Card */}
          <section className="rounded-xl bg-primary p-5 text-primary-foreground sm:p-6 shadow-xs">
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
                <Users aria-hidden="true" className="size-4" /> 148 Residents Joined
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={toggleChallenge}
                aria-pressed={joined}
                className="h-8 text-xs font-semibold"
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
