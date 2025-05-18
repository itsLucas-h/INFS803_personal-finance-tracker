import "dotenv/config";

const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;
