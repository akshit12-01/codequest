"use client";
import type { XPHistoryEntry } from "@/lib/statsEngine";

export function XPHistoryChart({ history }: { history: XPHistoryEntry[] }) {
  const max = Math.max(1, ...history.map((h) => h.xpEarned));

  return (
    <div className="flex h-40 items-end gap-1.5 sm:gap-2">
      {history.map((entry) => {
        const heightPct = Math.max(3, Math.round((entry.xpEarned / max) * 100));
        const date = new Date(`${entry.date}T00:00:00`);
        const label = date.toLocaleDateString(undefined, { weekday: "narrow" });
        return (
          <div key={entry.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-primary-dim to-primary-soft transition-all"
                style={{ height: `${heightPct}%` }}
                title={`${entry.date}: +${entry.xpEarned} XP`}
              />
            </div>
            <span className="text-[10px] text-text-faint">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
