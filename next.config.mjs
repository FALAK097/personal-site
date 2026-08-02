import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const withMDX = createMDX({
  configPath: "source.config.ts",
  macro: false,
});

export default withMDX(nextConfig);
