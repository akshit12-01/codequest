import type { AIReviewRequest } from "@/types";
import type { AIProvider, RawAIReview, RawSkillReview } from "./types";
import { getSkillDef, normalizeSkillName } from "@/config/skills";

// Small deterministic PRNG so a given submission feels consistent rather
// than jarringly random, without pulling in a dependency.
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function next() {
    h = Math.imul(h ^ (h >>> 16), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function scoreInRange(rand: () => number, min: number, max: number) {
  return Math.round(min + rand() * (max - min));
}

function pick<T>(rand: () => number, arr: T[], count: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function difficultyForSkillCount(n: number): string {
  if (n <= 2) return "Beginner";
  if (n <= 4) return "Intermediate";
  if (n <= 6) return "Advanced";
  return "Expert";
}

const STRENGTHS = [
  "Clear separation between routes, business logic, and data access.",
  "Consistent error response shape across endpoints.",
  "Sensible use of environment variables for configuration.",
  "Commit history reads like a real, incremental build rather than one dump.",
  "Solid input validation on the main write endpoints.",
];
const WEAKNESSES = [
  "Test coverage looks thin outside the happy path.",
  "A few list endpoints are likely missing pagination.",
  "Secrets and config could be separated more strictly from application code.",
  "Some duplicated logic between handlers could be extracted into shared helpers.",
  "Error responses may leak more internal detail than a client should see.",
];
const SUGGESTIONS = [
  "Add integration tests around the main authentication or write flow.",
  "Introduce a request-validation layer (e.g. zod) at the edge of each route.",
  "Add basic rate limiting to public write endpoints.",
  "Document the API with a short OpenAPI spec for easier onboarding.",
  "Extract shared query logic into a small repository/service layer.",
];

/**
 * Placeholder reviewer used when no Gemini key is configured, or when the
 * user explicitly selects "Mock" in Settings. It never calls the network —
 * everything here is synthesized from the submission itself.
 */
export class MockAIProvider implements AIProvider {
  readonly id = "mock" as const;

  async getRawReview(request: AIReviewRequest): Promise<RawAIReview> {
    // Small artificial delay so the loading state in the UI is visible
    // and submitting doesn't feel suspiciously instantaneous.
    await new Promise((resolve) => setTimeout(resolve, 900 + Math.random() * 700));

    const rand = seededRandom(
      `${request.projectName}:${request.skillsUsed.join(",")}:${request.githubUrl}`
    );
    const difficulty = difficultyForSkillCount(request.skillsUsed.length);

    const skills: RawSkillReview[] = request.skillsUsed.map((raw) => {
      const def = getSkillDef(normalizeSkillName(raw));
      const score = scoreInRange(rand, 62, 96);
      const feedback =
        score > 85
          ? `Strong, idiomatic use of ${def.name} throughout the project.`
          : score > 70
          ? `Solid grasp of ${def.name} with a few rough edges worth polishing.`
          : `${def.name} is present but used inconsistently — worth a deeper pass.`;
      return { name: def.name, score, feedback };
    });

    const overallScore = Math.round(
      skills.reduce((sum, s) => sum + s.score, 0) / Math.max(1, skills.length)
    );

    return {
      overallScore,
      difficulty,
      architecture: scoreInRange(rand, 60, 95),
      security: scoreInRange(rand, 55, 92),
      performance: scoreInRange(rand, 60, 93),
      scalability: scoreInRange(rand, 55, 90),
      codeQuality: scoreInRange(rand, 62, 94),
      documentation: scoreInRange(rand, 50, 95),
      summary: `${request.projectName} looks like a working ${difficulty.toLowerCase()}-level submission. The core flow is functional and the tagged skills are genuinely reflected in the scope, with room to tighten error handling, tests, and documentation. (Offline placeholder review — connect a Gemini API key in .env.local for real AI grading.)`,
      nextProject:
        difficulty === "Beginner"
          ? "Build a CRUD API with one related resource, like posts and comments."
          : difficulty === "Intermediate"
          ? "Add authentication and role-based access control to an existing API."
          : "Add a caching layer and containerize the project for deployment.",
      strengths: pick(rand, STRENGTHS, 3),
      weaknesses: pick(rand, WEAKNESSES, 2),
      suggestions: pick(rand, SUGGESTIONS, 3),
      skills,
    };
  }
}
