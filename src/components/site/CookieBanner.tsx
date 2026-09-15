"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "gg-cookie-consent";

/**
 * Cookie notice. The choice is remembered in localStorage; "Accept" is the
 * signal any future analytics should key off (nothing is loaded before it).
 */
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = window.setTimeout(() => setShow(true), 1400);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* storage unavailable: stay quiet rather than nag on every load */
    }
  }, []);

  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("gg-consent", { detail: value }));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="modal-panel fixed inset-x-3 bottom-3 z-[75] mx-auto max-w-[520px] rounded-[var(--r-tile)] bg-[var(--white)] p-5 sm:inset-x-auto sm:right-6 sm:bottom-6"
      style={{ boxShadow: "var(--shadow-lift)", border: "1px solid var(--line)" }}
    >
      <p className="text-[14px] leading-relaxed text-[var(--ink-70)]">
        We use a few cookies to understand how the site is used and to keep the estimate form working. Decline and only
        the essentials run.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => choose("accepted")} className="btn btn-primary !px-5 !py-3 !text-[14px]">
          Accept
        </button>
        <button type="button" onClick={() => choose("declined")} className="btn btn-secondary !px-5 !py-3 !text-[14px]">
          Decline
        </button>
        <Link href="/privacy" className="nav-link ml-auto text-[13px] text-[var(--ink-55)]">
          Privacy
        </Link>
      </div>
    </div>
  );
}
