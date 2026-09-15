"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, InfoIcon } from "@phosphor-icons/react";
import TiltCard from "../ui/TiltCard";
import Modal from "../ui/Modal";
import Reveal from "../ui/Reveal";
import { FEATURED_SERVICE_SLUGS, SERVICES, type Service } from "@/lib/site";
import { scrollToHash } from "../ui/hooks";

/**
 * Three photographed services as tilt cards, the other four as quieter
 * tiles beneath. Every card opens the same modal with the full description
 * and the itemised list. Irrigation carries its diagnostic-fee note wherever
 * it appears.
 */
export default function Services() {
  const [active, setActive] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  function show(s: Service) {
    setActive(s);
    setOpen(true);
  }

  const featured = FEATURED_SERVICE_SLUGS.map((slug) => SERVICES.find((s) => s.slug === slug)!);
  const rest = SERVICES.filter((s) => !FEATURED_SERVICE_SLUGS.includes(s.slug));

  return (
    <section id="services" className="relative scroll-mt-20 py-20 md:py-28" style={{ background: "var(--bone-2)" }}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal className="max-w-[860px]">
          <h2 className="h-section text-[var(--ink)]">
            Everything the property needs, from <span className="em text-[var(--green)]">one crew.</span>
          </h2>
        </Reveal>
        <Reveal delay={90} className="mt-5 max-w-[640px]">
          <p className="lead">
            Mowing and maintenance on a schedule, full landscape builds, and the irrigation work that keeps it all
            green. Tap any service to see exactly what is included.
          </p>
        </Reveal>

        {/* featured, with the middle card dropped so the row has a rhythm */}
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 110} className={i === 1 ? "md:mt-12" : ""}>
              <TiltCard
                onClick={() => show(s)}
                ariaLabel={`${s.title}: view details`}
                className="overflow-hidden rounded-[var(--r-card)] bg-[var(--white)]"
                style={{ boxShadow: "var(--shadow-soft)" }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image!}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                    style={{ transitionTimingFunction: "var(--ease-out)" }}
                  />
                  {/* a soft spotlight that follows the pointer across the photo */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(246, 216, 89, 0.22), transparent 60%)",
                    }}
                  />
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-[21px] font-bold leading-tight tracking-tight text-[var(--ink)]">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-55)]">{s.short}</p>
                  {s.note && (
                    <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-[var(--ink-70)]">
                      <InfoIcon size={16} weight="fill" className="mt-[1px] shrink-0" color="var(--green)" />
                      Irrigation repair requires a paid diagnostic fee and is not covered by the free estimate.
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--green)]">
                    See what is included
                    <ArrowRightIcon size={15} weight="bold" className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* the rest, quieter */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <button
                type="button"
                onClick={() => show(s)}
                className="group flex h-full w-full flex-col rounded-[var(--r-tile)] bg-[var(--white)] p-6 text-left transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5"
                style={{ boxShadow: "var(--shadow-soft)", transitionTimingFunction: "var(--ease-out)" }}
              >
                <h3 className="text-[17px] font-bold leading-snug tracking-tight text-[var(--ink)]">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-55)]">{s.short}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-[var(--green)]">
                  Details
                  <ArrowUpRightIcon size={14} weight="bold" className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal open={open} onClose={close} labelledBy="service-modal-title">
        {active && (
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            {active.image ? (
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px]">
                <Image src={active.image} alt={active.title} fill loading="eager" sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            ) : (
              <div className="hidden md:block" style={{ background: "linear-gradient(160deg, var(--green) 0%, var(--green-deeper) 100%)" }} />
            )}
            <div className="p-7 pr-16 md:p-10 md:pr-14">
              <h3 id="service-modal-title" className="text-[26px] font-bold leading-tight tracking-tight text-[var(--ink)] md:text-[30px]">
                {active.title}
              </h3>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-70)]">{active.description}</p>
              {active.note && (
                <p
                  className="mt-4 flex items-start gap-2.5 rounded-[var(--r-input)] p-4 text-[14px] leading-snug text-[var(--ink)]"
                  style={{ background: "var(--yellow-soft)" }}
                >
                  <InfoIcon size={18} weight="fill" className="mt-[1px] shrink-0" color="var(--green)" />
                  {active.note}
                </p>
              )}
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {active.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14.5px] text-[var(--ink)]">
                    <span className="mt-[3px] grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full" style={{ background: "var(--green-soft)" }}>
                      <CheckIcon size={11} weight="bold" color="var(--green)" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#estimate"
                  onClick={(e) => {
                    e.preventDefault();
                    close();
                    window.setTimeout(() => scrollToHash("#estimate"), 300);
                  }}
                  className="btn btn-primary"
                >
                  Get a Free Estimate
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
