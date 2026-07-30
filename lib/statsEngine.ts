import type { AppState } from "@/types";
import { getAllTopics, getOverallRoadmapProgress } from "./roadmapEngine";
import { getSkillDef } from "@/config/skills";

export interface DashboardStats {
  topicsCompleted: number;
  totalTopics: number;
  projectsSubmitted: number;
  projectsReviewed: number;
  bestSkill: { name: string; level: number } | null;
  weakestSkill: { name: string; level: number } | null;
  avgProjectRating: number | null;
  avgSkillScore: number | null;
  booksEncountered: number;
  roadmapProgressPercent: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
}

export function computeDashboardStats(state: AppState): DashboardStats {
  const allTopics = getAllTopics();

  const touchedSkills = Object.values(state.skills)
    .filter((s) => s.xp > 0)
    .sort((a, b) => b.level - a.level || b.xp - a.xp);

  const best = touchedSkills[0]
    ? { name: getSkillDef(touchedSkills[0].id).name, level: touchedSkills[0].level }
    : null;
  const last = touchedSkills[touchedSkills.length - 1];
  const weakest = touchedSkills.length > 1 && last ? { name: getSkillDef(last.id).name, level: last.level } : null;

  const reviewedProjects = state.projects.filter((p) => p.status === "reviewed" && p.review);
  const avgProjectRating =
    reviewedProjects.length === 0
      ? null
      : Math.round(
          reviewedProjects.reduce((sum, p) => sum + (p.review?.overallScore ?? 0), 0) /
            reviewedProjects.length
        );

  // Every individual skill score ever given across every review — a finer
  // grain than avgProjectRating, which averages one number per project.
  const allSkillScores = Object.values(state.skills).flatMap((s) => s.aiScores);
  const avgSkillScore =
    allSkillScores.length === 0
      ? null
      : Math.round(allSkillScores.reduce((a, b) => a + b, 0) / allSkillScores.length);

  const booksEncountered = allTopics
    .filter((t) => state.completedTopics.includes(t.id))
    .reduce((sum, t) => sum + t.resources.filter((r) => r.kind === "book").length, 0);

  return {
    topicsCompleted: state.completedTopics.length,
    totalTopics: allTopics.length,
    projectsSubmitted: state.projects.length,
    projectsReviewed: reviewedProjects.length,
    bestSkill: best,
    weakestSkill: weakest,
    avgProjectRating,
    avgSkillScore,
    booksEncountered,
    roadmapProgressPercent: getOverallRoadmapProgress(state),
    achievementsUnlocked: state.achievements.filter((a) => a.unlockedAt).length,
    achievementsTotal: state.achievements.length,
  };
}

export function getRecentNotes(state: AppState, limit = 4) {
  return Object.values(state.notes)
    .filter((n) => n.content.trim().length > 0)
    .sort(
      (a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
    )
    .slice(0, limit);
}

export function getRecentProjects(state: AppState, limit = 4) {
  return [...state.projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getTodayXP(state: AppState): number {
  const today = new Date().toISOString().slice(0, 10);
  return state.dailyProgress[today]?.xpEarned ?? 0;
}

export interface XPHistoryEntry {
  date: string;
  xpEarned: number;
}

/** Fixed-length trailing window (including zero-XP days) — good for a simple bar view. */
export function getXPHistory(state: AppState, days = 14): XPHistoryEntry[] {
  const result: XPHistoryEntry[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, xpEarned: state.dailyProgress[key]?.xpEarned ?? 0 });
  }
  return result;
}
