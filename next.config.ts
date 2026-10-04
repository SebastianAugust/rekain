import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [{ source: "/simulasi", destination: "/analisis-sensitivitas", permanent: true }];
  },
  // AVIF first: the logo mark is a flat-colour drawing and compresses far smaller than WebP.
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;