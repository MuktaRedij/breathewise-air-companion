import type { AqiScaleLevel } from "@/constants/aqi-standards";
import type { AqiStandard } from "@/types/air-quality.types";

type AqiGaugeProps = {
  aqi: number;
  standard: AqiStandard;
  level: AqiScaleLevel;
};

function getStrokeColor(aqi: number, standard: AqiStandard): string {
  if (standard === "INDIA_CPCB") {
    if (aqi <= 50) return "#10b981"; // Good (emerald)
    if (aqi <= 100) return "#14b8a6"; // Satisfactory (teal)
    if (aqi <= 200) return "#f59e0b"; // Moderate (amber)
    if (aqi <= 300) return "#f97316"; // Poor (orange)
    if (aqi <= 400) return "#e11d48"; // Very Poor (rose)
    return "#991b1b"; // Severe (deep red)
  }
  if (aqi <= 50) return "#10b981"; // Good
  if (aqi <= 100) return "#f59e0b"; // Moderate
  if (aqi <= 150) return "#f97316"; // Unhealthy for Sensitive
  if (aqi <= 200) return "#ef4444"; // Unhealthy
  if (aqi <= 300) return "#9333ea"; // Very Unhealthy (purple)
  return "#881337"; // Hazardous (maroon)
}

export function AqiGauge({ aqi, standard, level }: AqiGaugeProps) {
  const maxScale = 500;
  const clamped = Math.max(0, Math.min(maxScale, aqi));
  const ratio = clamped / maxScale;

  // Semi-circle SVG arc math
  const radius = 84;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);
  const strokeColor = getStrokeColor(aqi, standard);

  return (
    <div
      className="relative flex flex-col items-center justify-center pt-2"
      role="meter"
      aria-label={`Air Quality Index ${aqi}, ${level.name}`}
      aria-valuemin={0}
      aria-valuemax={500}
      aria-valuenow={aqi}
    >
      <svg
        viewBox="0 0 210 122"
        className="w-full max-w-[260px] overflow-visible"
        aria-hidden="true"
      >
        {/* Background track */}
        <path
          d="M 21 105 A 84 84 0 0 1 189 105"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          className="text-muted/70"
        />
        {/* Active semantic arc */}
        <path
          d="M 21 105 A 84 84 0 0 1 189 105"
          fill="none"
          stroke={strokeColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
        {/* Scale tick labels */}
        <text x="16" y="121" className="fill-muted-foreground text-[10px] font-medium">
          0
        </text>
        <text
          x="105"
          y="12"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-medium"
        >
          250
        </text>
        <text
          x="194"
          y="121"
          textAnchor="end"
          className="fill-muted-foreground text-[10px] font-medium"
        >
          500
        </text>
      </svg>

      {/* Center Readout */}
      <div className="absolute bottom-3 flex flex-col items-center text-center">
        <span className="font-display text-5xl font-bold leading-none tracking-tight tabular-nums sm:text-6xl">
          {aqi}
        </span>
        <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {standard === "INDIA_CPCB" ? "CPCB NAQI" : "US EPA AQI"}
        </span>
      </div>
    </div>
  );
}
