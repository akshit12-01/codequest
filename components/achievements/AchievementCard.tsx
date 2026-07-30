import * as icons from "lucide-react";
import { Lock, type LucideIcon } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Achievement } from "@/types";
import type { ConditionStatus } from "@/lib/achievementsEngine";
import { Progress } from "@/components/ui/progress";

export function AchievementCard({
  achievement,
  status,
}: {
  achievement: Achievement;
  status: ConditionStatus;
}) {
  const unlocked = !!achievement.unlockedAt;
  const Icon = (icons as unknown as Record<string, LucideIcon>)[achievement.icon] ?? icons.Award;
  const clampedCurrent = Math.min(status.current, status.target);

  return (
    <div
      className={cn(
        "animate-rise-in relative overflow-hidden rounded-xl border p-4 transition-colors",
        unlocked ? "border-primary/30 bg-primary/5" : "border-border bg-surface-2/60"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg border",
            unlocked
              ? "border-primary/40 bg-primary/15 text-primary-soft"
              : "border-border-strong bg-surface-3 text-text-faint"
          )}
        >
          {unlocked ? <Icon className="size-5" /> : <Lock className="size-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("font-medium", unlocked ? "text-text" : "text-text-muted")}>
            {achievement.name}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">{achievement.description}</p>
          {unlocked ? (
            <p className="mt-1.5 text-[11px] text-primary-soft">
              Unlocked {formatRelativeTime(achievement.unlockedAt)}
            </p>
          ) : (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[11px] text-text-faint">
                <span>
                  {clampedCurrent}/{status.target}
                </span>
              </div>
              <Progress value={(clampedCurrent / status.target) * 100} className="mt-1 h-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
