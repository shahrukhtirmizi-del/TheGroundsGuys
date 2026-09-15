import type { ReactNode } from "react";

/** Shared shell for the privacy and terms pages: a quiet, readable column. */
export default function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <article className="px-5 pb-24 pt-32 md:px-8 md:pt-40">
      <div className="mx-auto max-w-[760px]">
        <h1 className="display text-[var(--ink)]" style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}>
          {title}
        </h1>
        <p className="mt-4 text-[14px] text-[var(--ink-40)]">Last updated {updated}</p>
        <p className="lead mt-8">{intro}</p>
        <div className="legal mt-10 text-[16px] leading-relaxed text-[var(--ink-70)] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[var(--ink)] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1.5 [&_a]:text-[var(--green)] [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </article>
  );
}
