import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add compression for better performance
  compress: true,
  
  // Configure image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Add experimental features
  experimental: {
    // Enable modern JavaScript features
    esmExternals: true,
  },
  
  // Add headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
