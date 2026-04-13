import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // MVP 原型优先稳定性：避免图片优化超时导致 500
    unoptimized: true,
  },
};

export default nextConfig;
