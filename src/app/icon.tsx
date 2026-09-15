import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { getLogoMarkPath } from "@/lib/logo";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Favicon. Serves the client's own logo mark from /public/logo-mark.png as
 * soon as it is supplied; until then, a brand-colored tile stands in.
 */
export default async function Icon() {
  const mark = getLogoMarkPath();
  if (mark && mark.endsWith(".png")) {
    const file = await readFile(mark);
    return new Response(new Uint8Array(file), { headers: { "Content-Type": "image/png" } });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#34531d",
          borderRadius: 16,
          color: "#f6d859",
          fontSize: 40,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        G
      </div>
    ),
    size
  );
}
