"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/ui/hooks";

/* --------------------------------------------------------------------------
   /pitch — keynote-style deck for the sales meeting. Ten slides, one idea
   each, alternating charcoal and cream. Click the right half, press →, or
   swipe to advance. Every slide stays mounted; the active one is shown and
   the neighbours are parked just off to the side, so changes crossfade.
   -------------------------------------------------------------------------- */

type Theme = "dark" | "light";

type SlideDef = {
  theme: Theme;
  Component: (props: { active: boolean }) => React.ReactNode;
};

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/* Eases from 0 to `to` when the slide becomes active; resets when it leaves
   so returning to the slide plays the count again. */
function useCountUp(active: boolean, to: number, duration = 1400, delay = 250) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let timer = 0;
    if (!active) {
      raf = requestAnimationFrame(() => setValue(0));
      return () => cancelAnimationFrame(raf);
    }
    if (reduce) {
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }
    timer = window.setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        setValue(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, to, duration, delay, reduce]);

  return value;
}

/* ---------- shared pieces ------------------------------------------------ */

function Frame({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div
      className={`mx-auto my-auto w-full max-w-[1240px] px-6 pb-24 pt-14 sm:px-10 md:px-16 md:pb-32 md:pt-20 ${
        center ? "flex flex-col items-center text-center" : ""
      }`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <p className="pitch-mono pitch-reveal flex items-center gap-3 text-[var(--p-gold)]" style={{ "--i": 0 } as Vars}>
      {live && <span className="pitch-live inline-block h-2 w-2 rounded-full bg-[var(--p-green)]" aria-hidden />}
      {children}
    </p>
  );
}

function Headline({ children, size = "md", className = "" }: { children: React.ReactNode; size?: "md" | "lg" | "xl"; className?: string }) {
  const fontSize =
    size === "xl" ? "clamp(96px, 19vw, 260px)" : size === "lg" ? "clamp(42px, 7.2vw, 108px)" : "clamp(34px, 5.4vw, 80px)";
  return (
    <h1 className={`pitch-headline pitch-reveal mt-6 text-[var(--p-fg)] md:mt-8 ${className}`} style={{ fontSize, "--i": 1 } as Vars}>
      {children}
    </h1>
  );
}

function Lead({ children, className = "", i = 2 }: { children: React.ReactNode; className?: string; i?: number }) {
  return (
    <p className={`pitch-lead pitch-reveal mt-6 text-[var(--p-muted)] md:mt-8 ${className}`} style={{ "--i": i } as Vars}>
      {children}
    </p>
  );
}

function Tick({ tone }: { tone: "dim" | "bright" }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden className={tone === "bright" ? "text-[var(--p-gold)]" : "text-[var(--p-muted)]"}>
      <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- slides -------------------------------------------------------- */

function TitleSlide() {
  return (
    <Frame>
      <Eyebrow>PVA Media</Eyebrow>
      <Headline size="lg" className="max-w-[14ch]">
        Let&rsquo;s talk about your phone calls.
      </Headline>
    </Frame>
  );
}

const STEPS = [
  { n: "01", title: "A call comes in", text: "New estimate, a reschedule, a quick question." },
  { n: "02", title: "No one can pick up", text: "The crew’s out on a mowing, landscaping, irrigation, or tree job." },
  { n: "03", title: "It goes to voicemail", text: "Most callers hang up without leaving one." },
  { n: "04", title: "They call someone else", text: "The job goes to whoever answers first." },
];

function ProblemSlide() {
  return (
    <Frame>
      <Eyebrow>The Problem Every Crew Knows</Eyebrow>
      <Headline className="max-w-[18ch]">It&rsquo;s hard to be on a job and constantly answer the phone.</Headline>
      <ol className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 md:mt-20 md:grid-cols-4 md:gap-x-10">
        {STEPS.map((s, i) => (
          <li key={s.n} className="pitch-reveal border-t border-[var(--p-line-strong)] pt-5" style={{ "--i": i + 2, "--step": "0.14s" } as Vars}>
            <span className="pitch-mono text-[var(--p-green)]">{s.n}</span>
            <h2 className="mt-4 text-[clamp(19px,1.6vw,24px)] font-semibold leading-tight tracking-[-0.02em] text-[var(--p-fg)]">{s.title}</h2>
            <p className="mt-2 text-[clamp(14px,1.05vw,17px)] leading-relaxed text-[var(--p-muted)]">{s.text}</p>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

const STATS = [
  { value: 62, text: "of small business calls go unanswered during business hours" },
  { value: 85, text: "of callers who reach voicemail never leave a message" },
  { value: 82, text: "of callers who can’t reach a business will call a competitor instead" },
];

function Stat({ active, value, text, i }: { active: boolean; value: number; text: string; i: number }) {
  const n = useCountUp(active, value, 1500, 350 + i * 120);
  return (
    <div className="pitch-reveal py-5 md:px-10 md:py-2 md:first:pl-0 md:last:pr-0" style={{ "--i": i + 2 } as Vars}>
      <div
        className="pitch-headline text-[var(--p-gold)]"
        style={{ fontSize: "clamp(64px, 9.5vw, 148px)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.05em" }}
      >
        {n}%
      </div>
      <p className="mt-3 max-w-[26ch] text-[clamp(15px,1.15vw,19px)] leading-snug text-[var(--p-muted)]">{text}</p>
    </div>
  );
}

function StatsSlide({ active }: { active: boolean }) {
  return (
    <Frame>
      <Eyebrow>What The Data Says</Eyebrow>
      <Headline className="max-w-[16ch]">This is costing you real, bookable jobs.</Headline>
      <div className="mt-10 grid divide-y divide-[var(--p-line)] md:mt-20 md:grid-cols-3 md:divide-x md:divide-y-0">
        {STATS.map((s, i) => (
          <Stat key={s.value} active={active} value={s.value} text={s.text} i={i} />
        ))}
      </div>
      <p className="pitch-reveal mt-12 text-[13px] italic leading-relaxed text-[var(--p-muted)] opacity-80 md:mt-20" style={{ "--i": 6 } as Vars}>
        Source: 411 Locals small-business call study; 2025 consumer survey on missed-call behavior
      </p>
    </Frame>
  );
}

function IntroSlide() {
  return (
    <Frame>
      <Eyebrow>Introducing</Eyebrow>
      <Headline size="xl" className="-ml-[0.04em] mt-2 leading-[0.9] md:mt-2">
        Alex<span className="text-[var(--p-gold)]">.</span>
      </Headline>
      <Lead className="mt-8 max-w-[46ch] text-[var(--p-fg)] md:mt-10">
        Your AI receptionist for The Grounds Guys of Davenport. Answers every call, 24/7, sounds completely natural &mdash; and books
        the job while you keep working.
      </Lead>
    </Frame>
  );
}

function DemoSlide() {
  return (
    <Frame center>
      <div className="flex flex-col items-center py-10 md:py-16">
        <Eyebrow live>Live Demo</Eyebrow>
        <Headline size="lg">Let&rsquo;s just call her.</Headline>
        <Lead className="mx-auto max-w-[44ch]">
          Ask her anything you&rsquo;d like &mdash; then we&rsquo;ll run a real new-customer call from first ring to booked estimate.
        </Lead>
      </div>
    </Frame>
  );
}

const FEATURES = [
  { title: "Answers 24/7/365", text: "Nights, weekends, holidays — no sick days, no overtime." },
  { title: "Never loses her cool", text: "Stays calm and professional even if a caller is rude, upset, or swearing at her." },
  { title: "Understands real speech", text: "Handles accents, dialects, background noise, and mumbled addresses without breaking flow." },
  { title: "Books directly into your calendar", text: "No back and forth, no double-booking — the job lands straight on your schedule." },
  { title: "Knows your services and pricing rules", text: "Flags things like a paid diagnostic fee for irrigation before she books it." },
  { title: "Handles new AND existing customers", text: "Reschedules, weather delays, general questions — not just new leads." },
  { title: "Flags urgent jobs automatically", text: "Storm damage or downed trees get prioritized, not stuck in a queue." },
  { title: "Full transcripts of every call", text: "See exactly what was said — nothing lost, nothing misremembered." },
];

function FeaturesSlide() {
  return (
    <Frame>
      <Eyebrow>What She&rsquo;s Actually Capable Of</Eyebrow>
      <Headline className="max-w-[16ch]">Not a call tree. A real receptionist.</Headline>
      <ul className="mt-10 grid gap-x-12 gap-y-6 md:mt-16 md:grid-cols-2 md:gap-y-8 lg:gap-x-20">
        {FEATURES.map((f, i) => (
          <li key={f.title} className="pitch-reveal flex gap-4" style={{ "--i": i + 2, "--step": "0.07s" } as Vars}>
            <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[var(--p-green)]" aria-hidden />
            <div>
              <h2 className="text-[clamp(17px,1.4vw,22px)] font-semibold leading-snug tracking-[-0.02em] text-[var(--p-fg)]">{f.title}</h2>
              <p className="mt-1 text-[clamp(14px,1.05vw,17px)] leading-relaxed text-[var(--p-muted)]">{f.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

const BARS = [
  { label: "Without an AI Receptionist", value: 38, dim: true },
  { label: "With an AI Receptionist", value: 100, dim: false },
];

function ImpactSlide() {
  return (
    <Frame>
      <Eyebrow>The Difference It Makes</Eyebrow>
      <Headline className="max-w-[16ch]">From missed calls to booked jobs.</Headline>
      <div className="mt-12 grid items-end gap-12 md:mt-20 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16">
        <div className="pitch-reveal" style={{ "--i": 2 } as Vars}>
          <div className="flex items-end gap-8 sm:gap-12" style={{ height: "clamp(200px, 32vh, 340px)" }}>
            {BARS.map((b, i) => (
              <div key={b.label} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className="pitch-reveal mb-3 font-semibold text-[var(--p-fg)]"
                  style={{ "--i": 0, "--d": `${1.0 + i * 0.25}s`, fontSize: "clamp(20px, 2.2vw, 30px)", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" } as Vars}
                >
                  {b.value}%
                </div>
                <div
                  className="pitch-bar w-full rounded-t-[6px] bg-[var(--p-gold)]"
                  style={{ height: `${b.value}%`, opacity: b.dim ? 0.45 : 1, "--d": `${0.45 + i * 0.25}s` } as Vars}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-8 border-t border-[var(--p-line-strong)] pt-4 sm:gap-12">
            {BARS.map((b) => (
              <p key={b.label} className="flex-1 text-[clamp(13px,1vw,16px)] leading-snug text-[var(--p-muted)]">
                {b.label}
              </p>
            ))}
          </div>
        </div>
        <Lead className="max-w-[34ch] md:pb-10" i={3}>
          Every call answered live means every lead gets a shot at becoming a booked job &mdash; instead of a call to a competitor.
        </Lead>
      </div>
    </Frame>
  );
}

const PLANS = [
  {
    name: "Standard",
    price: "$647",
    setup: "$1,200 setup",
    recommended: false,
    items: [
      "24/7 call answering",
      "Job qualification against your criteria",
      "Direct calendar booking",
      "Call transcripts and summaries",
      "Voicemail and after-hours capture",
    ],
  },
  {
    name: "Premium",
    price: "$797",
    setup: "$1,500 setup",
    recommended: true,
    items: [
      "Everything in Standard",
      "Quote details collected on the call",
      "Custom voice and script",
      "Priority routing for high-value jobs",
      "Weekly call summary report",
      "Priority support",
    ],
  },
];

function PricingSlide() {
  return (
    <Frame>
      <Eyebrow>Two Ways to Get Started</Eyebrow>
      <Headline className="max-w-[16ch]">AI Receptionist Options</Headline>
      <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:items-center md:gap-8">
        {PLANS.map((p, pi) => (
          <div
            key={p.name}
            className={`pitch-reveal relative rounded-[20px] border ${
              p.recommended
                ? "border-[var(--p-gold)] bg-[var(--p-card)] p-7 shadow-[0_0_0_1px_rgba(240,206,110,0.25),0_30px_70px_-30px_rgba(240,206,110,0.35)] md:p-10"
                : "border-[var(--p-line-strong)] p-6 md:p-8"
            }`}
            style={{ "--i": pi + 2, "--step": "0.12s" } as Vars}
          >
            {p.recommended && (
              <span className="pitch-mono absolute right-6 top-6 rounded-full border border-[var(--p-gold)] px-3 py-1.5 text-[10px] text-[var(--p-gold)] md:right-8 md:top-8">
                Recommended
              </span>
            )}
            <h2 className={`text-[clamp(20px,1.6vw,26px)] font-semibold tracking-[-0.02em] ${p.recommended ? "text-[var(--p-fg)]" : "text-[var(--p-muted)]"}`}>
              {p.name}
            </h2>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="pitch-headline text-[var(--p-fg)]" style={{ fontSize: p.recommended ? "clamp(48px, 5vw, 76px)" : "clamp(40px, 4vw, 60px)" }}>
                {p.price}
              </span>
              <span className="pitch-mono text-[var(--p-muted)]">per month</span>
            </div>
            <p className="pitch-mono mt-2 text-[var(--p-muted)]">{p.setup}</p>
            <ul className="mt-7 space-y-3 border-t border-[var(--p-line)] pt-7">
              {p.items.map((item, i) => (
                <li
                  key={item}
                  className="pitch-tick-row flex items-center gap-3 text-[clamp(14px,1.1vw,17px)] leading-snug"
                  style={{ "--i": i, "--d": `${0.55 + pi * 0.25}s`, color: p.recommended ? "var(--p-fg)" : "var(--p-muted)" } as Vars}
                >
                  <span className="pitch-tick flex shrink-0" style={{ "--i": i, "--d": `${0.55 + pi * 0.25}s` } as Vars}>
                    <Tick tone={p.recommended ? "bright" : "dim"} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ExtraSlide() {
  return (
    <Frame>
      <Eyebrow>One More Thing</Eyebrow>
      <Headline className="max-w-[16ch]">While we&rsquo;re at it &mdash;</Headline>
      <Lead className="max-w-[58ch]">
        If it&rsquo;d help, we can also refresh your website at the same time &mdash; custom-built, hosting and maintenance included, for a
        flat one-time fee of $1,497 (normally $2,997) when bundled with the package above. Completely optional, no pressure either way.
      </Lead>
    </Frame>
  );
}

function NextSlide() {
  return (
    <Frame center>
      <div className="flex flex-col items-center py-10 md:py-16">
        <Eyebrow>Next Steps</Eyebrow>
        <Headline size="lg" className="mx-auto max-w-[16ch]">
          Let&rsquo;s get you answering every call.
        </Headline>
        <Lead className="mx-auto max-w-[40ch]">Agreement and payment link sent today &mdash; live within days.</Lead>
      </div>
    </Frame>
  );
}

const SLIDES: SlideDef[] = [
  { theme: "dark", Component: TitleSlide },
  { theme: "light", Component: ProblemSlide },
  { theme: "dark", Component: StatsSlide },
  { theme: "light", Component: IntroSlide },
  { theme: "dark", Component: DemoSlide },
  { theme: "light", Component: FeaturesSlide },
  { theme: "dark", Component: ImpactSlide },
  { theme: "dark", Component: PricingSlide },
  { theme: "light", Component: ExtraSlide },
  { theme: "dark", Component: NextSlide },
];

/* ---------- deck ---------------------------------------------------------- */

export default function Pitch() {
  const count = SLIDES.length;
  const [index, setIndex] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((i: number) => setIndex(Math.min(count - 1, Math.max(0, i))), [count]);
  const step = useCallback((d: number) => setIndex((i) => Math.min(count - 1, Math.max(0, i + d))), [count]);

  // Restore the slide from the hash on load and keep it updated, so a
  // refresh mid-meeting lands back on the same slide.
  useEffect(() => {
    let raf = 0;
    const readHash = () => {
      const fromHash = parseInt(window.location.hash.slice(1), 10);
      if (fromHash >= 1 && fromHash <= count) raf = requestAnimationFrame(() => setIndex(fromHash - 1));
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", readHash);
    };
  }, [count]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          e.preventDefault();
          step(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(count - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goTo, count]);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    step(e.clientX > window.innerWidth / 2 ? 1 : -1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    step(dx < 0 ? 1 : -1);
  };

  const theme = SLIDES[index].theme;

  return (
    <div
      className="pitch-stage fixed inset-0 overflow-hidden"
      data-theme={theme}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="presentation"
      aria-label="PVA Media pitch"
    >
      {SLIDES.map(({ theme: t, Component }, i) => {
        const active = i === index;
        return (
          <section
            key={i}
            className="pitch-slide"
            data-theme={t}
            data-pos={active ? "active" : i < index ? "before" : "after"}
            aria-hidden={!active}
            aria-label={`Slide ${i + 1} of ${count}`}
          >
            <Component active={active} />
          </section>
        );
      })}

      {/* bottom chrome: hint, progress dots, counter */}
      <div
        className="pitch-chrome pointer-events-none absolute inset-x-0 bottom-0 z-10 grid grid-cols-[1fr_auto_1fr] items-end px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-10 sm:px-8 sm:pb-6 md:px-10"
        data-theme={theme}
      >
        <p
          className="pitch-mono whitespace-nowrap text-[var(--p-muted)] transition-opacity duration-500"
          style={{ opacity: index === 0 ? 1 : 0, letterSpacing: "0.12em" }}
          aria-hidden={index !== 0}
        >
          <span className="pitch-nudge mr-2 text-[var(--p-gold)]">&rarr;</span>
          <span className="hidden sm:inline">Tap the right side or press &rarr;</span>
          <span className="sm:hidden">Swipe</span>
        </p>

        <div className="pointer-events-auto flex items-center gap-[7px]" role="tablist" aria-label="Slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className="pitch-dot cursor-pointer"
              data-active={i === index}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
            />
          ))}
        </div>

        <p className="pitch-mono text-right text-[var(--p-muted)]" style={{ fontVariantNumeric: "tabular-nums" }}>
          {String(index + 1).padStart(2, "0")}
          <span className="mx-1.5 opacity-50">/</span>
          {String(count).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
