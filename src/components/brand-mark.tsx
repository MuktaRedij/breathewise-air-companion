import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="BreatheWise home"
      className="inline-flex min-w-0 items-center gap-2.5 text-foreground"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Leaf aria-hidden="true" className="size-5" />
      </span>
      {!compact ? (
        <span className="font-display text-lg font-semibold leading-none">BreatheWise</span>
      ) : null}
    </Link>
  );
}