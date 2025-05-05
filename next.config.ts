// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        pathname: '/img/**',
      },
    ],
    // Define small responsive sizes
    deviceSizes: [320, 480, 640, 768, 1024],  // Mobile-first, saves bandwidth
    imageSizes: [16, 32, 48, 64, 96],         // For icon/small images
    formats: ['image/webp'],                  // Use WebP for smaller file size
  },
};

export default nextConfig;
