import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.cizzara.com',
      },
      // If you ever need to add other CDNs, add them here
    ],
  },
    allowedDevOrigins: ['192.168.31.196'],
};

export default nextConfig;