import { useEffect, useState, type FormEvent } from "react";
import { Bell, BellRing, Check, CheckCircle2, Info, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES_CATALOG } from "@/constants/cities";
import { useAirQuality } from "@/contexts/air-quality-context";
import { AlertsService } from "@/services/alerts.service";
import { StorageService } from "@/services/storage.service";
import type { AlertPreferences, PollutionAlert } from "@/types/air-quality.types";

export function AlertsScreen() {
  const { currentAirData, selectedCityId } = useAirQuality();
  const [prefs, setPrefs] = useState<AlertPreferences>(() =>
    StorageService.getAlertPreferences(selectedCityId),
  );
  const [alerts, setAlerts] = useState<PollutionAlert[]>([]);
  const [saveMsg, setSaveMsg] = useState("");
  const [permNote, setPermNote] = useState("");

  useEffect(() => {
    const stored = StorageService.getPollutionAlerts();
    const { alerts: merged } = AlertsService.evaluateAndMergeAlerts(currentAirData, prefs, stored);
    setAlerts(merged);
    StorageService.savePollutionAlerts(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAirData]);

  const briefing = AlertsService.buildDailyBriefing(currentAirData);
  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleSavePrefs = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    StorageService.saveAlertPreferences(prefs);
    const { alerts: merged } = AlertsService.evaluateAndMergeAlerts(currentAirData, prefs, alerts);
    setAlerts(merged);
    StorageService.savePollutionAlerts(merged);
    setSaveMsg("Alert thresholds saved and evaluated.");
    setTimeout(() => setSaveMsg(""), 3500);
  };

  const toggleRead = (id: string) => {
    const next = alerts.map((a) => (a.id === id ? { ...a, read: !a.read } : a));
    setAlerts(next);
    StorageService.savePollutionAlerts(next);
  };

  const markAllRead = () => {
    const next = alerts.map((a) => ({ ...a, read: true }));
    setAlerts(next);
    StorageService.savePollutionAlerts(next);
  };

  const requestBrowserNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermNote("Browser notifications are not supported in this environment.");
      return;
    }
    const result = await Notification.requestPermission();
    if (result === "granted") {
      const next = { ...prefs, browserNotificationsEnabled: true };
      setPrefs(next);
      StorageService.saveAlertPreferences(next);
      setPermNote("Browser alerts enabled while the BreatheWise tab is open.");
    } else {
      setPermNote("Browser notification permission was not granted. In-app alerts remain active.");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Smart Pollution Alerts"
        title="Threshold Alerts & Daily Briefing"
        description="Configure AQI alert thresholds, review deduplicated air-quality events, and read your daily briefing."
        meta={
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            {unreadCount} Unread
          </span>
        }
      />

      {/* Daily Air-Quality Briefing */}
      <section className="rounded-xl border border-primary/25 bg-secondary/50 p-5 shadow-2xs sm:p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <BellRing aria-hidden="true" className="size-4" /> Daily Air-Quality Briefing
        </div>
        <h2 className="font-display mt-2 text-xl font-semibold">{briefing.headline}</h2>
        <p className="mt-2 text-xs leading-relaxed text-foreground">{briefing.summary}</p>
        <p className="mt-2 text-xs font-medium text-primary">
          Recommended Action: {briefing.safestAction}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Alert Preferences Form */}
        <form
          onSubmit={handleSavePrefs}
          className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6"
        >
          <h2 className="font-display text-lg font-semibold">Alert Preferences</h2>
          <div className="mt-4 space-y-4">
            <label className="grid gap-1.5 text-xs font-semibold">
              Preferred Alert City
              <Select
                value={prefs.preferredCityId}
                onValueChange={(v) => setPrefs((p) => ({ ...p, preferredCityId: v }))}
              >
                <SelectTrigger aria-label="Preferred alert city" className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES_CATALOG.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.city}, {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="grid gap-1.5 text-xs font-semibold">
              AQI Alert Threshold
              <Select
                value={String(prefs.thresholdAqi)}
                onValueChange={(v) => setPrefs((p) => ({ ...p, thresholdAqi: Number(v) }))}
              >
                <SelectTrigger aria-label="AQI threshold" className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100+ (Moderate / Satisfactory+)</SelectItem>
                  <SelectItem value="150">150+ (Sensitive Groups / Poor)</SelectItem>
                  <SelectItem value="200">200+ (Poor / Unhealthy)</SelectItem>
                  <SelectItem value="300">300+ (Very Poor / Hazardous)</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <div className="space-y-2 border-t border-border pt-3 text-xs">
              <p className="font-semibold text-foreground">Alert Categories</p>
              {(
                [
                  { key: "enablePoor", label: "Poor / Threshold Exceeded" },
                  { key: "enableVeryPoor", label: "Very Poor Air Quality (201+)" },
                  { key: "enableSevere", label: "Severe / Hazardous (301+)" },
                  { key: "enableSuddenSpike", label: "Sudden Pollution Increase (+30 AQI)" },
                ] as const
              ).map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 font-medium text-muted-foreground"
                >
                  <input
                    type="checkbox"
                    checked={prefs[key]}
                    onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                    className="size-4 rounded border-border accent-primary"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <Button type="submit" className="w-full gap-2 rounded-lg text-xs">
              <Check aria-hidden="true" className="size-4" /> Save Preferences &amp; Check Now
            </Button>

            {saveMsg ? (
              <p
                role="status"
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 aria-hidden="true" className="size-3.5" /> {saveMsg}
              </p>
            ) : null}

            <div className="border-t border-border pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={requestBrowserNotifications}
                className="w-full gap-2 rounded-lg text-xs"
              >
                <Bell aria-hidden="true" className="size-3.5" />
                {prefs.browserNotificationsEnabled
                  ? "Browser Alerts Permitted"
                  : "Enable Browser Tab Notifications"}
              </Button>
              <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  {permNote ||
                    "Browser notifications require explicit permission and only fire while open; background push servers are not configured."}
                </span>
              </p>
            </div>
          </div>
        </form>

        {/* Notification Center */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">
              Notification Center ({alerts.length})
            </h2>
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            ) : null}
          </div>

          {alerts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center text-xs text-muted-foreground">
              <ShieldAlert aria-hidden="true" className="mx-auto mb-2 size-6 text-primary/60" />
              <p>No alerts triggered for your current thresholds.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <article
                  key={alert.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    alert.read
                      ? "border-border bg-muted/20 opacity-80"
                      : "border-primary/30 bg-card"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${AlertsService.getCategoryBadgeClass(alert.category)}`}
                    >
                      {alert.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold">{alert.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {alert.message}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRead(alert.id)}
                      className="h-7 text-[11px]"
                    >
                      {alert.read ? "Mark unread" : "Mark as read"}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
