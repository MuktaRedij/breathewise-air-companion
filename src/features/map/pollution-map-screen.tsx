import { useMemo, useState } from "react";
import { Globe, Info, MapPin, Search, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAqiLevel, getLevelsForStandard } from "@/constants/aqi-standards";
import { CITIES_CATALOG } from "@/constants/cities";
import { useAirQuality } from "@/contexts/air-quality-context";
import type { CityCatalogItem } from "@/types/air-quality.types";

function getMarkerHex(aqi: number): string {
  if (aqi <= 50) return "#10b981";
  if (aqi <= 100) return "#14b8a6";
  if (aqi <= 200) return "#f59e0b";
  if (aqi <= 300) return "#f97316";
  if (aqi <= 400) return "#e11d48";
  return "#991b1b";
}

export function PollutionMapScreen() {
  const { selectedCityId, setCityId, standard, currentAirData } = useAirQuality();
  const [regionFilter, setRegionFilter] = useState<"all" | "india" | "global">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedCity, setInspectedCity] = useState<CityCatalogItem>(
    () =>
      CITIES_CATALOG.find((c) => c.id === selectedCityId) ?? (CITIES_CATALOG[0] as CityCatalogItem),
  );

  const filteredStations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CITIES_CATALOG.filter((c) => {
      const matchesRegion =
        regionFilter === "all" ||
        (regionFilter === "india" && c.country === "India") ||
        (regionFilter === "global" && c.country !== "India");
      const matchesQuery =
        !q ||
        c.city.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q);
      return matchesRegion && matchesQuery;
    });
  }, [regionFilter, searchQuery]);

  const levels = getLevelsForStandard(standard);
  const inspectedLevel = getAqiLevel(inspectedCity.baseAqi, standard);

  // Project lat/lng onto an SVG coordinate space [0..800] x [0..380]
  const projectPoint = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 760 + 20;
    const y = ((90 - lat) / 180) * 340 + 20;
    return { x, y };
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Interactive Pollution Map"
        title="Regional & City Air Quality Spatial View"
        description="Explore verified monitoring city nodes with color-coded AQI overlays, pollutant readouts, and transparent data source status."
      />

      {/* Graceful Google Maps Tile Fallback Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-800 dark:text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-500" />
            SPATIAL BASELINE VIEW
          </span>
          <span className="text-muted-foreground">
            Showing cataloged monitoring locations only. Connect{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
              GOOGLE_MAPS_AIR_QUALITY_API_KEY
            </code>{" "}
            for live heatmap tiles.
          </span>
        </div>
        <span className="text-muted-foreground">Updated: {currentAirData.lastUpdated}</span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "all", label: `All Locations (${CITIES_CATALOG.length})` },
              { id: "india", label: "India (CPCB)" },
              { id: "global", label: "International (EPA)" },
            ] as const
          ).map((tab) => (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={regionFilter === tab.id ? "default" : "outline"}
              onClick={() => setRegionFilter(tab.id)}
              className="h-9 rounded-lg text-xs"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city or region..."
            aria-label="Search monitoring locations"
            className="h-9 rounded-lg pl-9 text-xs"
          />
        </div>
      </div>

      {/* Main Map + Inspector Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        {/* Interactive Spatial Map */}
        <section className="rounded-xl border border-border bg-card p-4 shadow-2xs sm:p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <Globe aria-hidden="true" className="size-4 text-primary" /> Color-Coded AQI Overlay
            </span>
            <span>Click any node to inspect</span>
          </div>

          {filteredStations.length === 0 ? (
            <div className="flex h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
              <MapPin aria-hidden="true" className="mb-2 size-6 text-muted-foreground/60" />
              <p>No cataloged monitoring locations match &ldquo;{searchQuery}&rdquo;.</p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-border/80 bg-muted/25">
              <svg
                viewBox="0 0 800 380"
                className="h-[320px] w-full select-none sm:h-[360px]"
                role="img"
                aria-label="Interactive air quality monitoring locations map"
              >
                {/* Subtle coordinate grid */}
                {[95, 190, 285].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="800"
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-border"
                  />
                ))}
                {[160, 320, 480, 640].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="380"
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-border"
                  />
                ))}

                {filteredStations.map((station) => {
                  const { x, y } = projectPoint(station.coordinates.lat, station.coordinates.lng);
                  const isSelected = inspectedCity.id === station.id;
                  const fill = getMarkerHex(station.baseAqi);

                  return (
                    <g
                      key={station.id}
                      onClick={() => setInspectedCity(station)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`${station.city}, AQI ${station.baseAqi}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setInspectedCity(station);
                        }
                      }}
                    >
                      {/* Heatmap halo */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 26 : 18}
                        fill={fill}
                        fillOpacity={0.22}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 10 : 7}
                        fill={fill}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="fill-foreground text-[10px] font-semibold"
                      >
                        {station.city} ({station.baseAqi})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-[11px]">
            <span className="font-semibold text-muted-foreground">Legend:</span>
            {levels.map((lvl) => (
              <span
                key={lvl.name}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${lvl.badgeClass}`}
              >
                {lvl.name} ({lvl.min}–{lvl.max})
              </span>
            ))}
          </div>
        </section>

        {/* Station Details Panel */}
        <aside className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs sm:p-6">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Selected Location
                </p>
                <h2 className="font-display mt-1 text-2xl font-bold">{inspectedCity.city}</h2>
                <p className="text-xs text-muted-foreground">
                  {inspectedCity.region}, {inspectedCity.country}
                </p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${inspectedLevel.badgeClass}`}
              >
                {inspectedLevel.name}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold tabular-nums">
                {inspectedCity.baseAqi}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                AQI ({inspectedCity.defaultStandard === "INDIA_CPCB" ? "CPCB" : "EPA"})
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                <p className="text-muted-foreground">PM2.5</p>
                <p className="font-display mt-1 text-base font-bold">
                  {inspectedCity.pollutants.pm25} µg/m³
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                <p className="text-muted-foreground">PM10</p>
                <p className="font-display mt-1 text-base font-bold">
                  {inspectedCity.pollutants.pm10} µg/m³
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                <p className="text-muted-foreground">NO₂</p>
                <p className="font-display mt-1 text-base font-bold">
                  {inspectedCity.pollutants.no2} ppb
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/25 p-3">
                <p className="text-muted-foreground">O₃</p>
                <p className="font-display mt-1 text-base font-bold">
                  {inspectedCity.pollutants.o3} ppb
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Coordinates: {inspectedCity.coordinates.lat.toFixed(2)},{" "}
                {inspectedCity.coordinates.lng.toFixed(2)} · Verified Catalog Baseline
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setCityId(inspectedCity.id)}
            disabled={selectedCityId === inspectedCity.id}
            className="mt-6 w-full gap-2 rounded-lg text-xs"
          >
            <ShieldCheck aria-hidden="true" className="size-4" />
            {selectedCityId === inspectedCity.id
              ? "Active City Across BreatheWise"
              : `Set ${inspectedCity.city} as Active City`}
          </Button>
        </aside>
      </div>
    </div>
  );
}
