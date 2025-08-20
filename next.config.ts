import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/HoWo',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
