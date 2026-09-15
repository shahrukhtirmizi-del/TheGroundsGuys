"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircleIcon, MagnifyingGlassIcon, MapPinIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Reveal from "../ui/Reveal";
import StaticMap from "./StaticMap";
import { SITE, TOWNS } from "@/lib/site";
import { insideServiceArea, nearestTown, zipInServiceArea } from "@/lib/geo";
import type { MapHandle } from "./MapView";

const loadMapView = () => import("./MapView");
const MapView = dynamic(loadMapView, { ssr: false });

type Pending = { kind: "check"; lat: number; lng: number; inside: boolean; label: string } | { kind: "town"; name: string } | { kind: "zoom"; delta: number };

type Result =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "in"; label: string; town: string }
  | { state: "out"; label: string; town: string }
  | { state: "error"; message: string };

/**
 * Where we work. The four towns pinned on a pre-rendered map with the
 * boundary drawn, plus an address check that geocodes the entry, flies the
 * map to it and says plainly whether it is covered. The real MapLibre map is
 * only created once the visitor zooms, drags or checks an address (its WebGL
 * setup is the single most expensive thing on the page), and the bundle is
 * warmed as soon as the address field gets focus.
 */
export default function ServiceArea() {
  const map = useRef<MapHandle>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });
  const [activeTown, setActiveTown] = useState<string | null>(null);
  const onTownActive = useCallback((name: string | null) => setActiveTown(name), []);
  const [live, setLive] = useState(false);
  const [liveReady, setLiveReady] = useState(false);
  const pending = useRef<Pending | null>(null);

  const runPending = useCallback(() => {
    const p = pending.current;
    const m = map.current;
    if (!p || !m) return;
    pending.current = null;
    if (p.kind === "check") m.showCheck(p.lat, p.lng, p.inside, p.label);
    if (p.kind === "town") m.focusTown(p.name);
    if (p.kind === "zoom") m.zoomBy(p.delta);
  }, []);

  const onReady = useCallback(() => {
    setLiveReady(true);
    runPending();
  }, [runPending]);

  /** Queue an action for the live map, creating it if this is the first interaction. */
  function withLiveMap(action: Pending) {
    if (live && liveReady && map.current) {
      if (action.kind === "check") map.current.showCheck(action.lat, action.lng, action.inside, action.label);
      if (action.kind === "town") map.current.focusTown(action.name);
      if (action.kind === "zoom") map.current.zoomBy(action.delta);
      return;
    }
    pending.current = action;
    setLive(true);
  }

  useEffect(() => {
    map.current?.highlight(activeTown);
  }, [activeTown]);

  async function check(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 3) {
      setResult({ state: "error", message: "Enter a street address or a five-digit ZIP code." });
      return;
    }
    setResult({ state: "loading" });

    // a bare ZIP we already know is an instant answer
    const zipHit = zipInServiceArea(q);
    if (zipHit && /^\d{5}$/.test(q) && zipHit.town) {
      withLiveMap({ kind: "check", lat: zipHit.town.lat, lng: zipHit.town.lng, inside: true, label: zipHit.zip });
      setResult({ state: "in", label: `ZIP ${zipHit.zip}`, town: zipHit.town.name });
      return;
    }

    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { result?: { lat: number; lng: number; label: string } | null; error?: string };
      if (!res.ok || data.error) {
        setResult({ state: "error", message: data.error ?? "Something went wrong. Please try again." });
        return;
      }
      if (!data.result) {
        setResult({ state: "error", message: "We couldn't find that address. Try adding the city, or use a ZIP code." });
        return;
      }
      const { lat, lng, label } = data.result;
      const inside = insideServiceArea(lat, lng) || Boolean(zipHit?.town);
      const town = nearestTown(lat, lng).name;
      withLiveMap({ kind: "check", lat, lng, inside, label });
      const short = label.split(",").slice(0, 3).join(",");
      setResult(inside ? { state: "in", label: short, town } : { state: "out", label: short, town });
    } catch {
      setResult({ state: "error", message: "The lookup is unavailable right now. Call us and we'll confirm by phone." });
    }
  }

  function reset() {
    setQuery("");
    setResult({ state: "idle" });
    pending.current = null;
    map.current?.reset();
  }

  return (
    <section id="service-area" className="scroll-mt-20 py-20 md:py-28" style={{ background: "var(--bone-2)" }}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <Reveal className="max-w-[820px]">
          <h2 className="h-section text-[var(--ink)]">
            Serving Davenport and the <span className="em text-[var(--green)]">neighbors next door.</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-[1fr_1.6fr]">
          {/* left: the checker and the town list */}
          <Reveal className="flex flex-col gap-5">
            <form
              onSubmit={check}
              className="rounded-[var(--r-card)] bg-[var(--white)] p-6"
              style={{ boxShadow: "var(--shadow-soft)", border: "1px solid var(--line)" }}
              aria-labelledby="check-h"
            >
              <h3 id="check-h" className="text-[19px] font-bold tracking-tight text-[var(--ink)]">
                Check your address
              </h3>
              <p className="mt-1.5 text-[14px] text-[var(--ink-55)]">Street address or ZIP code. We&rsquo;ll show you on the map.</p>
              <label htmlFor="address-check" className="sr-only">
                Address or ZIP code
              </label>
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <MapPinIcon size={18} weight="fill" color="var(--ink-40)" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="address-check"
                    type="text"
                    autoComplete="street-address"
                    inputMode="text"
                    placeholder="123 Main St, Davenport or 33837"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => void loadMapView()}
                    className="field !pl-11"
                  />
                </div>
                <button type="submit" className="btn btn-primary !px-4" disabled={result.state === "loading"} aria-label="Check address">
                  <MagnifyingGlassIcon size={18} weight="bold" />
                </button>
              </div>

              <div aria-live="polite" className="mt-4 min-h-[24px] text-[14.5px]">
                {result.state === "loading" && <p className="text-[var(--ink-55)]">Looking that up&hellip;</p>}
                {result.state === "in" && (
                  <p className="flex items-start gap-2 rounded-[var(--r-input)] p-3.5 text-[var(--green-deeper)]" style={{ background: "var(--green-soft)" }}>
                    <CheckCircleIcon size={20} weight="fill" color="var(--green)" className="shrink-0" />
                    <span>
                      <strong>Good news, we cover {result.label}.</strong> That&rsquo;s in our {result.town} service zone.{" "}
                      <button type="button" onClick={reset} className="underline underline-offset-2">
                        Check another
                      </button>
                    </span>
                  </p>
                )}
                {result.state === "out" && (
                  <p className="flex items-start gap-2 rounded-[var(--r-input)] p-3.5 text-[var(--ink)]" style={{ background: "var(--yellow-soft)" }}>
                    <WarningCircleIcon size={20} weight="fill" color="#a13c22" className="shrink-0" />
                    <span>
                      <strong>{result.label} sits just outside our usual area.</strong> Closest zone is {result.town}. Call{" "}
                      <a href={SITE.phoneHref} className="font-semibold underline underline-offset-2">
                        {SITE.phone}
                      </a>{" "}
                      and we&rsquo;ll see what we can do.{" "}
                      <button type="button" onClick={reset} className="underline underline-offset-2">
                        Check another
                      </button>
                    </span>
                  </p>
                )}
                {result.state === "error" && (
                  <p className="flex items-start gap-2 text-[#a13c22]">
                    <WarningCircleIcon size={20} weight="fill" className="shrink-0" />
                    {result.message}
                  </p>
                )}
              </div>
            </form>

            <ul className="grid grid-cols-2 gap-2.5" aria-label="Towns we serve">
              {TOWNS.map((t) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => withLiveMap({ kind: "town", name: t.name })}
                    onMouseEnter={() => setActiveTown(t.name)}
                    onMouseLeave={() => setActiveTown(null)}
                    className="flex w-full items-center gap-2.5 rounded-[var(--r-tile)] px-4 py-3.5 text-left text-[15px] font-semibold transition-[background-color,transform,box-shadow] duration-400 hover:-translate-y-0.5"
                    style={{
                      background: activeTown === t.name ? "var(--green)" : "var(--white)",
                      color: activeTown === t.name ? "var(--on-dark)" : "var(--ink)",
                      boxShadow: "var(--shadow-soft)",
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  >
                    <MapPinIcon size={18} weight="fill" color={activeTown === t.name ? "var(--yellow)" : "var(--green)"} />
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>

            <p className="hidden rounded-[var(--r-tile)] p-5 text-[14.5px] leading-relaxed text-[var(--ink-70)] lg:block" style={{ background: "var(--green-soft)" }}>
              Not on the list? We take on properties just beyond these towns when the route allows. Call{" "}
              <a href={SITE.phoneHref} className="font-semibold text-[var(--green)] underline underline-offset-2">
                {SITE.phone}
              </a>{" "}
              and ask.
            </p>
          </Reveal>

          {/* right: the map */}
          <Reveal delay={120} className="relative min-h-[380px] overflow-hidden rounded-[var(--r-card)] md:min-h-[520px]" style={{ boxShadow: "var(--shadow-lift)", border: "1px solid var(--line)" }}>
            {/* the pre-rendered map stays underneath until the live one has loaded */}
            <StaticMap
              activeTown={activeTown}
              onTownActive={onTownActive}
              onTownClick={(name) => withLiveMap({ kind: "town", name })}
              onInteract={(a) => withLiveMap(a === "in" ? { kind: "zoom", delta: 1 } : a === "out" ? { kind: "zoom", delta: -1 } : { kind: "zoom", delta: 0 })}
            />
            {live && (
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: liveReady ? 1 : 0, pointerEvents: liveReady ? "auto" : "none" }}
              >
                <MapView ref={map} onTownActive={onTownActive} onReady={onReady} />
              </div>
            )}
            {live && !liveReady && (
              <p className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-semibold" style={{ background: "var(--white)", color: "var(--green)", boxShadow: "var(--shadow-soft)" }}>
                Loading map&hellip;
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
