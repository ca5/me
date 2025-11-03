import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isProd ? "https://ca5.me" : undefined,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
