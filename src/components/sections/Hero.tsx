"use client";

import Link from "next/link";
import { ArrowDownIcon, PhoneIcon } from "@phosphor-icons/react";
import CountUp from "../ui/CountUp";
import { SITE, STATS } from "@/lib/site";
import { scrollToHash } from "../ui/hooks";

/**
 * Full-bleed cinemagraph hero. The video is a slow aerial drift over a
 * striped lawn, ping-ponged so the loop never jumps; it sits under a warm
 * dark gradient so the headline stays legible at every point in the loop.
 * Copy is left-aligned; the trust numbers sit in their own strip beneath.
 */
export default function Hero() {
  return (
    <section className="relative" aria-label="Introduction">
      <div className="relative isolate min-h-[100dvh] overflow-hidden" style={{ background: "var(--green-deeper)" }}>
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.jpg"
          aria-hidden
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* a warm scrim rather than flat black, heavier on the left where the copy sits */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(24, 38, 12, 0.78) 0%, rgba(24, 38, 12, 0.55) 45%, rgba(24, 38, 12, 0.25) 100%), linear-gradient(180deg, rgba(24, 38, 12, 0.45) 0%, rgba(24, 38, 12, 0.05) 40%, rgba(24, 38, 12, 0.6) 100%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1280px] flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32">
          <div className="max-w-[760px]">
            <h1
              className="display text-[var(--on-dark)]"
              style={{
                fontSize: "clamp(46px, 8vw, 104px)",
                lineHeight: 1.04,
                animation: "pop-in 1s var(--ease-out) 0.15s both",
              }}
            >
              Your Lawn,{" "}
              <span className="em" style={{ color: "var(--yellow)", paddingRight: "0.06em" }}>
                Perfected.
              </span>
            </h1>
            <p
              className="mt-6 max-w-[54ch] text-[17px] leading-relaxed md:text-[19px]"
              style={{ color: "var(--on-dark-70)", animation: "pop-in 1s var(--ease-out) 0.35s both" }}
            >
              Trusted lawn care and landscaping for Davenport, FL homes and businesses. Free estimates, upfront pricing,
              no surprises.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3" style={{ animation: "pop-in 1s var(--ease-out) 0.5s both" }}>
              <Link
                href="#estimate"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#estimate");
                }}
                className="btn btn-yellow !px-7 !py-[17px] !text-[16px]"
              >
                Get a Free Estimate
                <ArrowDownIcon size={16} weight="bold" />
              </Link>
              <a href={SITE.phoneHref} className="btn btn-ghost">
                <PhoneIcon size={16} weight="fill" />
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* trust strip, counting up as it enters */}
      <div className="relative z-10 mx-auto -mt-px max-w-[1280px] px-5 md:px-8">
        <div
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--r-card)] md:grid-cols-4 md:-translate-y-10"
          style={{ background: "var(--white)", boxShadow: "var(--shadow-lift)", border: "1px solid var(--line)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="px-5 py-6 md:px-8 md:py-8"
              style={{ borderLeft: i === 0 ? "none" : "1px solid var(--line)" }}
            >
              <div className="display text-[30px] md:text-[38px]" style={{ color: "var(--green)" }}>
                {s.kind === "text" ? s.text : <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />}
              </div>
              <div className="mt-1.5 text-[13.5px] font-medium" style={{ color: "var(--ink-55)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
