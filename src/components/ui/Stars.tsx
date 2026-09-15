"use client";

import type { CSSProperties } from "react";
import { StarIcon } from "@phosphor-icons/react";
import { useInView } from "./hooks";

/** Five stars that fill in one after another once the row is in view. */
export default function Stars({ count = 5, size = 16, className = "" }: { count?: number; size?: number; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      data-in={inView}
      className={`flex items-center gap-[3px] ${className}`}
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="star" style={{ "--i": i } as CSSProperties}>
          <StarIcon size={size} weight="fill" color="var(--yellow-muted)" />
        </span>
      ))}
    </div>
  );
}
