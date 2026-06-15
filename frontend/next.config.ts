import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/azure-devops-pro",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
