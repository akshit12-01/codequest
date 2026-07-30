"use client";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
  animateFrom,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  /** if provided, bar animates from this % to `value` on mount */
  animateFrom?: number;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const style =
    animateFrom !== undefined
      ? ({
          "--xp-from": `${animateFrom}%`,
          "--xp-to": `${pct}%`,
          width: `${pct}%`,
          animation: "xp-fill 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        } as React.CSSProperties)
      : { width: `${pct}%` };

  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-surface-3 border border-border",
        className
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full",
          barClassName ?? "bg-gradient-to-r from-primary-dim via-primary to-primary-soft"
        )}
        style={style}
      />
    </div>
  );
}
