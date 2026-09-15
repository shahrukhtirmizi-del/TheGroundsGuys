"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "./hooks";

/**
 * Fades and lifts its children in as they enter the viewport. `delay` (ms)
 * staggers siblings; the transition itself lives in globals.css (.reveal).
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  threshold,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: threshold ?? 0.2 });
  return (
    <Tag
      ref={ref}
      data-in={inView}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
