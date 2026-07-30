import type { AppState, RoadmapTopic } from "@/types";
import { ROADMAP_TRACKS } from "@/config/roadmaps/backend";
import {
  SKILL_MASTERY_REVIEW_COUNT,
  SKILL_MASTERY_SCORE_THRESHOLD,
} from "@/config/xp";
import { clamp } from "./utils";

export function getAllTopics(): RoadmapTopic[] {
  return ROADMAP_TRACKS.flatMap((t) => t.topics);
}

export function getTopicById(id: string): RoadmapTopic | undefined {
  return getAllTopics().find((t) => t.id === id);
}

export function getTrackById(trackId: string) {
  return ROADMAP_TRACKS.find((t) => t.id === trackId);
}

export function getTopicsForSkill(skillId: string): RoadmapTopic[] {
  return getAllTopics().filter((t) => t.skillIds.includes(skillId));
}

/** A topic with no prerequisites is always unlocked; otherwise every prerequisite must be completed. */
export function isTopicUnlocked(state: AppState, topic: RoadmapTopic): boolean {
  if (topic.prerequisites.length === 0) return true;
  return topic.prerequisites.every((id) => state.completedTopics.includes(id));
}

export function isTopicComplete(state: AppState, topicId: string): boolean {
  return state.completedTopics.includes(topicId);
}

export function getTrackProgress(state: AppState, trackId: string): number {
  const track = getTrackById(trackId);
  if (!track || track.topics.length === 0) return 0;
  const completed = track.topics.filter((t) =>
    state.completedTopics.includes(t.id)
  ).length;
  return Math.round((completed / track.topics.length) * 100);
}

/**
 * A skill's roadmap completion blends two signals: how many of its topics
 * are done (up to 70%), plus how well AI-reviewed projects using that skill
 * scored (up to 30%). It's deliberately capped below 100% until the skill
 * has a couple of genuinely strong project reviews behind it.
 */
export function computeSkillCompletionPercent(
  state: AppState,
  skillId: string
): number {
  const topicsForSkill = getTopicsForSkill(skillId);
  const completedForSkill = topicsForSkill.filter((t) =>
    state.completedTopics.includes(t.id)
  ).length;
  const topicShare =
    topicsForSkill.length === 0
      ? 0
      : (completedForSkill / topicsForSkill.length) * 70;

  const skill = state.skills[skillId];
  const aiScores = skill?.aiScores ?? [];
  const aiAverage =
    aiScores.length === 0
      ? 0
      : aiScores.reduce((a, b) => a + b, 0) / aiScores.length;
  const aiShare = (aiAverage / 100) * 30;

  const raw = topicShare + aiShare;
  const strongReviews = aiScores.filter(
    (s) => s >= SKILL_MASTERY_SCORE_THRESHOLD
  ).length;
  const canReach100 = strongReviews >= SKILL_MASTERY_REVIEW_COUNT;

  return Math.round(clamp(raw, 0, canReach100 ? 100 : 99));
}

/** The next `count` topics that are unlocked but not yet completed, in roadmap order. */
export function getUpcomingTopics(state: AppState, count = 2): RoadmapTopic[] {
  return getAllTopics()
    .filter((t) => isTopicUnlocked(state, t) && !isTopicComplete(state, t.id))
    .slice(0, count);
}

export function getNextAvailableTopic(state: AppState): RoadmapTopic | undefined {
  return getUpcomingTopics(state, 1)[0];
}

export function getOverallRoadmapProgress(state: AppState): number {
  const all = getAllTopics();
  if (all.length === 0) return 0;
  const completed = all.filter((t) =>
    state.completedTopics.includes(t.id)
  ).length;
  return Math.round((completed / all.length) * 100);
}

/** Previous/next topic in authored roadmap order — powers prev/next nav on the topic page. */
export function getAdjacentTopics(topicId: string): {
  prev?: RoadmapTopic;
  next?: RoadmapTopic;
} {
  const all = getAllTopics();
  const idx = all.findIndex((t) => t.id === topicId);
  if (idx === -1) return {};
  return { prev: all[idx - 1], next: all[idx + 1] };
}

/** Topics that list this one as a prerequisite — "completing this unlocks…". */
export function getUnlocksFor(topicId: string): RoadmapTopic[] {
  return getAllTopics().filter((t) => t.prerequisites.includes(topicId));
}
