import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — EduTube",
  description:
    "The terms that govern using EduTube, its AI filter, and the YouTube content it plays.",
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
        <rect
          width="36"
          height="26"
          rx="6"
          className="fill-zinc-900 dark:fill-white"
        />
        <path
          d="M15 8l9 5-9 5z"
          className="fill-white dark:fill-zinc-900"
        />
      </svg>
      EduTube
    </Link>
  );
}

const underline =
  "font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600";

export default function Terms() {
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
            Terms of Service
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Effective September 8, 2026
          </p>

          <p className="mt-4">
            By using EduTube you agree to these terms. If you don&apos;t agree,
            don&apos;t use the service.
          </p>

          <Section>
            <SectionTitle>What EduTube is</SectionTitle>
            <p className="mt-2">
              EduTube is a search-and-watch interface for YouTube. You search a
              topic, pick a result, and watch it in an embedded player. The
              service does not host, upload, or redistribute any video content;
              it only points to videos that already exist on YouTube.
            </p>
          </Section>

          <Section>
            <SectionTitle>YouTube content</SectionTitle>
            <p className="mt-2">
              Videos are played through YouTube&apos;s embed and remain subject
              to the{" "}
              <a href="https://www.youtube.com/t/terms" className={underline}>
                YouTube Terms of Service
              </a>{" "}
              and the{" "}
              <a href="https://developers.google.com/youtube/terms" className={underline}>
                YouTube API Services Terms
              </a>
              . You agree to comply with them when using EduTube.
            </p>
          </Section>

          <Section>
            <SectionTitle>Acceptable use</SectionTitle>
            <p className="mt-2">
              Don&apos;t abuse the service: no automated scraping, no attempts
              to disrupt it, no use that violates the law or YouTube&apos;s
              terms. Each account is subject to its own YouTube Data API quota.
            </p>
          </Section>

          <Section>
            <SectionTitle>The AI filter is imperfect</SectionTitle>
            <p className="mt-2">
              Results are screened by an AI filter intended to keep out
              clickbait and non-educational content. It can make mistakes, and
              EduTube provides no guarantee about the quality, accuracy, or
              suitability of any result. Use your own judgment.
            </p>
          </Section>

          <Section>
            <SectionTitle>No warranty; liability</SectionTitle>
            <p className="mt-2">
              EduTube is provided &ldquo;as is&rdquo; without warranties of any
              kind. To the maximum extent permitted by law, the operator is not
              liable for damages arising from use of the service.
            </p>
          </Section>

          <Section>
            <SectionTitle>Open source</SectionTitle>
            <p className="mt-2">
              The code behind this site is open source (MIT) at{" "}
              <a
                href="https://github.com/hhubert14/edutube"
                className={underline}
              >
                github.com/hhubert14/edutube
              </a>
              . Nothing in these terms restricts your rights under that license.
            </p>
          </Section>

          <Section>
            <SectionTitle>Contact</SectionTitle>
            <p className="mt-2">
              Questions about these terms:{" "}
              <a href="mailto:huang.hubert14@gmail.com" className={underline}>
                huang.hubert14@gmail.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}