import { clamp } from "./utils";
import {
  MIN_PROJECT_XP_FLOOR_RATIO,
  PROJECT_BASE_XP,
  PROJECT_SKILL_XP_POOL,
} from "@/config/xp";

/**
 * Leveling curve: XP required to climb from level (L-1) to L is 100 + 50*L.
 * L1 -> 0, L2 -> 200, L3 -> 450, L4 -> 750, L5 -> 1100 ...
 * Matches the spec's worked example (0 / 200 / 450 / 750) and keeps growing
 * smoothly forever afterwards.
 */
export function xpDeltaForLevel(level: number): number {
  if (level <= 1) return 0;
  return 100 + 50 * level;
}

export function totalXPForLevel(level: number): number {
  let total = 0;
  for (let l = 2; l <= level; l++) total += xpDeltaForLevel(l);
  return total;
}

export function levelForTotalXP(totalXP: number): number {
  let level = 1;
  while (level < 999 && totalXPForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  percent: number;
  totalXP: number;
}

export function getLevelProgress(totalXP: number): LevelProgress {
  const safeXP = Math.max(0, totalXP);
  const level = levelForTotalXP(safeXP);
  const floor = totalXPForLevel(level);
  const ceiling = totalXPForLevel(level + 1);
  const xpIntoLevel = safeXP - floor;
  const xpForNextLevel = ceiling - floor;
  const percent =
    xpForNextLevel === 0
      ? 100
      : clamp((xpIntoLevel / xpForNextLevel) * 100, 0, 100);
  return { level, xpIntoLevel, xpForNextLevel, percent, totalXP: safeXP };
}

/** Project XP scales with the AI's overall score against a per-difficulty pool. */
export function computeProjectXP(overallScore: number, difficulty: string): number {
  const base = PROJECT_BASE_XP[difficulty] ?? PROJECT_BASE_XP.Intermediate;
  const scored = (clamp(overallScore, 0, 100) / 100) * base;
  const floor = base * MIN_PROJECT_XP_FLOOR_RATIO;
  return Math.round(Math.max(scored, floor));
}

/** Per-skill XP from a single project review, scaled the same way. */
export function computeSkillXPFromReview(
  skillScore: number,
  difficulty: string
): number {
  const pool = PROJECT_SKILL_XP_POOL[difficulty] ?? PROJECT_SKILL_XP_POOL.Intermediate;
  return Math.round((clamp(skillScore, 0, 100) / 100) * pool);
}
