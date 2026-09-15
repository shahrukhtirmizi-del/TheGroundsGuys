"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noop = () => () => {};

/** True when the OS asks for less motion. Read during render so there is no flash. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/** True on touch-first devices, where hover physics should be skipped. */
export function useCoarsePointer() {
  return useSyncExternalStore(
    noop,
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false
  );
}

/** Flips to true once the element has entered the viewport. Fires once. */
export function useInView<T extends HTMLElement>(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.25, rootMargin = "0px 0px -8% 0px" } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

/** Scrolls to a hash target through Lenis when it is running, else natively. */
export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -72, duration: 1.3 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

declare global {
  interface Window {
    __lenis?: {
      scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void;
    };
  }
}
