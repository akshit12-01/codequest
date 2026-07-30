import type { AppState, SkillState, Achievement } from "@/types";
import { SKILL_DEFS } from "@/config/skills";
import { ACHIEVEMENT_DEFS } from "@/config/achievements";

/**
 * Everything lives under this one LocalStorage key, matching the spec's
 * `learningApp` object. Swapping this file's internals for a real backend
 * later (Supabase/Postgres) should not require touching any component —
 * only this module and lib/store.ts know that LocalStorage exists.
 */
export const STORAGE_KEY = "learningApp";
export const CURRENT_SCHEMA_VERSION = 1;

export function createDefaultState(username: string): AppState {
  const skills: Record<string, SkillState> = {};
  for (const def of SKILL_DEFS) {
    skills[def.id] = {
      id: def.id,
      xp: 0,
      level: 1,
      projectsUsed: [],
      aiScores: [],
      completionPercent: 0,
    };
  }

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    username: username.trim(),
    createdAt: new Date().toISOString(),
    level: 1,
    xp: 0,
    totalXP: 0,
    streak: { current: 0, best: 0, lastActiveDate: null },
    notes: {},
    projects: [],
    skills,
    achievements: ACHIEVEMENT_DEFS.map((def) => ({
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      unlockedAt: null,
    })),
    completedTopics: [],
    settings: { aiProvider: "auto", geminiApiKey: "" },
    dailyProgress: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function mergeAchievements(saved: unknown, defaults: Achievement[]): Achievement[] {
  if (!Array.isArray(saved)) return defaults;
  const savedById = new Map<string, Achievement>();
  for (const entry of saved as unknown[]) {
    if (isRecord(entry) && typeof entry.id === "string") {
      savedById.set(entry.id, entry as unknown as Achievement);
    }
  }
  // Map over *current* defaults (not saved data) so an achievement added to
  // config/achievements.ts after a user's last save is backfilled instead
  // of missing entirely, while unlocked state for existing ones is kept.
  return defaults.map((def) => savedById.get(def.id) ?? def);
}

/**
 * Backfills a parsed LocalStorage/import payload against a fresh default
 * state so every field the app relies on is guaranteed to exist. Protects
 * against: data saved under an older schema (fields didn't exist yet),
 * hand-edited/partial imports, and future schema additions (new fields get
 * silently backfilled instead of crashing old saves). Without this, a
 * payload missing e.g. `skills` entirely would pass loadState's old
 * "has a username" check and then blow up the first time any page did
 * `Object.values(state.skills)`.
 */
function normalizeState(raw: Record<string, unknown>): AppState {
  const username =
    typeof raw.username === "string" && raw.username.trim() ? raw.username : "Adventurer";
  const base = createDefaultState(username);

  return {
    ...base,
    schemaVersion: typeof raw.schemaVersion === "number" ? raw.schemaVersion : base.schemaVersion,
    username,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : base.createdAt,
    level: typeof raw.level === "number" ? raw.level : base.level,
    xp: typeof raw.xp === "number" ? raw.xp : base.xp,
    totalXP: typeof raw.totalXP === "number" ? raw.totalXP : base.totalXP,
    streak: { ...base.streak, ...(isRecord(raw.streak) ? raw.streak : {}) },
    notes: isRecord(raw.notes) ? (raw.notes as AppState["notes"]) : base.notes,
    projects: Array.isArray(raw.projects)
      ? (raw.projects as AppState["projects"])
      : base.projects,
    skills: {
      ...base.skills,
      ...(isRecord(raw.skills) ? raw.skills : {}),
    } as AppState["skills"],
    achievements: mergeAchievements(raw.achievements, base.achievements),
    completedTopics: Array.isArray(raw.completedTopics)
      ? (raw.completedTopics as string[])
      : base.completedTopics,
    settings: { ...base.settings, ...(isRecord(raw.settings) ? raw.settings : {}) },
    dailyProgress: isRecord(raw.dailyProgress)
      ? (raw.dailyProgress as AppState["dailyProgress"])
      : base.dailyProgress,
  };
}

export function loadState(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || typeof parsed.username !== "string" || !parsed.username.trim()) {
      return null;
    }
    return normalizeState(parsed);
  } catch (err) {
    console.error("CodeQuest: failed to read saved progress", err);
    return null;
  }
}

export function saveState(state: AppState): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error("CodeQuest: failed to save progress", err);
    return false;
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportStateAsJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function parseImportedJSON(text: string): AppState | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isRecord(parsed) || typeof parsed.username !== "string" || !parsed.username.trim()) {
      return null;
    }
    return normalizeState(parsed);
  } catch {
    return null;
  }
}