"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListIcon, PhoneIcon, XIcon } from "@phosphor-icons/react";
import { NAV, SITE } from "@/lib/site";
import { scrollToHash } from "../ui/hooks";

/**
 * Fixed header. Transparent over the home hero, then settles onto a solid
 * bone bar once the page scrolls past the sentinel that layout.tsx renders
 * at the top of the document. Under md the links move into a full-height
 * sheet behind the hamburger.
 */
export default function Nav({ logo, logoOnDark }: { logo: ReactNode; logoOnDark: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setAtTop(e.isIntersecting), { threshold: 0 });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const transparent = isHome && atTop && !open;

  function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) return;
    if (!isHome) return; // let Next route to /#anchor
    e.preventDefault();
    setOpen(false);
    scrollToHash(href);
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-[70] transition-[background-color,box-shadow] duration-500"
      style={{
        // a near-solid bar rather than backdrop blur: blur over a scrolling page
        // is re-rendered every frame and is the first thing to stutter
        background: transparent ? "transparent" : "rgba(248, 246, 239, 0.96)",
        boxShadow: transparent ? "none" : "0 1px 0 rgba(34,38,31,0.06), 0 12px 40px -24px rgba(52,83,29,0.25)",
        color: transparent ? "var(--on-dark)" : "var(--ink)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 md:px-8">
        <div className="relative z-10 flex items-center">{transparent ? logoOnDark : logo}</div>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={isHome ? item.href : `/${item.href}`}
              onClick={(e) => go(e, item.href)}
              className="nav-link whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={SITE.phoneHref} className="nav-link hidden items-center gap-2 whitespace-nowrap font-semibold xl:inline-flex">
            <PhoneIcon size={16} weight="fill" />
            {SITE.phone}
          </a>
          <Link
            href={isHome ? "#estimate" : "/#estimate"}
            onClick={(e) => go(e, "#estimate")}
            className={`btn ${transparent ? "btn-yellow" : "btn-primary"} !px-5 !py-3 !text-[14px]`}
          >
            Get a Free Estimate
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full lg:hidden"
          style={{ background: transparent ? "rgba(248,246,239,0.14)" : "var(--green-soft)", color: transparent ? "var(--on-dark)" : "var(--green)" }}
        >
          {open ? <XIcon size={22} weight="bold" /> : <ListIcon size={22} weight="bold" />}
        </button>
      </div>

      {/* mobile sheet */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className="fixed inset-0 top-0 z-[5] flex flex-col bg-[var(--bone)] px-6 pb-8 pt-[92px] transition-[opacity,transform] duration-500 lg:hidden"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "none" : "translateY(-8px)",
          pointerEvents: open ? "auto" : "none",
          transitionTimingFunction: "var(--ease-out)",
        }}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={isHome ? item.href : `/${item.href}`}
              onClick={(e) => go(e, item.href)}
              className="border-b py-4 text-[26px] font-bold tracking-tight text-[var(--ink)]"
              style={{
                borderColor: "var(--line)",
                transition: "opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)",
                transitionDelay: open ? `${80 + i * 50}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(10px)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <a href={SITE.phoneHref} className="btn btn-secondary w-full">
            <PhoneIcon size={16} weight="fill" />
            {SITE.phone}
          </a>
          <Link href={isHome ? "#estimate" : "/#estimate"} onClick={(e) => go(e, "#estimate")} className="btn btn-primary w-full">
            Get a Free Estimate
          </Link>
        </div>
      </div>
    </header>
  );
}
