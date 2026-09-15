import { NextResponse } from "next/server";

/**
 * Thin geocoding proxy for the "check your address" tool. Uses OpenStreetMap
 * Nominatim (no key) with a proper identifying User-Agent, biased to Central
 * Florida. Low volume by design: one call per address check.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 160);
  if (q.length < 3) {
    return NextResponse.json({ error: "Enter an address or ZIP code." }, { status: 400 });
  }

  const query = /florida|,\s*fl\b/i.test(q) ? q : `${q}, Florida, USA`;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("q", query);
  // bias toward the Davenport / Kissimmee area
  url.searchParams.set("viewbox", "-81.9,28.5,-81.2,27.9");

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TheGroundsGuysDavenport/1.0 (service-area check; davenportfl.owner@groundsguys.com)",
        "Accept-Language": "en",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`geocoder ${res.status}`);
    const data = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    if (!data.length) return NextResponse.json({ result: null });
    const hit = data[0];
    return NextResponse.json({
      result: { lat: Number(hit.lat), lng: Number(hit.lon), label: hit.display_name },
    });
  } catch {
    return NextResponse.json({ error: "The address lookup is unavailable right now. Try a ZIP code instead." }, { status: 502 });
  }
}
