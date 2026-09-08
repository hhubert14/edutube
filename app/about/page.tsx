import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works — EduTube",
  description:
    "Why EduTube exists, an optional ScreenZen setup that keeps YouTube blocked, and the links the app deliberately omits.",
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

export default function About() {
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
            How it works
          </h1>
          <p className="mt-2">
            EduTube searches YouTube&apos;s library and plays videos in a
            distraction-free player. Search a topic, pick a result, watch. That&apos;s
            the whole app &mdash; there is no YouTube homepage, no suggestions, no
            Shorts, no comments, nothing to scroll. Playback runs through the
            privacy-enhanced <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">youtube-nocookie.com</code>{" "}
            embed, so the app never opens youtube.com.
          </p>
          <p className="mt-3">
            It&apos;s not just a search bar: every set of results is run through an
            AI filter that drops clickbait and entertainment videos and re-ranks
            the rest by educational quality. Only those educational videos make
            it into the results.
          </p>

        <Section>
          <SectionTitle>Recommended setup: hard-block YouTube</SectionTitle>
          <p className="mt-2">
            Chrome extensions that block YouTube are trivially easy to disable when
            the urge hits. A stronger option is to block YouTube at the system level
            with an app like{" "}
            <a
              href="https://screenzen.co"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600"
            >
              ScreenZen
            </a>{" "}
            and give yourself a mandatory waiting period before any block can be
            changed:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              In ScreenZen, block the YouTube app and{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">youtube.com</code>{" "}
              entirely.
            </li>
            <li>
              Set a wait time &mdash; e.g. 15 minutes &mdash; before the block can be
              edited or disabled. Destructive actions get a cooling-off period.
            </li>
            <li>
              Make <strong>EduTube your only gateway to YouTube</strong>. Playback
              works because blocking youtube.com doesn&apos;t touch the{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-800">youtube-nocookie.com</code>{" "}
              embed.
            </li>
          </ol>
          <p className="mt-3">
            With this setup, watching is deliberate: getting back to full,
            unrestricted YouTube requires staring at a 15-minute lock screen first.
          </p>
        </Section>

        <Section>
          <SectionTitle>What&apos;s left out (on purpose)</SectionTitle>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Recommended and related videos, infinite scrolling, trending, Shorts</li>
            <li>Likes, comments, subscriber counts</li>
            <li>Notifications, personalized feeds, accounts</li>
            <li>Any link out to youtube.com anywhere in the app</li>
          </ul>
        </Section>

        <Section>
          <SectionTitle>Open source</SectionTitle>
          <p className="mt-2">
            EduTube is free and open source, licensed under MIT. You can read the
            code, run your own instance, or host it for yourself at{" "}
            <a
              href="https://github.com/hhubert14/edutube"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100 dark:decoration-zinc-600"
            >
              github.com/hhubert14/edutube
            </a>
            .
          </p>
        </Section>
        </div>
      </div>
    </main>
  );
}