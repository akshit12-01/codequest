import type { TopicSize } from "@/types";

/** XP awarded for marking a theory topic complete, keyed by size. */
export const TOPIC_XP: Record<TopicSize, number> = {
  tiny: 20,
  small: 40,
  medium: 75,
  large: 150,
};

/**
 * XP pool a project can earn at a 100/100 overall AI score, keyed by the
 * difficulty the AI assigns to the submission. Actual award scales down by
 * (overallScore / 100), with a floor so a rough-but-real submission still
 * earns something.
 */
export const PROJECT_BASE_XP: Record<string, number> = {
  Beginner: 300,
  Intermediate: 1000,
  Advanced: 2500,
  Expert: 3250,
};

/** Per-skill XP pool at a perfect skill score, keyed by project difficulty. */
export const PROJECT_SKILL_XP_POOL: Record<string, number> = {
  Beginner: 50,
  Intermediate: 80,
  Advanced: 120,
  Expert: 150,
};

export const MIN_PROJECT_XP_FLOOR_RATIO = 0.15;

/** A skill needs at least this many AI reviews scoring >=85 before its
 * roadmap completion can reach 100% — mirrors "never instantly 100%". */
export const SKILL_MASTERY_REVIEW_COUNT = 2;
export const SKILL_MASTERY_SCORE_THRESHOLD = 85;
