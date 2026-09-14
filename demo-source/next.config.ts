import type { NextConfig } from "next";
const config: NextConfig = { output: "export", basePath: "/kanatzidis-demo", trailingSlash: true, images: { unoptimized: true } };
export default config;
