import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import SiteShell from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="flex min-h-[100dvh] items-center px-5 pb-20 pt-28 md:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="max-w-[640px]">
            <p className="text-[15px] font-semibold text-[var(--green)]">404</p>
            <h1 className="display mt-3 text-[var(--ink)]" style={{ fontSize: "clamp(40px, 7vw, 88px)" }}>
              This patch is <span className="em text-[var(--green)]">bare.</span>
            </h1>
            <p className="lead mt-6 max-w-[48ch]">
              The page you were after has been moved or never grew here. The lawn care, though, is right where you left it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary">
                Back to the home page
              </Link>
              <a href={SITE.phoneHref} className="btn btn-secondary">
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
