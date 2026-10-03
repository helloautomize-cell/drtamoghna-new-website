import type { NextConfig } from "next";

const indexable = process.env.SITE_INDEXABLE === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  async headers() {
    if (indexable) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
