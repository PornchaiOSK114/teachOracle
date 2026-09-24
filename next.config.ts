import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep owner-maintained agent instructions unchanged when running Next.js.
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
