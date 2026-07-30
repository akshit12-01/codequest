import type { AppState, Achievement } from "@/types";
import {
  ACHIEVEMENT_DEFS,
  type AchievementDef,
  type AchievementCondition,
} from "@/config/achievements";

export interface ConditionStatus {
  met: boolean;
  current: number;
  target: number;
}

/**
 * The one place that knows how to read a condition against state. Both
 * unlock-checking (evaluateAchievements) and progress display (the
 * Achievements page) call this, so there is exactly one copy of every
 * threshold number.
 */
function evaluateCondition(condition: AchievementCondition, state: AppState): ConditionStatus {
  switch (condition.type) {
    case "topicsCompleted":
      return {
        met: state.completedTopics.length >= condition.target,
        current: state.completedTopics.length,
        target: condition.target,
      };
    case "projectsSubmitted":
      return {
        met: state.projects.length >= condition.target,
        current: state.projects.length,
        target: condition.target,
      };
    case "totalXP":
      return {
        met: state.totalXP >= condition.target,
        current: state.totalXP,
        target: condition.target,
      };
    case "anyProjectReviewed": {
      const has = state.projects.some((p) => p.status === "reviewed");
      return { met: has, current: has ? 1 : 0, target: 1 };
    }
    case "level":
      return { met: state.level >= condition.target, current: state.level, target: condition.target };
    case "skillLevel": {
      const level = state.skills[condition.skillId]?.level ?? 0;
      return { met: level >= condition.target, current: level, target: condition.target };
    }
    case "streak": {
      const best = Math.max(state.streak.current, state.streak.best);
      return { met: best >= condition.target, current: best, target: condition.target };
    }
  }
}

export function getAchievementProgress(def: AchievementDef, state: AppState): ConditionStatus {
  return evaluateCondition(def.condition, state);
}

export function evaluateAchievements(state: AppState): {
  achievements: Achievement[];
  newlyUnlocked: AchievementDef[];
} {
  const existingById = new Map(state.achievements.map((a) => [a.id, a]));
  const newlyUnlocked: AchievementDef[] = [];

  const achievements: Achievement[] = ACHIEVEMENT_DEFS.map((def) => {
    const existing = existingById.get(def.id);
    if (existing?.unlockedAt) return existing;

    const status = evaluateCondition(def.condition, state);
    if (status.met) {
      newlyUnlocked.push(def);
      return {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        unlockedAt: new Date().toISOString(),
      };
    }

    return (
      existing ?? {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        unlockedAt: null,
      }
    );
  });

  return { achievements, newlyUnlocked };
}
