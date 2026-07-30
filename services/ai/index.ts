import type { AIReviewRequest, ProjectReview } from "@/types";
import { AIReviewService, type AIProviderPreference } from "./AIReviewService";

let singleton: AIReviewService | null = null;

function getServiceInstance(): AIReviewService {
  if (!singleton) singleton = new AIReviewService();
  return singleton;
}

/**
 * UI code should only ever import this. It never needs to know whether the
 * review came from Gemini, a mock, or (later) some other provider.
 */
export function getReviewService(preference: AIProviderPreference = "auto") {
  const service = getServiceInstance();
  return {
    reviewProject: (request: AIReviewRequest): Promise<ProjectReview> =>
      service.reviewProject(request, preference),
  };
}

export type { AIProviderPreference };
