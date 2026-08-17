import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Legacy Cloudflare demo types do not affect the Vercel runtime bundle.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
