// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
      
        hostname: 'fakestoreapi.com',
        pathname: '/img/**', 
      },
    ],
  },
};

export default nextConfig;
