import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The client supplies the real Grounds Guys logo as-is. Drop it into /public
 * as one of the filenames below and the header, footer and favicon pick it
 * up automatically; until then a brand-styled wordmark stands in.
 */
const CANDIDATES = ["logo.svg", "logo.png", "logo.webp"];
const MARK_CANDIDATES = ["logo-mark.png", "logo-mark.svg", "logo-mark.webp"];

export function getLogoSrc(): string | null {
  for (const name of CANDIDATES) {
    if (existsSync(join(process.cwd(), "public", name))) return `/${name}`;
  }
  return null;
}

export function getLogoMarkPath(): string | null {
  for (const name of MARK_CANDIDATES) {
    const p = join(process.cwd(), "public", name);
    if (existsSync(p)) return p;
  }
  return null;
}
