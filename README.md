# EduTube

Search YouTube, get only educational videos, watch them distraction-free. No homepage, no recommendations, no Shorts, no comments.

## Running it yourself

```bash
cp .env.example .env.local   # set YOUTUBE_API_KEY; LLM_API_KEY enables the AI filter
npm install
npm run dev
```

## Recommended setup: hard-block YouTube

For people who struggle to stay off YouTube, blocking it at the system level is much harder to bypass than a Chrome extension. With ScreenZen:

1. Block the YouTube app and `youtube.com` entirely.
2. Set a wait time (e.g. 15 minutes) before a block can be edited or disabled.
3. Make EduTube your only gateway to YouTube.

## Feedback

Bugs, videos the filter wrongly drops, and topic requests: [huang.hubert14@gmail.com](mailto:huang.hubert14@gmail.com)

## License

MIT.