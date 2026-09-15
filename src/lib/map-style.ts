import type { StyleSpecification } from "maplibre-gl";

/**
 * A deliberately small map style in the site palette, over OpenFreeMap's
 * OpenMapTiles vector source (no key, no limits). Nine layers of four types
 * (background, fill, line, symbol) instead of Positron's fifty-odd: fewer
 * shader programs to compile, which is what used to freeze the page for a
 * second on integrated graphics.
 */
export const MAP_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#f1eee4" } },
    {
      id: "landcover",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      paint: { "fill-color": "#e3e9d6", "fill-opacity": 0.7 },
    },
    {
      id: "park",
      type: "fill",
      source: "omt",
      "source-layer": "park",
      paint: { "fill-color": "#dde6cc", "fill-opacity": 0.8 },
    },
    {
      id: "residential",
      type: "fill",
      source: "omt",
      "source-layer": "landuse",
      filter: ["==", ["get", "class"], "residential"],
      paint: { "fill-color": "#ebe7dc" },
    },
    {
      id: "water",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      paint: { "fill-color": "#cdd8c3" },
    },
    {
      id: "roads-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 11,
      filter: ["match", ["get", "class"], ["minor", "service", "tertiary"], true, false],
      paint: {
        "line-color": "#fbfaf5",
        "line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.6, 15, 2.5],
      },
    },
    {
      id: "roads-major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: ["match", ["get", "class"], ["motorway", "trunk", "primary", "secondary"], true, false],
      paint: {
        "line-color": "#fffdf8",
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.8, 14, 4],
      },
    },
    {
      id: "boundary",
      type: "line",
      source: "omt",
      "source-layer": "boundary",
      filter: ["<=", ["get", "admin_level"], 6],
      paint: { "line-color": "#b9bdb0", "line-dasharray": [3, 2], "line-width": 1 },
    },
    {
      id: "places",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      filter: ["match", ["get", "class"], ["city", "town", "village", "suburb", "hamlet"], true, false],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["match", ["get", "class"], "city", 14, "town", 13, 11],
        "text-max-width": 8,
      },
      paint: {
        "text-color": "#5c6255",
        "text-halo-color": "rgba(248,246,239,0.9)",
        "text-halo-width": 1.2,
      },
    },
  ],
};
