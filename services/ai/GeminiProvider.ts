import type { AIReviewRequest } from "@/types";
import type { AIProvider, RawAIReview } from "./types";

interface ReviewRouteResponse {
  ok: boolean;
  review?: RawAIReview;
  reason?: string;
  detail?: string;
}

/**
 * Client-side provider that proxies through our own Next.js API route
 * (app/api/review/route.ts). The Gemini API key stays server-side; this
 * class never touches it directly.
 */
export class GeminiAIProvider implements AIProvider {
  readonly id = "gemini" as const;

  async getRawReview(request: AIReviewRequest): Promise<RawAIReview> {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const body = (await res.json().catch(() => null)) as ReviewRouteResponse | null;

    if (!body || !body.ok || !body.review) {
      const reason = body?.reason ?? `http_${res.status}`;
      const detail = body?.detail ? `: ${body.detail}` : "";
      throw new Error(`Gemini review unavailable (${reason}${detail})`);
    }

    return body.review;
  }
}
