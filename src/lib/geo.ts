import { SERVICE_POLYGON, TOWNS } from "./site";

/** Ray-casting point-in-polygon on [lat, lng] pairs. */
export function insideServiceArea(lat: number, lng: number) {
  let inside = false;
  const poly = SERVICE_POLYGON;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function zipInServiceArea(input: string) {
  const zip = input.match(/\b(\d{5})\b/)?.[1];
  if (!zip) return null;
  const town = TOWNS.find((t) => t.zips.includes(zip));
  return town ? { zip, town } : { zip, town: null };
}

/** Nearest listed town, for the result copy. */
export function nearestTown(lat: number, lng: number) {
  let best = TOWNS[0];
  let bestD = Infinity;
  for (const t of TOWNS) {
    const d = (t.lat - lat) ** 2 + (t.lng - lng) ** 2;
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}
