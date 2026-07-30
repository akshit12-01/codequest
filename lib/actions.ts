import type { AppState, Project, ProjectReview, RoadmapTopic } from "@/types";
import { getLevelProgress, levelForTotalXP } from "./xpEngine";
import { applyStreakActivity } from "./streak";
import { evaluateAchievements } from "./achievementsEngine";
import { computeSkillCompletionPercent } from "./roadmapEngine";
import { normalizeSkillName } from "@/config/skills";
import { generateId, todayISODate } from "./utils";
import type { AchievementDef } from "@/config/achievements";

export interface ActionResult {
  state: AppState;
  xpGained: number;
  leveledUp: boolean;
  newLevel: number;
  newlyUnlocked: AchievementDef[];
}

function finalize(prev: AppState, next: AppState, xpGained: number): ActionResult {
  const streaked = xpGained > 0 ? applyStreakActivity(next) : next;
  const { achievements, newlyUnlocked } = evaluateAchievements(streaked);
  const finalState = { ...streaked, achievements };
  return {
    state: finalState,
    xpGained,
    leveledUp: finalState.level > prev.level,
    newLevel: finalState.level,
    newlyUnlocked,
  };
}

function touchDaily(state: AppState, xp: number, topicsCompleted = 0) {
  const today = todayISODate();
  const prevEntry = state.dailyProgress[today] ?? {
    date: today,
    xpEarned: 0,
    topicsCompleted: 0,
  };
  return {
    ...state.dailyProgress,
    [today]: {
      ...prevEntry,
      xpEarned: prevEntry.xpEarned + xp,
      topicsCompleted: prevEntry.topicsCompleted + topicsCompleted,
    },
  };
}

export function completeTopicAction(
  state: AppState,
  topic: RoadmapTopic
): ActionResult {
  if (state.completedTopics.includes(topic.id)) {
    return { state, xpGained: 0, leveledUp: false, newLevel: state.level, newlyUnlocked: [] };
  }

  const xpGained = topic.xpReward;
  const newTotalXP = state.totalXP + xpGained;
  const progress = getLevelProgress(newTotalXP);

  const skills = { ...state.skills };
  const perSkillXP = Math.round(xpGained / Math.max(1, topic.skillIds.length));
  for (const skillId of topic.skillIds) {
    const prev = skills[skillId] ?? {
      id: skillId,
      xp: 0,
      level: 1,
      projectsUsed: [],
      aiScores: [],
      completionPercent: 0,
    };
    const newXP = prev.xp + perSkillXP;
    skills[skillId] = { ...prev, xp: newXP, level: levelForTotalXP(newXP) };
  }

  const next: AppState = {
    ...state,
    totalXP: newTotalXP,
    xp: newTotalXP,
    level: progress.level,
    completedTopics: [...state.completedTopics, topic.id],
    skills,
    dailyProgress: touchDaily(state, xpGained, 1),
  };

  for (const skillId of topic.skillIds) {
    next.skills[skillId] = {
      ...next.skills[skillId],
      completionPercent: computeSkillCompletionPercent(next, skillId),
    };
  }

  return finalize(state, next, xpGained);
}

export function createPendingProjectAction(
  state: AppState,
  input: { name: string; description: string; githubUrl: string; skillsUsed: string[] }
): { state: AppState; project: Project } {
  const project: Project = {
    id: generateId("proj"),
    name: input.name.trim(),
    description: input.description.trim(),
    githubUrl: input.githubUrl.trim(),
    skillsUsed: input.skillsUsed,
    createdAt: new Date().toISOString(),
    status: "pending",
    review: null,
  };
  return { state: { ...state, projects: [project, ...state.projects] }, project };
}

export function markProjectFailedAction(
  state: AppState,
  projectId: string,
  errorMessage: string
): AppState {
  return {
    ...state,
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, status: "failed", errorMessage } : p
    ),
  };
}

export function applyProjectReviewAction(
  state: AppState,
  projectId: string,
  review: ProjectReview
): ActionResult {
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) {
    return { state, xpGained: 0, leveledUp: false, newLevel: state.level, newlyUnlocked: [] };
  }

  const xpGained = review.xpAwarded;
  const newTotalXP = state.totalXP + xpGained;
  const progress = getLevelProgress(newTotalXP);

  const skills = { ...state.skills };
  for (const skillReview of review.skills) {
    const skillId = normalizeSkillName(skillReview.name);
    const prev = skills[skillId] ?? {
      id: skillId,
      xp: 0,
      level: 1,
      projectsUsed: [],
      aiScores: [],
      completionPercent: 0,
    };
    const newXP = prev.xp + skillReview.xpAwarded;
    skills[skillId] = {
      ...prev,
      xp: newXP,
      level: levelForTotalXP(newXP),
      projectsUsed: prev.projectsUsed.includes(projectId)
        ? prev.projectsUsed
        : [...prev.projectsUsed, projectId],
      aiScores: [...prev.aiScores, skillReview.score],
    };
  }

  const next: AppState = {
    ...state,
    totalXP: newTotalXP,
    xp: newTotalXP,
    level: progress.level,
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, status: "reviewed", review } : p
    ),
    skills,
    dailyProgress: touchDaily(state, xpGained),
  };

  for (const skillReview of review.skills) {
    const skillId = normalizeSkillName(skillReview.name);
    next.skills[skillId] = {
      ...next.skills[skillId],
      completionPercent: computeSkillCompletionPercent(next, skillId),
    };
  }

  return finalize(state, next, xpGained);
}

/** Edits a project's own fields. Only meaningful before it has a review attached to it — the UI enforces that, this stays a plain data update. */
export function updateProjectFieldsAction(
  state: AppState,
  projectId: string,
  fields: Partial<Pick<Project, "name" | "description" | "githubUrl" | "skillsUsed">>
): AppState {
  return {
    ...state,
    projects: state.projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            ...fields,
            name: fields.name?.trim() ?? p.name,
            description: fields.description?.trim() ?? p.description,
            githubUrl: fields.githubUrl?.trim() ?? p.githubUrl,
          }
        : p
    ),
  };
}

/** Puts a project back into "pending" so a fresh review can be requested for it. */
export function beginRetryAction(state: AppState, projectId: string): AppState {
  return {
    ...state,
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, status: "pending", errorMessage: undefined } : p
    ),
  };
}

export function updateNoteAction(
  state: AppState,
  topicId: string,
  content: string
): AppState {
  return {
    ...state,
    notes: {
      ...state.notes,
      [topicId]: { topicId, content, updatedAt: new Date().toISOString() },
    },
  };
}

export function changeUsernameAction(state: AppState, username: string): AppState {
  const trimmed = username.trim();
  if (!trimmed) return state;
  return { ...state, username: trimmed };
}

export function updateSettingsAction(
  state: AppState,
  settings: Partial<AppState["settings"]>
): AppState {
  return { ...state, settings: { ...state.settings, ...settings } };
}

export function clearAllNotesAction(state: AppState): AppState {
  return { ...state, notes: {} };
}

/** Re-locks every achievement without touching XP, level, topics, or projects. */
export function resetAchievementsAction(state: AppState): AppState {
  return {
    ...state,
    achievements: state.achievements.map((a) => ({ ...a, unlockedAt: null })),
  };
}