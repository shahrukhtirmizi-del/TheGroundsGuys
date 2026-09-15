"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@phosphor-icons/react";

const EXIT_MS = 280;

/**
 * Centered dialog over a blurred backdrop. Opens with a gentle scale and
 * fade, closes the same way: when `open` flips to false the panel stays
 * mounted in a closing state for the exit animation, then unmounts. Closes
 * on the X, on backdrop click and on Escape, and returns focus to whatever
 * opened it.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [closing, setClosing] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  // derive the closing state during render, so no effect has to set state
  if (open !== prevOpen) {
    setPrevOpen(open);
    setClosing(!open);
  }

  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => {
      setClosing(false);
      if (opener.current instanceof HTMLElement) opener.current.focus();
    }, EXIT_MS);
    return () => window.clearTimeout(t);
  }, [closing]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open && !closing) return null;

  return createPortal(
    <div
      className="modal-backdrop fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6"
      data-closing={closing}
      style={{
        background: "rgba(33, 54, 18, 0.42)",
        backdropFilter: "blur(14px) saturate(120%)",
        WebkitBackdropFilter: "blur(14px) saturate(120%)",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-closing={closing}
        className="modal-panel relative max-h-[92dvh] w-full max-w-[880px] overflow-y-auto rounded-[var(--r-card)] bg-[var(--white)] outline-none"
        style={{ boxShadow: "var(--shadow-modal)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-[var(--bone)] text-[var(--ink)] transition-transform duration-300 hover:scale-105 hover:bg-[var(--green-soft)]"
        >
          <XIcon size={18} weight="bold" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
