import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

type BrandMarkProps = {
  compact?: boolean;
  tone?: "default" | "light";
};

export function BrandMark({ compact = false, tone = "default" }: BrandMarkProps) {
  const isLight = tone === "light";

  return (
    <Link
      to="/"
      aria-label="BreatheWise home"
      className={`inline-flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isLight ? "text-primary-foreground" : "text-foreground"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg shadow-xs ${
          isLight
            ? "bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/25"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <Leaf aria-hidden="true" className="size-5" />
      </span>
      {!compact ? (
        <span className="flex flex-col">
          <span className="font-display text-lg font-bold leading-none tracking-tight">
            BreatheWise
          </span>
          <span
            className={`mt-0.5 text-[10px] font-medium tracking-wide ${
              isLight ? "text-primary-foreground/75" : "text-muted-foreground"
            }`}
          >
            Air Intelligence
          </span>
        </span>
      ) : null}
    </Link>
  );
}
