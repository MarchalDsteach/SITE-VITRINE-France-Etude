import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      { source: "/gestion", destination: "/dashboard/admin" },
      {
        source: "/gestion/:path*",
        destination: "/dashboard/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
