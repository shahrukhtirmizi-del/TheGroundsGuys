/**
 * The pre-rendered map (public/map-static.webp) and the projection needed to
 * place DOM pins on it. The image is rendered by scripts/render-map.mjs at a
 * fixed centre and zoom; the page shows it at DISPLAY_ZOOM (scaled down, so
 * it stays crisp) and positions pins with plain Web Mercator maths.
 */
export const STATIC_MAP = {
  center: [-81.52, 28.22] as [number, number], // [lng, lat]
  zoom: 10, // zoom the image was rendered at
  width: 2400, // CSS px at render time
  height: 1600,
  scale: 1, // device scale factor at render time
};

export const DISPLAY_ZOOM = 9.4;

/** Web Mercator pixel coordinates at a zoom level (512px tiles, as MapLibre). */
export function mercatorPx(lng: number, lat: number, zoom: number) {
  const size = 512 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * size;
  const s = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * size;
  return { x, y };
}

/** Pixel offset of a point from the image centre, at the display zoom. */
export function offsetFromCenter(lng: number, lat: number, zoom = DISPLAY_ZOOM) {
  const c = mercatorPx(STATIC_MAP.center[0], STATIC_MAP.center[1], zoom);
  const p = mercatorPx(lng, lat, zoom);
  return { dx: p.x - c.x, dy: p.y - c.y };
}

/** Size of the image when shown at the display zoom. */
export function displayedSize() {
  const f = Math.pow(2, DISPLAY_ZOOM - STATIC_MAP.zoom);
  return { width: STATIC_MAP.width * f, height: STATIC_MAP.height * f };
}
