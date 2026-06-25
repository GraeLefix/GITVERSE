import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { ppr: true },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "opengraph.githubassets.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/:owner/:repo/tree/:path*", destination: "/:owner/:repo", permanent: false },
    ];
  },
};

export default nextConfig;
