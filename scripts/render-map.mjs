// Pre-renders the service-area map to public/map-static.webp using the same
// MapLibre style the live map uses (src/lib/map-style.ts), so the page can
// show the map instantly with no WebGL work, and only start the real map when
// a visitor interacts with it. Re-run after changing the style, the towns or
// the service polygon:
//
//   node --experimental-strip-types scripts/render-map.mjs
//
// Needs Microsoft Edge or Google Chrome installed (playwright-core drives it).
import http from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { chromium } from "playwright-core";
import { MAP_STYLE } from "../src/lib/map-style.ts";
import { SERVICE_POLYGON } from "../src/lib/site.ts";
import { STATIC_MAP } from "../src/lib/static-map.ts";

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("maplibre-gl/dist/maplibre-gl.mjs"));
const PORT = 3999;

const html = `<!doctype html><html><head><link rel="stylesheet" href="/maplibre-gl.css">
<style>html,body{margin:0;background:#f1eee4}#map{width:${STATIC_MAP.width}px;height:${STATIC_MAP.height}px}.maplibregl-ctrl{display:none!important}</style>
</head><body><div id="map"></div>
<script type="module">
import * as maplibregl from "/maplibre-gl.mjs";
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
const style = await fetch("/style.json").then(r => r.json());
const ring = ${JSON.stringify([...SERVICE_POLYGON, SERVICE_POLYGON[0]].map(([lat, lng]) => [lng, lat]))};
const m = new maplibregl.Map({ container: "map", style, center: ${JSON.stringify(STATIC_MAP.center)}, zoom: ${STATIC_MAP.zoom}, attributionControl: false, interactive: false, fadeDuration: 0 });
m.on("load", () => {
  m.addSource("sa", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } } });
  m.addLayer({ id: "sa-fill", type: "fill", source: "sa", paint: { "fill-color": "#34531d", "fill-opacity": 0.12 } });
  m.addLayer({ id: "sa-line", type: "line", source: "sa", paint: { "line-color": "#34531d", "line-width": 2, "line-opacity": 0.7, "line-dasharray": [2, 2.5] } });
  m.once("idle", () => { window.__done = true; });
});
</script></body></html>`;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/") return res.writeHead(200, { "content-type": "text/html" }).end(html);
    if (req.url === "/style.json") return res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(MAP_STYLE));
    const file = join(dist, req.url.slice(1));
    const body = await readFile(file);
    const type = req.url.endsWith(".css") ? "text/css" : "text/javascript";
    res.writeHead(200, { "content-type": type }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "msedge", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: STATIC_MAP.width, height: STATIC_MAP.height }, deviceScaleFactor: STATIC_MAP.scale });
await page.goto(`http://localhost:${PORT}/`);
await page.waitForFunction(() => window.__done === true, null, { timeout: 90000 });
await page.waitForTimeout(500);
const png = await page.locator("#map").screenshot({ type: "png" });
await browser.close();
server.close();

const sharp = require("sharp");
const out = join(process.cwd(), "public", "map-static.webp");
const info = await sharp(png).webp({ quality: 80 }).toFile(out);
console.log(`wrote ${out}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
