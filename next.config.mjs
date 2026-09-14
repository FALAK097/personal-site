import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/blog/:slug*", destination: "/writing/:slug*", permanent: true },
      { source: "/hire-me", destination: "/contact", permanent: true },
    ];
  },
};

const withMDX = createMDX({
  configPath: "source.config.ts",
  macro: false,
});

export default withMDX(nextConfig);
