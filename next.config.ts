import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
