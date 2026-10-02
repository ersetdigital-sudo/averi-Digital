import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow the Base44 preview origin to reach dev assets/HMR.
  allowedDevOrigins: ['3000-' + (process.env.BASE44_PUBLIC_HOST_SUFFIX || 'preview.local')],
};

export default nextConfig;