"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PhoneIcon } from "@phosphor-icons/react";
import Reveal from "../ui/Reveal";
import { SITE } from "@/lib/site";
import { scrollToHash, useCoarsePointer, useReducedMotion } from "../ui/hooks";

/**
 * The closing ask over the wide evening shot. The yellow button leans a few
 * pixels toward the pointer and carries the same shine sweep as the hero
 * CTA, so the two ends of the page rhyme.
 */
export default function FinalCta() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();

  function onMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || coarse) return;
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.translate = `${(x * 16).toFixed(1)}px ${(y * 10).toFixed(1)}px`;
  }
  function reset() {
    if (wrap.current) wrap.current.style.translate = "0px 0px";
  }

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="final-h">
      <Image src="/cta-wide-shot.jpg" alt="" fill sizes="(max-width: 768px) 100vw, 1440px" className="object-cover" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(24,38,12,0.55) 0%, rgba(24,38,12,0.35) 50%, rgba(24,38,12,0.7) 100%)" }}
      />
      <div className="relative mx-auto flex min-h-[70vh] max-w-[1280px] flex-col items-center justify-center px-5 py-28 text-center md:px-8 md:py-36">
        <Reveal>
          <h2 id="final-h" className="display text-[var(--on-dark)]" style={{ fontSize: "clamp(38px, 6.5vw, 84px)" }}>
            Ready for a Lawn <br className="hidden sm:block" />
            You&rsquo;re <span className="em" style={{ color: "var(--yellow)", paddingRight: "0.06em" }}>Proud Of?</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-10 flex flex-col items-center gap-5">
          <div
            ref={wrap}
            className="relative"
            onPointerMove={onMove}
            onPointerLeave={reset}
            style={{ transition: "translate 0.6s var(--ease-out)" }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-full"
              style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(246,216,89,0.28), transparent 70%)", filter: "blur(14px)" }}
            />
            <Link
              href="#estimate"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#estimate");
              }}
              className="btn btn-yellow group relative !gap-4 !px-9 !py-[22px] !text-[17px] md:!px-11 md:!py-6 md:!text-[19px]"
            >
              Get a Free Estimate
              <span className="grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 group-hover:translate-x-1" style={{ background: "rgba(33,54,18,0.12)" }}>
                <ArrowRightIcon size={16} weight="bold" />
              </span>
            </Link>
          </div>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--on-dark)" }}>
            <PhoneIcon size={16} weight="fill" /> {SITE.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
