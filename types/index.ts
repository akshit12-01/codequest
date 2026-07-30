// ============================================================================
// CodeQuest — core type contracts
// Every persisted shape in the app is defined here so the storage layer,
// the XP engine, the AI service, and the UI all agree on one schema.
// ============================================================================

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type TopicSize = "tiny" | "small" | "medium" | "large";

export interface Resource {
  label: string;
  url: string;
  kind: "doc" | "video" | "book" | "article";
}

/** A single node in a roadmap tree. */
export interface RoadmapTopic {
  id: string;
  trackId: string;
  name: string;
  description: string;
  /** Longer theory write-up shown on the topic page. Plain text, paragraphs separated by blank lines. */
  theory: string;
  difficulty: Difficulty;
  estimatedHours: number;
  size: TopicSize;
  xpReward: number;
  /** ids of topics that must be completed before this one unlocks */
  prerequisites: string[];
  /** skills that earn XP when this topic is marked complete */
  skillIds: string[];
  resources: Resource[];
  /** 1-based tier, purely for grouping the tree into readable rows */
  tier: number;
  relatedProjectHint?: string;
}

export interface RoadmapTrack {
  id: string;
  name: string;
  description: string;
  topics: RoadmapTopic[];
}

export interface SkillDef {
  id: string;
  name: string;
  /** CSS var suffix, e.g. "node" -> var(--color-skill-node) */
  colorVar: string;
}

export interface SkillState {
  id: string;
  xp: number;
  level: number;
  projectsUsed: string[];
  aiScores: number[];
  completionPercent: number;
}

export interface Note {
  topicId: string;
  content: string;
  updatedAt: string | null;
}

export interface ProjectSkillReview {
  name: string;
  score: number;
  feedback: string;
  xpAwarded: number;
}

export interface ProjectReview {
  overallScore: number;
  difficulty: string;
  architecture: number;
  security: number;
  performance: number;
  scalability: number;
  codeQuality: number;
  documentation: number;
  summary: string;
  nextProject: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills: ProjectSkillReview[];
  xpAwarded: number;
  reviewedBy: "gemini" | "mock";
  reviewedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  skillsUsed: string[];
  createdAt: string;
  status: "pending" | "reviewed" | "failed";
  review: ProjectReview | null;
  errorMessage?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface DailyProgressEntry {
  date: string; // yyyy-mm-dd
  xpEarned: number;
  topicsCompleted: number;
}

export interface AppSettings {
  aiProvider: "auto" | "gemini" | "mock";
}

/** The single object persisted to LocalStorage under one key. */
export interface AppState {
  schemaVersion: number;
  username: string;
  createdAt: string;
  level: number;
  xp: number;
  totalXP: number;
  streak: {
    current: number;
    best: number;
    lastActiveDate: string | null;
  };
  notes: Record<string, Note>;
  projects: Project[];
  skills: Record<string, SkillState>;
  achievements: Achievement[];
  completedTopics: string[];
  settings: AppSettings;
  dailyProgress: Record<string, DailyProgressEntry>;
}

// ---------------------------------------------------------------------------
// AI review service contract
// ---------------------------------------------------------------------------

export interface AIReviewRequest {
  projectName: string;
  description: string;
  githubUrl: string;
  skillsUsed: string[];
}

export interface AIReviewService {
  reviewProject(request: AIReviewRequest): Promise<ProjectReview>;
}
