export type AchievementCondition =
  | { type: "topicsCompleted"; target: number }
  | { type: "projectsSubmitted"; target: number }
  | { type: "totalXP"; target: number }
  | { type: "anyProjectReviewed" }
  | { type: "level"; target: number }
  | { type: "skillLevel"; skillId: string; target: number }
  | { type: "streak"; target: number };

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  /** lucide-react icon name */
  icon: string;
  /** Single source of truth for both "is this unlocked?" and "how close am I?" */
  condition: AchievementCondition;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: "first-theory",
    name: "First Theory",
    description: "Complete your first topic.",
    icon: "BookOpen",
    condition: { type: "topicsCompleted", target: 1 },
  },
  {
    id: "first-project",
    name: "First Project",
    description: "Submit your first project for review.",
    icon: "Rocket",
    condition: { type: "projectsSubmitted", target: 1 },
  },
  {
    id: "xp-100",
    name: "Getting Started",
    description: "Earn 100 total XP.",
    icon: "Sparkles",
    condition: { type: "totalXP", target: 100 },
  },
  {
    id: "xp-1000",
    name: "Grinding",
    description: "Earn 1,000 total XP.",
    icon: "Flame",
    condition: { type: "totalXP", target: 1000 },
  },
  {
    id: "first-ai-review",
    name: "First AI Review",
    description: "Receive your first AI code review.",
    icon: "Bot",
    condition: { type: "anyProjectReviewed" },
  },
  {
    id: "level-10",
    name: "Double Digits",
    description: "Reach level 10.",
    icon: "Trophy",
    condition: { type: "level", target: 10 },
  },
  {
    id: "backend-beginner",
    name: "Backend Beginner",
    description: "Complete 5 backend topics.",
    icon: "Server",
    condition: { type: "topicsCompleted", target: 5 },
  },
  {
    id: "javascript-apprentice",
    name: "JavaScript Apprentice",
    description: "Reach JavaScript skill level 5.",
    icon: "Braces",
    condition: { type: "skillLevel", skillId: "javascript", target: 5 },
  },
  {
    id: "express-explorer",
    name: "Express Explorer",
    description: "Reach Express skill level 3.",
    icon: "Route",
    condition: { type: "skillLevel", skillId: "express", target: 3 },
  },
  {
    id: "mongo-master",
    name: "Mongo Master",
    description: "Reach MongoDB skill level 5.",
    icon: "Database",
    condition: { type: "skillLevel", skillId: "mongodb", target: 5 },
  },
  {
    id: "streak-7",
    name: "Week Streak",
    description: "Maintain a 7-day streak.",
    icon: "CalendarCheck",
    condition: { type: "streak", target: 7 },
  },
];
