"use client";

import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import Reveal from "../ui/Reveal";
import { FAQS } from "@/lib/site";

/**
 * Accordion. One open at a time; the body animates through grid rows so
 * height is never hard-coded. The plus rotates into a minus.
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <Reveal className="lg:sticky lg:top-28">
            <h2 className="h-section text-[var(--ink)]">
              Questions, <span className="em text-[var(--green)]">answered.</span>
            </h2>
            <p className="lead mt-5 max-w-[40ch]">
              What Davenport homeowners usually want to know before they call. Anything else, phone us and ask.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 70}>
                <div
                  className="rounded-[var(--r-tile)] bg-[var(--white)] transition-shadow duration-500"
                  style={{ boxShadow: isOpen ? "var(--shadow-lift)" : "var(--shadow-soft)", border: "1px solid var(--line)" }}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-body-${i}`}
                      id={`faq-btn-${i}`}
                      className="flex w-full items-center justify-between gap-6 p-5 text-left md:p-6"
                    >
                      <span className="text-[17px] font-bold leading-snug tracking-tight text-[var(--ink)] md:text-[19px]">{f.q}</span>
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-500"
                        style={{
                          background: isOpen ? "var(--green)" : "var(--green-soft)",
                          color: isOpen ? "var(--on-dark)" : "var(--green)",
                          transform: isOpen ? "rotate(135deg)" : "none",
                          transitionTimingFunction: "var(--ease-out)",
                        }}
                      >
                        <PlusIcon size={16} weight="bold" />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-body-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="acc-body" data-open={isOpen}>
                    <div>
                      <div className="px-5 pb-6 text-[15.5px] leading-relaxed text-[var(--ink-70)] md:px-6">
                        {"a" in f && f.a?.map((p) => (
                          <p key={p} className="mb-3 last:mb-0">
                            {p}
                          </p>
                        ))}
                        {"list" in f && f.list && (
                          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                            {f.list.map((item) => (
                              <li key={item} className="flex items-start gap-2.5">
                                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--yellow-muted)" }} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
