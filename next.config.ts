import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Only for development - Vercel will check types during deployment
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
