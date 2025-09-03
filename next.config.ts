import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@clerk/nextjs"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@prisma/client', '@clerk/nextjs');
    }
    return config;
  },
};

export default nextConfig;
