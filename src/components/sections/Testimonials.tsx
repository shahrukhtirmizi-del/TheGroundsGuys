import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../ui/Reveal";
import Stars from "../ui/Stars";
import { TESTIMONIALS } from "@/lib/site";

/**
 * Real reviews on a slow ticker that pauses on hover. The track is
 * duplicated so the loop is seamless; the copy is aria-hidden so screen
 * readers hear each review once.
 */
export default function Testimonials() {
  const track = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section id="reviews" className="scroll-mt-20 overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal className="max-w-[820px]">
          <h2 className="h-section text-[var(--ink)]">
            What Davenport <span className="em text-[var(--green)]">neighbors say.</span>
          </h2>
        </Reveal>
        <Reveal delay={90} className="mt-5 max-w-[620px]">
          <p className="lead">Forty-five and counting. Every one from a real customer on a real lawn nearby.</p>
        </Reveal>
      </div>

      <div className="ticker-wrap relative mt-12 md:mt-16" style={{ "--ticker-duration": "70s" } as React.CSSProperties}>
        {/* soft fades at both edges so cards slide in from nothing */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-40" style={{ background: "linear-gradient(90deg, var(--bone), transparent)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-40" style={{ background: "linear-gradient(270deg, var(--bone), transparent)" }} />

        <div className="ticker gap-5 px-5 md:gap-6">
          {track.map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              aria-hidden={i >= TESTIMONIALS.length}
              tabIndex={i < TESTIMONIALS.length ? 0 : -1}
              className="flex w-[320px] shrink-0 flex-col rounded-[var(--r-card)] bg-[var(--white)] p-7 md:w-[400px]"
              style={{ boxShadow: "var(--shadow-soft)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-center justify-between">
                <Stars count={t.stars} />
                <QuotesIcon size={26} weight="fill" color="var(--green-soft)" />
              </div>
              <blockquote className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink)]">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-auto pt-5 text-[14px] font-semibold text-[var(--ink-55)]">
                {t.name} <span className="font-normal text-[var(--ink-40)]">&middot; Davenport area customer</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
