"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MLMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { SERVICE_POLYGON, TOWNS } from "@/lib/site";
import { MAP_STYLE } from "@/lib/map-style";

export type MapHandle = {
  zoomBy: (delta: number) => void;
  focusTown: (name: string) => void;
  highlight: (name: string | null) => void;
  showCheck: (lat: number, lng: number, inside: boolean, label: string) => void;
  reset: () => void;
};

const CENTER: [number, number] = [-81.52, 28.22]; // [lng, lat]
// the worker module is copied into /public by scripts/copy-maplibre-worker.mjs
maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

function pinElement(extra = "") {
  const el = document.createElement("div");
  el.className = `gg-pin ${extra}`.trim();
  el.innerHTML = "<span></span>";
  return el;
}

/**
 * The service-area map itself. MapLibre over OpenFreeMap vector tiles (no
 * key, no limits) with the small brand style in lib/map-style.ts. The service
 * boundary is a soft green fill; each town is a pin with a hover / click
 * popup. Exposes a handle so the address-check form can fly to a result and
 * drop a pin. ServiceArea mounts this only after the visitor interacts with
 * the pre-rendered StaticMap, so WebGL setup never lands mid-scroll.
 */
const MapView = forwardRef<MapHandle, { onTownActive?: (name: string | null) => void; onReady?: () => void }>(function MapView(
  { onTownActive, onReady },
  ref
) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const markers = useRef<Map<string, { marker: Marker; popup: Popup; el: HTMLDivElement }>>(new Map());
  const checkMarker = useRef<Marker | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;

    const m = new maplibregl.Map({
      container: el.current,
      style: MAP_STYLE,
      center: CENTER,
      zoom: 9.4,
      minZoom: 7,
      maxZoom: 16,
      attributionControl: { compact: true },
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
    m.on("error", (e) => console.warn("[map]", e.error?.message ?? e));
    if (process.env.NODE_ENV !== "production") (window as unknown as { __ggMap?: MLMap }).__ggMap = m;
    m.touchZoomRotate.disableRotation();

    m.on("load", () => {
      // the boundary, drawn generously around the four towns
      const ring = [...SERVICE_POLYGON, SERVICE_POLYGON[0]].map(([lat, lng]) => [lng, lat]);
      m.addSource("service-area", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } },
      });
      m.addLayer({
        id: "service-area-fill",
        type: "fill",
        source: "service-area",
        paint: { "fill-color": "#34531d", "fill-opacity": 0.12 },
      });
      m.addLayer({
        id: "service-area-line",
        type: "line",
        source: "service-area",
        paint: { "line-color": "#34531d", "line-width": 2, "line-opacity": 0.7, "line-dasharray": [2, 2.5] },
      });

      for (const t of TOWNS) {
        const pin = pinElement();
        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14, className: "gg-popup" })
          .setLngLat([t.lng, t.lat])
          .setHTML(`<strong style="display:block;font-weight:700">${t.name}, FL</strong><span style="color:#34531d">We service this area</span>`);
        const marker = new maplibregl.Marker({ element: pin, anchor: "center" }).setLngLat([t.lng, t.lat]).setPopup(popup).addTo(m);
        pin.setAttribute("role", "button");
        pin.setAttribute("tabindex", "0");
        pin.setAttribute("aria-label", `${t.name}, FL: we service this area`);
        pin.addEventListener("mouseenter", () => {
          popup.addTo(m);
          onTownActive?.(t.name);
        });
        pin.addEventListener("mouseleave", () => onTownActive?.(null));
        pin.addEventListener("click", (e) => {
          e.stopPropagation();
          m.flyTo({ center: [t.lng, t.lat], zoom: 11.5, duration: 1200 });
          popup.addTo(m);
        });
        pin.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            pin.click();
          }
        });
        markers.current.set(t.name, { marker, popup, el: pin });
      }
      onReady?.();
    });

    const store = markers.current;
    return () => {
      store.clear();
      m.remove();
      map.current = null;
    };
  }, [onTownActive, onReady]);

  useImperativeHandle(ref, () => ({
    zoomBy(delta) {
      map.current?.zoomTo((map.current?.getZoom() ?? 9.4) + delta, { duration: 500 });
    },
    highlight(name) {
      markers.current.forEach((v, n) => v.el.setAttribute("data-active", String(n === name)));
    },
    focusTown(name) {
      const m = map.current;
      const t = markers.current.get(name);
      if (!m || !t) return;
      const ll = t.marker.getLngLat();
      m.flyTo({ center: ll, zoom: 11.5, duration: 1200 });
      t.popup.addTo(m);
    },
    showCheck(lat, lng, inside) {
      const m = map.current;
      if (!m) return;
      checkMarker.current?.remove();
      const pin = pinElement("gg-pin-check");
      pin.setAttribute("data-out", String(!inside));
      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14, className: "gg-popup" }).setLngLat([lng, lat]).setHTML(
        inside
          ? `<strong style="display:block;font-weight:700">You're covered</strong><span style="color:#34531d">We service this address</span>`
          : `<strong style="display:block;font-weight:700">Just outside our area</strong><span style="color:#666c5f">Call us, we may still be able to help</span>`
      );
      const marker = new maplibregl.Marker({ element: pin, anchor: "center" }).setLngLat([lng, lat]).setPopup(popup).addTo(m);
      checkMarker.current = marker;
      m.flyTo({ center: [lng, lat], zoom: inside ? 12.5 : 9.5, duration: 1500 });
      m.once("moveend", () => popup.addTo(m));
    },
    reset() {
      const m = map.current;
      if (!m) return;
      checkMarker.current?.remove();
      checkMarker.current = null;
      markers.current.forEach((v) => v.popup.remove());
      m.flyTo({ center: CENTER, zoom: 9.4, duration: 1000 });
    },
  }));

  return <div ref={el} className="gg-map h-full w-full" aria-label="Map of The Grounds Guys service area around Davenport, FL" role="region" />;
});

export default MapView;
