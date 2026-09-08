# EduTube

A learning interface backed by YouTube's video library, without YouTube itself. Search for a topic, get plain video results, and watch in a distraction-free embedded player. The user never sees the YouTube homepage, recommendations, Shorts, comments, or trending.

## Why

YouTube's browsing experience is optimized for engagement, not learning. EduTube is deliberately the opposite: a single search, a list of results, a click to watch, done. Playback happens entirely through the privacy-enhanced `youtube-nocookie.com` embed, so blocking `youtube.com` does not break playback.

## MVP

- One page. Search → results → player, all as client-side state. There is no `/watch/:id` route, so a video can only be opened from a search result — there is nothing to bookmark, share, or open directly.
- `POST /api/search` proxies the YouTube Data API v3 `search.list` endpoint and keeps the API key server-side.
- Results link only to the embedded player; thumbnails come from `i.ytimg.com`.

## Getting started

```bash
cp .env.example .env.local
# set YOUTUBE_API_KEY in .env.local
npm install
npm run dev
```

### Getting a YouTube API key

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a project (or select one).
3. Enable **YouTube Data API v3**.
4. Create an API key under **APIs & Services → Credentials**.

The default free quota allocates **100 `search.list` calls per day** (a separate bucket) plus 10,000 quota units/day for all other endpoints. This is plenty for a personal tool; no caching is included.

## Deliberate omissions

These are intentional, not missing:

- Recommended/related videos, infinite scrolling, trending, Shorts
- Likes, comments, subscriber counts
- Notifications, personalized feeds, accounts
- Links out to `youtube.com` anywhere in the app

## Roadmap (not built)

- AI filtering of results (educational / clickbait / quality scoring)
- Transcript extraction for verification
- Caching to stretch the search quota
- Self-host / Docker deploy

## License

MIT — see [LICENSE](./LICENSE). The license covers this project's code and UI, never YouTube content or trademarks.