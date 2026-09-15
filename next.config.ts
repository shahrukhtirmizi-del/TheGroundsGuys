import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // WebP only: AVIF is smaller but decodes several times slower, and the
  // decode of a large photo as it scrolls into view is what drops frames
  images: { formats: ["image/webp"] },
};

export default nextConfig;
