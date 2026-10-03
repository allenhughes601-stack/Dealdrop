import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from Supabase storage and common affiliate/product image CDNs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
};

export default nextConfig;
