// MapLibre resolves its web worker from import.meta.url, which the bundler
// rewrites, so the worker would fetch the page instead of a script. We serve
// the worker module (and the shared chunk it imports) from /public and point
// MapLibre at it with setWorkerUrl() in MapView.tsx. Runs before dev and build.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("maplibre-gl/dist/maplibre-gl.mjs"));
const out = join(process.cwd(), "public", "maplibre");
mkdirSync(out, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(dist, f), join(out, f));
}
console.log("maplibre worker copied to public/maplibre");
