import "dotenv/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  experimental: {
    allowedDevOrigins: process.env.NEXT_DEV_ORIGIN
      ? [process.env.NEXT_DEV_ORIGIN]
      : [],
  },
};

export default nextConfig;
