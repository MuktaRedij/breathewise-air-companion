import { useState, type FormEvent } from "react";
import { HeartHandshake, MapPin, Megaphone, Send, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Report = { id: number; category: string; neighborhood: string; note: string; time: string };

const initialReports: Report[] = [
  { id: 1, category: "Traffic", neighborhood: "Riverside", note: "Heavy vehicle traffic near the school entrance during pickup.", time: "Community sample" },
  { id: 2, category: "Smoke", neighborhood: "North Park", note: "Visible smoke reported near the community garden.", time: "Community sample" },
  { id: 3, category: "Construction", neighborhood: "Central District", note: "Dust around the temporary road works; crews were on site.", time: "Community sample" },
];

export function CommunityScreen() {
  const [reports, setReports] = useState(initialReports);
  const [category, setCategory] = useState("Traffic");
  const [neighborhood, setNeighborhood] = useState("");
  const [note, setNote] = useState("");
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState("");

  const submitReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!neighborhood.trim() || !note.trim()) {
      setStatus("Add a neighborhood and a short observation before sharing.");
      return;
    }
    setReports((current) => [{ id: Date.now(), category, neighborhood: neighborhood.trim(), note: note.trim(), time: "Just now · this tab" }, ...current]);
    setNeighborhood("");
    setNote("");
    setStatus("Your sample report has been added to this tab. It has not been sent to a shared community feed.");
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="max-w-3xl border-b border-border pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Community hub</p>
        <h1 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Cleaner air is a neighborhood effort.</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Share a local observation, follow community challenges, and make environmental awareness part of the conversation.</p>
      </header>

      <div className="flex items-start gap-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
        <span className="mt-1 size-2 shrink-0 rounded-full bg-warning" />
        <p><span className="font-semibold text-warning">DEMO COMMUNITY. </span><span className="text-muted-foreground">Reports and participation on this page are preview-only and are not verified or shared with other people.</span></p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section aria-labelledby="reports-heading">
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Local observations</p><h2 id="reports-heading" className="font-display mt-1 text-xl font-semibold">Neighborhood notes</h2></div><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin aria-hidden="true" className="size-3.5" /> Sample reports</span></div>
          <div className="divide-y divide-border border-y border-border">
            {reports.map((report) => (
              <article key={report.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">{report.category}</span><span className="text-xs text-muted-foreground">{report.time}</span></div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"><MapPin aria-hidden="true" className="size-4 text-primary" /> {report.neighborhood}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.note}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-7">
          <form onSubmit={submitReport} className="rounded-md border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary"><Megaphone aria-hidden="true" className="size-5" /></span><div><p className="text-sm text-muted-foreground">Your neighborhood</p><h2 className="font-display text-lg font-semibold">Share an observation</h2></div></div>
            <label className="mt-5 grid gap-2 text-sm font-medium">Report type
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger aria-label="Report type"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Traffic">Traffic</SelectItem><SelectItem value="Smoke">Smoke</SelectItem><SelectItem value="Construction">Construction dust</SelectItem><SelectItem value="Odor">Odor</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select>
            </label>
            <label className="mt-4 grid gap-2 text-sm font-medium">Neighborhood
              <Input value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} placeholder="e.g. Riverside" maxLength={80} />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-medium">What did you notice?
              <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="A brief, factual observation" maxLength={180} />
            </label>
            <Button type="submit" className="mt-5 w-full"><Send aria-hidden="true" /> Add to this preview</Button>
            {status ? <p role="status" className="mt-3 text-sm text-muted-foreground">{status}</p> : null}
          </form>

          <section className="rounded-md bg-primary p-5 text-primary-foreground sm:p-6">
            <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-md bg-primary-foreground/15"><HeartHandshake aria-hidden="true" className="size-5" /></span><div><p className="text-sm text-primary-foreground/75">Community challenge</p><h2 className="font-display text-lg font-semibold">A week of cleaner trips</h2></div></div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/85">Try one walk, bike, transit, or shared ride this week. Every household can choose a goal that fits.</p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-primary-foreground/20 pt-4"><span className="inline-flex items-center gap-2 text-sm"><Users aria-hidden="true" className="size-4" /> Preview challenge</span><Button type="button" variant="secondary" size="sm" onClick={() => setJoined((current) => !current)} aria-pressed={joined}>{joined ? "Joined" : "Join challenge"}</Button></div>
            {joined ? <p className="mt-3 text-xs text-primary-foreground/75">You joined for this preview only; participation is not saved.</p> : null}
          </section>
        </div>
      </div>
    </div>
  );
}