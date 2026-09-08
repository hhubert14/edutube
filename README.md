# EduTube

> Open source: [github.com/hhubert14/edutube](https://github.com/hhubert14/edutube)

A learning interface backed by YouTube's video library, without YouTube itself. Search for a topic, get plain video results, and watch in a distraction-free embedded player. The user never sees the YouTube homepage, recommendations, Shorts, comments, or trending.

## Why

YouTube's browsing experience is optimized for engagement, not learning. EduTube is deliberately the opposite: a single search, a list of results, a click to watch, done. Playback happens entirely through the privacy-enhanced `youtube-nocookie.com` embed, so blocking `youtube.com` does not break playback.

## MVP

- One page. Search → results → player, all as client-side state. There is no `/watch/:id` route, so a video can only be opened from a search result — there is nothing to bookmark, share, or open directly.
- `POST /api/search` proxies the YouTube Data API v3 `search.list` endpoint and keeps the API key server-side.
- Results link only to the embedded player; thumbnails come from `i.ytimg.com`.
- After fetching, the 25 results are run through an LLM that silently drops clickbait/off-topic/entertainment videos and keeps the rest in their original order. The UI is unaffected — any assessment failure falls back to the unfiltered YouTube results.

## Getting started

```bash
cp .env.example .env.local
# set YOUTUBE_API_KEY and LLM_API_KEY in .env.local
npm install
npm run dev
```

### Getting a YouTube API key

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a project (or select one).
3. Enable **YouTube Data API v3**.
4. Create an API key under **APIs & Services → Credentials**.

The default free quota allocates **100 `search.list` calls per day** (a separate bucket) plus 10,000 quota units/day for all other endpoints. This is plenty for a personal tool; no caching is included.

### Quality assessment (optional but recommended)

Add an `LLM_API_KEY` from [OpenRouter](https://openrouter.ai/keys) to enable the educational-quality filter. It uses free models by default (`deepseek/deepseek-chat`, falling back to `meta-llama/llama-3.3-70b-instruct:free`). Override with `LLM_MODEL`, `LLM_FALLBACK_MODEL`, or `LLM_BASE_URL` if you want a different OpenAI-compatible endpoint.

Each search costs one extra LLM call (~1–3s); results are returned unfiltered if the LLM is down, rate-limited, or unconfigured.

## Deliberate omissions

These are intentional, not missing:

- Recommended/related videos, infinite scrolling, trending, Shorts
- Likes, comments, subscriber counts
- Notifications, personalized feeds, accounts
- Links out to `youtube.com` anywhere in the app

## Recommended setup: hard-block YouTube

For people who struggle to stay off YouTube, blocking it at the system level is much harder to bypass than a Chrome extension. With [ScreenZen](https://screenzen.co):

1. Block the YouTube app and `youtube.com` entirely.
2. Set a wait time (e.g. 15 minutes) before any block can be edited or disabled.
3. Make EduTube your only gateway to YouTube — playback still works because the `youtube-nocookie.com` embed is a different domain than `youtube.com`.

## Roadmap (not built)

- Transcript extraction for verification
- Caching to stretch the search quota
- Self-host / Docker deploy

## License

MIT — see [LICENSE](./LICENSE). The license covers this project's code and UI, never YouTube content or trademarks.