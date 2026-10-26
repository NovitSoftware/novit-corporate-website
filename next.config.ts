import type { NextConfig } from "next";
import photoWidths from "./src/lib/photo-widths.json";

// Set by the Pages workflow to the repository's sub-path; empty elsewhere.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath,
  // `/ruta/index.html` instead of `/ruta.html`: Pages would otherwise find the
  // `/ruta/` folder of RSC payloads first and answer 404.
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Only the widths `scripts/photos.mjs` writes, so every `srcset` entry
    // `next/image` lists for a photograph is a file that exists.
    imageSizes: photoWidths.imageSizes,
    deviceSizes: photoWidths.deviceSizes,
  },
  reactCompiler: true,
  allowedDevOrigins: ['192.168.109.155'],

};

export default nextConfig;
