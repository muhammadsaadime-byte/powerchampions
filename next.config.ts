import type { NextConfig } from "next";

/** 301s from SITEMAP.md ("Redirects"). Kept as 301 (not Next's default 308) per the brief. */
const legacy: Array<[string, string]> = [
  // Already 301s on the live HubSpot site — preserve them.
  ["/about-us", "/who-we-are"],
  ["/mission", "/who-we-are"],
  ["/our-locations", "/locations"],
  // Old HubSpot short URL for Episode 1. Posts aren't rebuilt (scope), so send it to the podcast listing.
  ["/ad0d269a-9e90-4572-a91e-5d673aacd3c1", "/podcast"],
  // HubSpot archives that won't exist on the new site → their listing page.
  ["/:kind(blogs|news|podcast)/tag/:tag*", "/:kind"],
  ["/:kind(blogs|news|podcast)/author/:author*", "/:kind"],
  ["/:kind(blogs|news|podcast)/page/:n*", "/:kind"],
  // HubSpot site search.
  ["/hs-search-results", "/"],
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // AVIF first (smallest), WebP fallback; browsers without either get the original.
    formats: ["image/avif", "image/webp"],
    // Next 16 only allows quality 75 by default. 60 is for large decorative backgrounds behind dark overlays.
    qualities: [60, 65, 70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, statusCode: 301 as const }));
  },
};

export default nextConfig;
