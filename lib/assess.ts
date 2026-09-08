import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateObject } from "ai";
import { z } from "zod";

import type { SearchResult } from "./youtube";

const assessmentSchema = z.object({
  kept: z.array(z.number().int().min(0)),
});

function buildPrompt(query: string, results: SearchResult[]): string {
  const listing = results
    .map(
      (result, index) =>
        `Video ${index}: title="${result.title}" | channel="${result.channel}"` +
        ` | description="${result.description}" | views=${result.views ?? "?"}` +
        ` | duration=${result.duration ?? "?"}`,
    )
    .join("\n");

  return `The user searched YouTube for: "${query}"

Here are ${results.length} search results, one per line:

${listing}

Some of these videos are genuinely educational and on-topic for the query. Others are clickbait, misleading, reaction/compilation/entertainment content, off-topic filler, trailers, music videos, or unrelated.

Being on-topic is NOT enough: only keep a video if it actually teaches something — a concept, skill, method, or field of knowledge — in the style of a lesson, lecture, tutorial, explainer, or genuinely educational documentary.

DROP anything that merely reports, reacts, or entertains, even in depth:
- News updates, current-event recaps, or legal-case drama about a person or media figure
- Interviews or podcasts centered on a person's life, opinions, or controversies
- Reaction, commentary, rant, gossip, or drama-chasing content
- Shorts, teasers, trailers, compilations, clips, music videos, or memes

Many queries legitimately have zero educational results. If nothing teaches, "kept" must be empty. When in doubt, drop.

Return ONLY a JSON object with one key, "kept": an array of the indices (as listed, 0-based) of ONLY the videos that teach. Omit everything else. Example: {"kept": [0, 3, 7, 12]}`;
}

function keepListed(
  results: SearchResult[],
  kept: number[],
): SearchResult[] {
  const keep = new Set(kept.filter((index) => Number.isInteger(index)));
  return results.filter((_, index) => keep.has(index));
}

export async function assessResults(
  query: string,
  results: SearchResult[],
): Promise<SearchResult[]> {
  if (results.length === 0) return results;

  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    console.warn("[edutube] LLM_API_KEY not set; skipping assessment");
    return results;
  }

  const baseURL =
    process.env.LLM_BASE_URL?.replace(/\/$/, "") ||
    "https://openrouter.ai/api/v1";
  const models = [
    process.env.LLM_MODEL || "openrouter/free",
    process.env.LLM_FALLBACK_MODEL || "openai/gpt-oss-20b:free",
  ];

  const provider = createOpenAICompatible({
    name: "openrouter",
    baseURL,
    apiKey,
  });

  let lastError: unknown = null;

  for (const model of models) {
    try {
      const { object } = await generateObject({
        model: provider(model),
        schema: assessmentSchema,
        instructions:
          "You are an expert curation engine that finds educational videos. " +
          "Respond with ONLY a raw JSON object. No markdown, no explanation.",
        prompt: buildPrompt(query, results),
        maxRetries: 2,
        temperature: 0,
      });

      const kept = keepListed(results, object.kept);
      console.log(
        `[edutube] assessed ${results.length} results with ${model}; kept ${kept.length}`,
      );
      return kept;
    } catch (err) {
      lastError = err;
      console.warn(`[edutube] assessment with ${model} failed:`, err);
    }
  }

  console.warn(
    "[edutube] all assessment models failed; returning unfiltered results",
    lastError,
  );
  return results;
}