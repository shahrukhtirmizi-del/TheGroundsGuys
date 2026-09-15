import Image from "next/image";
import Reveal from "../ui/Reveal";
import ScrollWords from "../ui/ScrollWords";
import { CARES, GUARANTEE } from "@/lib/site";

/**
 * Who does the work and what they promise. The guarantee reads itself in
 * word by word as it scrolls through the viewport; the five C.A.R.E.S.
 * values arrive one after another beside the crew photo.
 */
export default function Cares() {
  return (
    <section id="team" className="scroll-mt-20 py-20 md:py-28" style={{ background: "var(--green-deeper)", color: "var(--on-dark)" }}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <ScrollWords
          as="p"
          text={GUARANTEE}
          className="max-w-[26ch] text-[30px] font-bold leading-[1.12] tracking-[-0.025em] md:max-w-[30ch] md:text-[48px]"
        />

        <div className="mt-16 grid items-stretch gap-10 md:mt-24 md:grid-cols-[1fr_1.05fr] md:gap-14">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[var(--r-card)] md:aspect-auto md:min-h-[560px]" style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)" }}>
            <Image src="/team-crew.jpg" alt="The Grounds Guys of Davenport crew beside their trailer" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </Reveal>

          <div>
            <Reveal>
              <h2 className="h-section" style={{ color: "var(--on-dark)" }}>
                The Grounds Guys <span className="em" style={{ color: "var(--yellow)" }}>C.A.R.E.S.</span>
              </h2>
            </Reveal>
            <ol className="mt-8 flex flex-col gap-3">
              {CARES.map((c, i) => (
                <Reveal key={c.letter} as="li" delay={150 + i * 140} threshold={0.3}>
                  <div
                    className="flex gap-4 rounded-[var(--r-tile)] p-4 md:p-5"
                    style={{ background: "rgba(248, 246, 239, 0.06)", border: "1px solid var(--line-dark)" }}
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[18px] font-extrabold"
                      style={{ background: "var(--yellow)", color: "var(--green-deeper)" }}
                    >
                      {c.letter}
                    </span>
                    <div>
                      <h3 className="text-[18px] font-bold tracking-tight">{c.word}</h3>
                      <p className="mt-1 text-[14.5px] leading-relaxed" style={{ color: "var(--on-dark-70)" }}>
                        {c.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
