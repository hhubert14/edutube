"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import type { SearchResult } from "@/lib/youtube";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function MetaLine({
  video,
  className = "",
}: {
  video: SearchResult;
  className?: string;
}) {
  return (
    <p
      className={`mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400 ${className}`}
    >
      {video.views ? `${video.views} views` : ""}
      {video.views && video.publishedAt ? " · " : ""}
      {video.publishedAt ? formatDate(video.publishedAt) : ""}
    </p>
  );
}

function ResultRow({
  video,
  onOpen,
}: {
  video: SearchResult;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-start gap-4 text-left focus:outline-none"
    >
      <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-xl bg-zinc-100 transition group-hover:rounded-lg sm:w-[360px] dark:bg-zinc-800">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(min-width: 640px) 360px, 160px"
            className="object-cover"
          />
        ) : null}
        {video.duration ? (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {video.duration}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
          {video.title}
        </h3>
        <MetaLine video={video} />
        {video.channel ? (
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            {video.channel}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function Player({ video, onBack }: { video: SearchResult; onBack: () => void }) {
  const src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="w-fit rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        Back to results
      </button>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={src}
          title={video.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {video.title}
        </h2>
        <MetaLine video={video} />
        {video.channel ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {video.channel}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setSelected(null);
    setSearched(false);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.results) {
        setError(body?.error ?? "Search failed. Please try again.");
        setResults([]);
      } else {
        setResults(body.results as SearchResult[]);
      }
    } catch {
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  }

  function goHome() {
    setSelected(null);
    setResults([]);
    setSearched(false);
    setError(null);
    setQuery("");
  }

  const showSearch = !selected;

  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto grid h-14 max-w-[1280px] grid-cols-[1fr_minmax(0,560px)_1fr] items-center px-4">
          <button
            type="button"
            onClick={goHome}
            className="flex w-fit shrink-0 cursor-pointer items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ytred dark:text-zinc-50"
          >
            <svg viewBox="0 0 36 26" className="h-5 w-auto" aria-hidden="true">
              <rect width="36" height="26" rx="6" fill="#FF0000" />
              <path d="M15 8l9 5-9 5z" fill="#fff" />
            </svg>
            EduTube
          </button>

          {showSearch ? (
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex h-10 w-full items-stretch">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-l-full border border-r-0 border-zinc-300 bg-white px-4 focus-within:shadow-[0_1px_6px_rgba(0,0,0,0.12)] dark:border-zinc-700 dark:bg-zinc-900">
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search"
                    autoFocus
                    className="h-full w-full min-w-0 bg-transparent text-base text-zinc-900 outline-none placeholder-zinc-500 dark:text-zinc-50 dark:placeholder-zinc-400"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="shrink-0 rounded-full p-1 text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="m6 6 12 12M18 6 6 18" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  aria-label="Search"
                  className="flex items-center rounded-r-full border border-l-0 border-zinc-300 bg-zinc-50 px-4 text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <SearchIcon />
                </button>
              </div>
            </form>
          ) : null}

          </div>
      </header>

      {selected ? (
        <div className="flex flex-1 flex-col items-center px-4 py-6">
          <Player video={selected} onBack={() => setSelected(null)} />
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[880px] flex-1 px-4 py-6">
          {!loading && !searched ? (
            <div className="mx-auto max-w-[560px] pt-10 text-center sm:pt-16">
              <p className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
                Search and watch educational YouTube videos only
              </p>
              <p className="mx-auto mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
                Results are filtered by AI to keep out clickbait and
                entertainment, and playback never opens youtube.com &mdash; no
                homepage, no recommendations, no Shorts, no comments.
              </p>
              <Link
                href="/about"
                className="mt-5 inline-block rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                How it works
              </Link>
            </div>
          ) : null}

          {error ? (
            <p className="mb-6 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : null}

          {loading && !searched ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Searching...
            </p>
          ) : null}

          {!loading && searched && results.length === 0 && !error ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No educational videos found. Try a different topic.
            </p>
          ) : null}

          {results.length > 0 ? (
            <div className="flex flex-col gap-6">
              {results.map((video) => (
                <ResultRow
                  key={video.id}
                  video={video}
                  onOpen={() => setSelected(video)}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}