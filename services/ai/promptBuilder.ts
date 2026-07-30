import type { AIReviewRequest } from "@/types";

/**
 * Builds the prompt sent to Gemini. Kept isolated from both the provider
 * (transport) and the route handler so the review instructions can be
 * tuned without touching either.
 */
export function buildReviewPrompt(request: AIReviewRequest): string {
  const skillsList =
    request.skillsUsed.length > 0 ? request.skillsUsed.join(", ") : "(none listed)";

  return `You are a senior software engineer acting as an automated code reviewer inside a gamified developer-learning platform. A learner has submitted a project for review.

Review this project. Evaluate ONLY the skills explicitly listed below. Do not evaluate, score, or mention any skill that is not in that list, even if you suspect it might be used.

Project name: ${request.projectName}
Description: ${request.description}
GitHub repository: ${request.githubUrl}
Skills used (evaluate exactly these, nothing else): ${skillsList}

Base the review on the project name, description, and repository URL provided — reason about what a project like this plausibly looks like given the skills listed, since you cannot browse the repository directly. Be specific and constructive rather than generic.

For each listed skill, return a score from 0-100 and one concise, specific sentence of feedback.
Also return scores from 0-100 for: architecture, security, performance, scalability, codeQuality, documentation, and an overallScore reflecting the submission as a whole.
Return an overall difficulty rating: exactly one of "Beginner", "Intermediate", "Advanced", or "Expert".
Return a 2-3 sentence project summary, 2-3 top-level strengths, 2-3 top-level weaknesses, 2-3 suggestions for improvement, and one recommended next project as a short sentence.

Respond with ONLY raw JSON. No markdown code fences, no commentary before or after. Match this exact shape:
{
  "overallScore": number,
  "difficulty": string,
  "architecture": number,
  "security": number,
  "performance": number,
  "scalability": number,
  "codeQuality": number,
  "documentation": number,
  "summary": string,
  "nextProject": string,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[],
  "skills": [{ "name": string, "score": number, "feedback": string }]
}`;
}
