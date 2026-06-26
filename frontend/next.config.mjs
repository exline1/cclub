import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei"
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "three": require.resolve("three"),
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ["three"]
  }
};

export default nextConfig;
