"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "./hooks";

/**
 * Counts from zero to `to` once the number scrolls into view. Eased so the
 * last digits settle rather than snap. Tabular figures keep the width steady.
 */
export default function CountUp({
  to,
  suffix = "",
  decimals = 0,
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      raf.current = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf.current);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(to * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
