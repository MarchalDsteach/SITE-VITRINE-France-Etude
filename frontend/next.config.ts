import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
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
