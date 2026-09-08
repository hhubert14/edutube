export type SearchResult = {
  id: string;
  title: string;
  description: string;
  channel: string;
  publishedAt: string;
  thumbnail: string | null;
  duration: string | null;
  views: string | null;
};

type YouTubeSearchResponse = {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: {
      publishedAt?: string;
      title?: string;
      description?: string;
      channelTitle?: string;
      liveBroadcastContent?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }>;
};

export class YoutubeSearchError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "YoutubeSearchError";
    this.status = status;
  }
}

type YouTubeVideosResponse = {
  items?: Array<{
    id?: string;
    contentDetails?: { duration?: string };
    statistics?: { viewCount?: string };
  }>;
};

export function formatDuration(iso: string): string | null {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = match[1] ? Number(match[1]) : 0;
  const minutes = match[2] ? Number(match[2]) : 0;
  const seconds = match[3] ? Number(match[3]) : 0;

  if (!hours && !minutes && !seconds) return null;
  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((part) => String(part).padStart(2, "0"))
      .join(":");
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatViews(raw: string | undefined): string | null {
  if (!raw) return null;
  const count = Number(raw);
  if (!Number.isFinite(count) || count < 0) return null;

  return new Intl.NumberFormat("en-US", {
    notation: count >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(count);
}

async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string,
): Promise<Map<string, { duration: string; views: string | null }>> {
  const details = new Map<string, { duration: string; views: string | null }>();

  if (videoIds.length === 0) return details;

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "contentDetails,statistics");
  url.searchParams.set("id", videoIds.join(","));
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  if (!res.ok) return details;

  const data: YouTubeVideosResponse = await res.json();
  for (const item of data.items ?? []) {
    if (!item.id || !item.contentDetails?.duration) continue;
    details.set(item.id, {
      duration: item.contentDetails.duration,
      views:
        item.statistics?.viewCount !== undefined
          ? formatViews(item.statistics.viewCount)
          : null,
    });
  }
  return details;
}

export async function searchYouTube(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new YoutubeSearchError(500, "YOUTUBE_API_KEY is not set");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "25");
  url.searchParams.set("q", query);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new YoutubeSearchError(res.status, body);
  }

  const data: YouTubeSearchResponse = await res.json();

  const items = (data.items ?? [])
    .filter((item) => item.id?.videoId && item.snippet)
    .filter((item) => item.snippet?.liveBroadcastContent !== "live");

  const details = await fetchVideoDetails(
    items.flatMap((item) => (item.id?.videoId ? [item.id.videoId] : [])),
    apiKey,
  );

  return items.map((item) => {
    const detail = details.get(item.id!.videoId!);
    return {
      id: item.id!.videoId!,
      title: (item.snippet!.title ?? "").trim(),
      description: (item.snippet!.description ?? "").trim(),
      channel: (item.snippet!.channelTitle ?? "").trim(),
      publishedAt: item.snippet!.publishedAt ?? "",
      thumbnail:
        item.snippet!.thumbnails?.high?.url ??
        item.snippet!.thumbnails?.medium?.url ??
        item.snippet!.thumbnails?.default?.url ??
        null,
      duration: detail?.duration ? formatDuration(detail.duration) : null,
      views: detail?.views ?? null,
    };
  });
}