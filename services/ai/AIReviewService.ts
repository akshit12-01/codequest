import type { AIReviewRequest, ProjectReview } from "@/types";
import type { AIProvider } from "./types";
import { MockAIProvider } from "./MockProvider";
import { GeminiAIProvider } from "./GeminiProvider";
import { computeProjectXP, computeSkillXPFromReview } from "@/lib/xpEngine";
import { getSkillDef, normalizeSkillName } from "@/config/skills";

export type AIProviderPreference = "auto" | "gemini" | "mock";

/**
 * The single seam between "the app" and "whoever is actually grading the
 * project". Swapping Gemini for OpenAI, Claude, or anything else later
 * means writing one new AIProvider and changing this file — no UI
 * component should ever import a provider directly.
 */
export class AIReviewService {
  constructor(
    private readonly gemini: AIProvider = new GeminiAIProvider(),
    private readonly mock: AIProvider = new MockAIProvider()
  ) {}

  async reviewProject(
    request: AIReviewRequest,
    preference: AIProviderPreference = "auto"
  ): Promise<ProjectReview> {
    let raw;
    let reviewedBy: "gemini" | "mock";

    if (preference === "mock") {
      raw = await this.mock.getRawReview(request);
      reviewedBy = "mock";
    } else {
      try {
        raw = await this.gemini.getRawReview(request);
        reviewedBy = "gemini";
      } catch (err) {
        if (preference === "gemini") throw err;
        // "auto" mode: quietly fall back so the app still works with no key configured.
        raw = await this.mock.getRawReview(request);
        reviewedBy = "mock";
      }
    }

    const xpAwarded = computeProjectXP(raw.overallScore, raw.difficulty);
    const skills = raw.skills.map((s) => ({
      name: getSkillDef(normalizeSkillName(s.name)).name,
      score: s.score,
      feedback: s.feedback,
      xpAwarded: computeSkillXPFromReview(s.score, raw.difficulty),
    }));

    return {
      overallScore: raw.overallScore,
      difficulty: raw.difficulty,
      architecture: raw.architecture,
      security: raw.security,
      performance: raw.performance,
      scalability: raw.scalability,
      codeQuality: raw.codeQuality,
      documentation: raw.documentation,
      summary: raw.summary,
      nextProject: raw.nextProject,
      strengths: raw.strengths,
      weaknesses: raw.weaknesses,
      suggestions: raw.suggestions,
      skills,
      xpAwarded,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    };
  }
}
