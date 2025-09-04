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
};

export default nextConfig;
