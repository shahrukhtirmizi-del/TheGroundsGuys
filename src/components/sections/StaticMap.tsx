"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { TOWNS } from "@/lib/site";
import { displayedSize, offsetFromCenter } from "@/lib/static-map";

/**
 * The map as first seen: a pre-rendered image of the styled map (see
 * scripts/render-map.mjs) with real DOM pins, hover popups and zoom buttons
 * laid over it by Web Mercator maths. Costs nothing to scroll past. Any
 * gesture that needs a real map (zoom, drag, an address check) calls
 * onInteract and ServiceArea swaps in the live MapLibre map on top.
 */
export default function StaticMap({
  activeTown,
  onTownActive,
  onTownClick,
  onInteract,
}: {
  activeTown: string | null;
  onTownActive: (name: string | null) => void;
  onTownClick: (name: string) => void;
  onInteract: (action: "in" | "out" | "drag") => void;
}) {
  const { width, height } = displayedSize();
  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      style={{ background: "#f1eee4", cursor: "grab" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "IMG") onInteract("drag");
      }}
    >
      <div className="absolute left-1/2 top-1/2" style={{ width, height, transform: "translate(-50%, -50%)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/map-static.webp"
          alt="Map of the area around Davenport, Kissimmee, Intercession City and Loughman, Florida, with the service area outlined"
          width={width}
          height={height}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full"
        />
        {TOWNS.map((t) => {
          const { dx, dy } = offsetFromCenter(t.lng, t.lat);
          const active = activeTown === t.name;
          return (
            <div
              key={t.name}
              className="absolute"
              style={{ left: `calc(50% + ${dx.toFixed(1)}px)`, top: `calc(50% + ${dy.toFixed(1)}px)`, transform: "translate(-50%, -50%)" }}
            >
              <button
                type="button"
                className="gg-pin block"
                data-active={active}
                aria-label={`${t.name}, FL: we service this area`}
                onMouseEnter={() => onTownActive(t.name)}
                onMouseLeave={() => onTownActive(null)}
                onFocus={() => onTownActive(t.name)}
                onBlur={() => onTownActive(null)}
                onClick={() => onTownClick(t.name)}
              >
                <span />
              </button>
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-max -translate-x-1/2 rounded-[14px] px-3.5 py-2.5 text-[14px] leading-snug transition-[opacity,transform] duration-300"
                style={{
                  background: "var(--white)",
                  color: "var(--ink)",
                  boxShadow: "var(--shadow-lift)",
                  opacity: active ? 1 : 0,
                  transform: `translate(-50%, ${active ? "0" : "6px"})`,
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                <strong className="block font-bold">{t.name}, FL</strong>
                <span style={{ color: "var(--green)" }}>We service this area</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* zoom controls, matching the live map's */}
      <div className="absolute left-3 top-3 flex flex-col overflow-hidden rounded-[12px]" style={{ background: "var(--white)", boxShadow: "var(--shadow-soft)" }}>
        <button type="button" aria-label="Zoom in" onClick={() => onInteract("in")} className="grid h-[34px] w-[34px] place-items-center text-[var(--green)]">
          <PlusIcon size={16} weight="bold" />
        </button>
        <button type="button" aria-label="Zoom out" onClick={() => onInteract("out")} className="grid h-[34px] w-[34px] place-items-center text-[var(--green)]" style={{ borderTop: "1px solid var(--line)" }}>
          <MinusIcon size={16} weight="bold" />
        </button>
      </div>

      <p className="absolute bottom-0 right-0 rounded-tl-[8px] px-2 py-1 text-[10px]" style={{ background: "rgba(248,246,239,0.85)", color: "var(--ink-55)" }}>
        <a href="https://openfreemap.org" target="_blank" rel="noreferrer" style={{ color: "var(--green)" }}>OpenFreeMap</a>{" "}
        <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer" style={{ color: "var(--green)" }}>&copy; OpenMapTiles</a> Data from{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" style={{ color: "var(--green)" }}>OpenStreetMap</a>
      </p>
    </div>
  );
}
