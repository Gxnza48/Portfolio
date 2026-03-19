import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.wordpress.com"
      },
      {
        protocol: "https",
        hostname: "www.google.com"
      }
    ]
  }
};

export default nextConfig;
