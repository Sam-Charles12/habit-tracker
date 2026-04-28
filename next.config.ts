import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure headers for PWA offline support and caching strategy
  async headers() {
    return [
      // HTML pages - network first, short cache for freshness
      {
        source: "/:path((?!_next|static|public|icon\\.svg|manifest\\.json).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Next.js static assets (JS/CSS bundles) - cache aggressively with immutable
      {
        source: "/:path(_next/static.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Public static assets (SVG, manifest, etc) - cache with revalidation
      {
        source: "/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
      // Manifest and icon files - cache with revalidation
      {
        source: "/:path(manifest\\.json|icon\\.svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=2592000",
          },
        ],
      },
      // Service Worker - never cache, always check for updates
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
