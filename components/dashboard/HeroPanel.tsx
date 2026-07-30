import { Flame } from "lucide-react";
import { getLevelProgress } from "@/lib/xpEngine";
import { getTodayXP } from "@/lib/statsEngine";
import { Progress } from "@/components/ui/progress";
import type { AppState } from "@/types";

export function HeroPanel({ state }: { state: AppState }) {
  const progress = getLevelProgress(state.totalXP);
  const todayXP = getTodayXP(state);

  return (
    <div className="panel-cut glass animate-rise-in relative overflow-hidden border border-border-strong p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-muted">Welcome back,</p>
          <h1 className="mt-0.5 text-2xl font-bold text-text sm:text-3xl">{state.username}</h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="panel-cut flex size-14 items-center justify-center border border-primary/40 bg-primary/10 font-mono text-xl font-bold text-primary-soft">
              {progress.level}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">Level</p>
              <p className="font-mono text-sm text-text">
                {progress.xpIntoLevel.toLocaleString()} / {progress.xpForNextLevel.toLocaleString()} XP
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 sm:flex-col sm:items-end">
          <div className="flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2">
            <Flame className="size-4 text-warning" />
            <div>
              <p className="font-mono text-sm font-semibold text-warning">{state.streak.current}</p>
              <p className="text-[10px] uppercase tracking-wide text-text-muted">day streak</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-semibold text-success">+{todayXP} XP</p>
            <p className="text-[10px] uppercase tracking-wide text-text-muted">today</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
          <span>Progress to level {progress.level + 1}</span>
          <span className="font-mono">{Math.round(progress.percent)}%</span>
        </div>
        <Progress value={progress.percent} className="h-3" />
      </div>
    </div>
  );
}
