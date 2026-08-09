import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['192.168.208.2'],
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;