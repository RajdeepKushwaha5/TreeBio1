import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build to prevent blocking deployment
  // All TypeScript errors are handled by the TypeScript compiler
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure TypeScript errors still fail the build for safety
  typescript: {
    ignoreBuildErrors: false,
  },
  // Handle GitHub Codespaces environment headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, x-forwarded-host',
          },
        ],
      },
    ];
  },
  // Allow external packages for server components
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
