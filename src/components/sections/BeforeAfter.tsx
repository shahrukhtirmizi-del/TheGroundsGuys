"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowsOutLineHorizontalIcon } from "@phosphor-icons/react";
import Reveal from "../ui/Reveal";

/**
 * Drag-to-reveal comparison. The "after" photo sits underneath; the
 * "before" is clipped to the left of the handle. An invisible range input
 * spans the frame, so dragging anywhere, arrow keys and screen readers all
 * drive the same value.
 */
export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  return (
    <section id="difference" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal className="max-w-[720px]">
          <h2 className="h-section text-[var(--ink)]">See the Difference.</h2>
        </Reveal>
        <Reveal delay={90} className="mt-5 max-w-[620px]">
          <p className="lead">
            The same Davenport front yard, before and after a season with us. Drag the handle.
          </p>
        </Reveal>

        <Reveal delay={160} className="mt-10 md:mt-14">
          <div
            ref={frame}
            className="group relative aspect-[4/3] w-full select-none overflow-hidden rounded-[var(--r-card)] md:aspect-[16/9]"
            style={{ boxShadow: "var(--shadow-lift)" }}
          >
            <Image src="/after-lawn.jpg" alt="The lawn after The Grounds Guys: striped, edged and full" fill priority={false} sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Image src="/before-lawn.jpg" alt="The lawn before: patchy, overgrown and full of weeds" fill sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" />
            </div>

            {/* labels */}
            <span
              className="pointer-events-none absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold tracking-wide text-[var(--on-dark)] backdrop-blur-md md:left-6 md:top-6"
              style={{ background: "rgba(34,38,31,0.5)", opacity: pos > 12 ? 1 : 0, transition: "opacity 0.3s" }}
            >
              Before
            </span>
            <span
              className="pointer-events-none absolute right-4 top-4 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold tracking-wide text-[var(--green-deeper)] md:right-6 md:top-6"
              style={{ background: "var(--yellow)", opacity: pos < 88 ? 1 : 0, transition: "opacity 0.3s" }}
            >
              After
            </span>

            {/* divider and handle */}
            <div
              className="pointer-events-none absolute inset-y-0 w-[2px] bg-[var(--white)]"
              style={{ left: `calc(${pos}% - 1px)`, boxShadow: "0 0 0 1px rgba(34,38,31,0.15), 0 0 24px rgba(0,0,0,0.25)" }}
            >
              <div
                className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--white)] text-[var(--green)] transition-transform duration-300"
                style={{ boxShadow: "var(--shadow-lift)", transform: `translate(-50%, -50%) scale(${dragging ? 1.12 : 1})` }}
              >
                <ArrowsOutLineHorizontalIcon size={22} weight="bold" />
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              onPointerDown={() => setDragging(true)}
              onPointerUp={() => setDragging(false)}
              onPointerCancel={() => setDragging(false)}
              onBlur={() => setDragging(false)}
              aria-label="Reveal the before and after comparison"
              aria-valuetext={`${Math.round(pos)} percent before`}
              className="ba-range absolute inset-0 h-full w-full opacity-0 focus-visible:opacity-100"
              style={{ margin: 0 }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
