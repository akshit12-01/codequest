import type { AIReviewRequest } from "@/types";

export interface RawSkillReview {
  name: string;
  score: number;
  feedback: string;
}

/** Shape returned by an underlying provider, before we attach our own XP math. */
export interface RawAIReview {
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
  skills: RawSkillReview[];
}

export interface AIProvider {
  readonly id: "gemini" | "mock";
  getRawReview(request: AIReviewRequest): Promise<RawAIReview>;
}
