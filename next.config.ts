import type { NextConfig } from "next";

/**
 * SCRUM-114: Konfigurasi optimasi performa Next.js
 * untuk memastikan load time halaman < 2 detik.
 * - compress: mengaktifkan Gzip/Brotli pada aset statis & HTML
 * - poweredByHeader: false → kurangi header response yang tidak perlu
 * - optimizePackageImports → tree-shake library bawaan React
 */
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
