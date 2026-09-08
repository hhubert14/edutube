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

// Free-tier quota is tracked per model, so we rotate across several to pool
// it. Order matters: the flash-lite models carry the biggest quotas.
const GEMINI_MODELS = [
  "gemini-3.1-flash-lite", // 500 req/day
  "gemini-3.5-flash-lite", // 500 req/day
  "gemini-3.8-flash",      // 20 req/day
  "gemini-3.5-flash",      // 20 req/day
  "gemini-3.7-flash",      // 20 req/day
  "gemini-3.6-flash",      // 20 req/day
];

function configuredProviders(): Array<{
  name: string;
  baseURL: string;
  apiKey: string;
  model: string;
}> {
  const providers: Array<{
    name: string;
    baseURL: string;
    apiKey: string;
    model: string;
  }> = [];

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      providers.push({
        name: "gemini",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        apiKey: geminiKey,
        model,
      });
    }
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    providers.push({
      name: "openrouter",
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openRouterKey,
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
    });
  }

  return providers;
}

export async function assessResults(
  query: string,
  results: SearchResult[],
): Promise<SearchResult[]> {
  if (results.length === 0) return results;

  const providers = configuredProviders();
  if (providers.length === 0) {
    console.warn(
      "[edutube] No LLM provider configured (GEMINI_API_KEY or OPENROUTER_API_KEY); skipping assessment",
    );
    return results;
  }

  let lastError: unknown = null;

  for (const provider of providers) {
    const client = createOpenAICompatible({
      name: provider.name,
      baseURL: provider.baseURL,
      apiKey: provider.apiKey,
    });
    try {
      const { object } = await generateObject({
        model: client(provider.model),
        schema: assessmentSchema,
        instructions:
          "You are an expert curation engine that finds educational videos. " +
          "Respond with ONLY a raw JSON object. No markdown, no explanation.",
        prompt: buildPrompt(query, results),
        maxRetries: 1,
        temperature: 0,
      });

      const kept = keepListed(results, object.kept);
      console.log(
        `[edutube] assessed ${results.length} results with ${provider.name}:${provider.model}; kept ${kept.length}`,
      );
      return kept;
    } catch (err) {
      lastError = err;
      console.warn(
        `[edutube] assessment with ${provider.name}:${provider.model} failed:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.warn(
    "[edutube] all LLM providers failed; returning unfiltered results",
    lastError,
  );
  return results;
}