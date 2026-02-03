import type { NextConfig } from "next";

// Для GitHub Pages: BASE_PATH должен быть равен имени репозитория, например /test-kwork
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,

  // TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Core settings
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.mds.yandex.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mebeloptovik.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "xn--80akhhccjmaisrj.xn--p1ai",
        pathname: "/**",
      },
    ],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;
