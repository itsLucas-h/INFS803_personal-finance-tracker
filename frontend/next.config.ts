import "dotenv/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: process.env.NEXT_DEV_ORIGIN
      ? [process.env.NEXT_DEV_ORIGIN]
      : [],
  },
};

export default nextConfig;
