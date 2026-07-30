import { NextRequest, NextResponse } from "next/server";
import { buildReviewPrompt } from "@/services/ai/promptBuilder";
import type { AIReviewRequest } from "@/types";
import type { RawAIReview } from "@/services/ai/types";

export const runtime = "nodejs";

const DEFAULT_MODEL = "gemini-flash-latest";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function isValidRequest(body: unknown): body is AIReviewRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.projectName === "string" &&
    b.projectName.trim().length > 0 &&
    typeof b.description === "string" &&
    typeof b.githubUrl === "string" &&
    Array.isArray(b.skillsUsed)
  );
}

function extractJSON(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function isRawReviewShape(value: unknown): value is RawAIReview {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.overallScore === "number" &&
    typeof v.difficulty === "string" &&
    Array.isArray(v.skills)
  );
}

async function callGemini(
  model: string,
  apiKey: string,
  prompt: string
): Promise<Response> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const payload = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
  });

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: payload,
      });
      if (res.ok || !RETRYABLE_STATUS.has(res.status) || attempt === 1) {
        return res;
      }
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  if (lastError) throw lastError;
  // unreachable in practice, but satisfies TypeScript's control flow
  return fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: payload });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_request", detail: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { ok: false, reason: "bad_request", detail: "Missing required project fields" },
      { status: 400 }
    );
  }

  const providedKey = body.geminiApiKey?.trim() ?? "";
  const apiKey = providedKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      reason: "not_configured",
      detail: "No Gemini API key configured. Add one in Settings to enable real AI-graded reviews.",
    });
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const prompt = buildReviewPrompt(body);

  try {
    const upstream = await callGemini(model, apiKey, prompt);
    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const detail = data?.error?.message || `HTTP ${upstream.status}`;
      return NextResponse.json({ ok: false, reason: "gemini_error", detail });
    }

    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({
        ok: false,
        reason: "empty_response",
        detail: "Gemini returned no content for this prompt",
      });
    }

    let parsed: unknown;
    try {
      parsed = extractJSON(text);
    } catch {
      return NextResponse.json({
        ok: false,
        reason: "parse_error",
        detail: "Could not parse Gemini's reply as JSON",
      });
    }

    if (!isRawReviewShape(parsed)) {
      return NextResponse.json({
        ok: false,
        reason: "shape_error",
        detail: "Gemini's JSON did not match the expected review shape",
      });
    }

    return NextResponse.json({ ok: true, review: parsed });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error contacting Gemini";
    return NextResponse.json({ ok: false, reason: "network_error", detail });
  }
}