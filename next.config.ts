import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,
  pageExtensions: ["page.tsx", "page.jsx", "page.ts", "page.js"],
};

export default nextConfig;
