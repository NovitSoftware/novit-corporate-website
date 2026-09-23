import type { NextConfig } from "next";

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
  },
  reactCompiler: true,
  allowedDevOrigins: ['192.168.109.155'],

};

export default nextConfig;
