"use client";

import { useEffect } from "react";

/**
 * Slightly weighted scroll, site-wide. Lenis drives the real window scroll
 * from a rAF loop, so sticky and fixed positioning keep working. Skipped on
 * touch devices (they scroll natively) and under reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      });
      lenis = instance;
      window.__lenis = instance as unknown as Window["__lenis"];
      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
