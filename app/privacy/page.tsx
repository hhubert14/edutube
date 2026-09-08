import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — EduTube",
  description:
    "What EduTube collects, what it stores, and which third-party services handle data.",
};

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`mt-8 ${className}`}>{children}</section>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
      {children}
    </h2>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex w-fit shrink-0 cursor-pointer items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ytred dark:text-zinc-50"
    >
      <svg viewBox="0 0 36 26" className="h-5 w-auto" aria-hidden="true">
        <rect width="36" height="26" rx="6" fill="#FF0000" />
        <path d="M15 8l9 5-9 5z" fill="#fff" />
      </svg>
      EduTube
    </Link>
  );
}

const underline =
  "font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600";

export default function Privacy() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center px-4">
          <Logo />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[640px] flex-1 px-4 py-6">
        <Link
          href="/"
          className="w-fit rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Back to search
        </Link>

        <div className="mt-6 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Privacy Policy
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Effective September 8, 2026
          </p>

          <p className="mt-4">
            EduTube is a search-and-watch interface for YouTube. You do not
            create an account, sign in with Google, or provide any personal
            information to use it. EduTube itself collects nothing that we can
            attribute to you.
          </p>

          <Section>
            <SectionTitle>What EduTube collects</SectionTitle>
            <p className="mt-2">
              Searching requires sending your query to our server, which
              forwards it to the YouTube Data API (Google) to find results. The
              query and the returned video metadata (titles, descriptions,
              channels, view counts) are also sent to an LLM service
              (OpenRouter) solely to filter out non-educational videos. We do
              not store the query, the assessment, or anything else about your
              search.
            </p>
            <p className="mt-3">
              If you email us at{" "}
              <a href="mailto:huang.hubert14@gmail.com" className={underline}>
                huang.hubert14@gmail.com
              </a>
              , we see whatever you send. We use it only to respond to your
              message and never share it.
            </p>
          </Section>

          <Section>
            <SectionTitle>What we store</SectionTitle>
            <p className="mt-2">
              We have no accounts and no database of user data. The only
              records produced are standard server logs from our hosting
              provider Vercel, which records things like IP addresses, request
              times, and user agents in the ordinary course of serving any
              website. Those logs are governed by{" "}
              <a href="https://vercel.com/legal/privacy-policy" className={underline}>
                Vercel&apos;s privacy policy
              </a>
              .
            </p>
          </Section>

          <Section>
            <SectionTitle>YouTube playback and Google</SectionTitle>
            <p className="mt-2">
              Videos play through the{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">
                youtube-nocookie.com
              </code>{" "}
              embed, which places no cookies before you play a video. Once you
              press play, Google may use cookies and your interaction data as
              described in{" "}
              <a href="https://policies.google.com/privacy" className={underline}>
                Google&apos;s Privacy Policy
              </a>
              . We do not receive any of that data.
            </p>
            <p className="mt-3">
              Search results come from the YouTube Data API and are subject to
              the{" "}
              <a href="https://www.youtube.com/t/terms" className={underline}>
                YouTube Terms of Service
              </a>{" "}
              and the{" "}
              <a href="https://developers.google.com/youtube/terms" className={underline}>
                YouTube API Services Terms of Service
              </a>
              . See how Google uses information when you use its partners&apos;
              sites or apps at{" "}
              <a href="https://policies.google.com/privacy/partners" className={underline}>
                policies.google.com/privacy/partners
              </a>
              .
            </p>
          </Section>

          <Section>
            <SectionTitle>Your rights and deletion</SectionTitle>
            <p className="mt-2">
              Because EduTube does not store personal data, there is nothing to
              access, correct, or delete on our side. If you&apos;ve emailed us
              and want your message removed from our inbox, write to us at{" "}
              <a href="mailto:huang.hubert14@gmail.com" className={underline}>
                huang.hubert14@gmail.com
              </a>{" "}
              and we&apos;ll delete it.
            </p>
          </Section>

          <Section>
            <SectionTitle>Children</SectionTitle>
            <p className="mt-2">
              EduTube is not directed to children under 13 and does not
              knowingly collect information from anyone.
            </p>
          </Section>

          <Section>
            <SectionTitle>Changes</SectionTitle>
            <p className="mt-2">
              If this policy changes, we&apos;ll update it here with a new
              effective date.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}