import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staleTimes: {
    dynamic: 0,
    static: 0,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
