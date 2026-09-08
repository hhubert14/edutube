import { NextResponse } from "next/server";
import { assessResults } from "@/lib/assess";
import { searchYouTube, YoutubeSearchError } from "@/lib/youtube";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter 'q'" },
      { status: 400 },
    );
  }

  try {
    const results = await searchYouTube(q);

    try {
      const assessed = await assessResults(q, results);
      return NextResponse.json({ results: assessed });
    } catch (err) {
      console.error(
        "[edutube] assessment failed; returning unfiltered results",
        err,
      );
      return NextResponse.json({ results });
    }
  } catch (err) {
    const status = err instanceof YoutubeSearchError ? err.status : 500;
    console.error(`YouTube search failed (${status}):`, err);
    return NextResponse.json({ error: "Search failed" }, { status });
  }
}