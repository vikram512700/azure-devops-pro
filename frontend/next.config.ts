import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/azure-devops-pro",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
