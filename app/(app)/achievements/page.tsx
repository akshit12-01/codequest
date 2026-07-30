"use client";

import { Trophy } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { ACHIEVEMENT_DEFS } from "@/config/achievements";
import { getAchievementProgress } from "@/lib/achievementsEngine";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { Card } from "@/components/ui/card";

export default function AchievementsPage() {
  const { state } = useAppData();
  if (!state) return null;

  const byId = new Map(state.achievements.map((a) => [a.id, a]));
  const unlockedCount = state.achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Achievements</h1>
          <p className="mt-1 text-sm text-text-muted">
            Milestones you unlock automatically as you play.
          </p>
        </div>
        <Card className="flex items-center gap-2.5 px-4 py-2.5">
          <Trophy className="size-4 text-primary-soft" />
          <span className="font-mono text-sm text-text">
            {unlockedCount}/{ACHIEVEMENT_DEFS.length}
          </span>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENT_DEFS.map((def) => {
          const achievement = byId.get(def.id) ?? {
            id: def.id,
            name: def.name,
            description: def.description,
            icon: def.icon,
            unlockedAt: null,
          };
          const status = getAchievementProgress(def, state);
          return <AchievementCard key={def.id} achievement={achievement} status={status} />;
        })}
      </div>
    </div>
  );
}
