// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async redirects() {
//     return [
//       {
//         source: "/",
//         destination: "/login",
//         permanent: true,
//       },
//     ];
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// async headers() {
//   return [
//     {
//       source: "/(.*)",
//       headers: [
//         {
//           key: "X-Content-Type-Options",
//           value: "nosniff",
//         },
//         {
//           key: "X-Frame-Options",
//           value: "DENY",
//         },
//         {
//           key: "Referrer-Policy",
//           value: "strict-origin-when-cross-origin",
//         },
//       ],
//     },
//     {
//       source: "/sw.js",
//       headers: [
//         {
//           key: "Content-Type",
//           value: "application/javascript; charset=utf-8",
//         },
//         {
//           key: "Cache-Control",
//           value: "no-cache, no-store, must-revalidate",
//         },
//         {
//           key: "Content-Security-Policy",
//           value: "default-src 'self'; script-src 'self'",
//         },
//       ],
//     },
//   ];
// },
// };

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer(nextConfig);
// export default nextConfig;

import withSerwistInit from "@serwist/next";

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withSerwist(nextConfig);
