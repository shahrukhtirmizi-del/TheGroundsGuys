"use client";

import { useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useCoarsePointer, useReducedMotion } from "./hooks";

/**
 * A card that leans a few degrees toward the pointer and lifts on hover.
 * The tilt is written straight to the element style on pointer move, so no
 * React re-render happens per frame. Touch devices and reduced motion get a
 * plain lift.
 */
export default function TiltCard({
  children,
  className = "",
  style,
  max = 6,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();

  function onMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (reduce || coarse) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-8px) scale(1.015)`;
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt group relative block w-full text-left ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.6s var(--ease-out), box-shadow 0.6s var(--ease-out)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
