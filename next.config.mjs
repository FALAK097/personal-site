import { execSync } from "node:child_process";
import { createMDX } from "fumadocs-mdx/next";

function getLastCommitDate() {
  for (const ref of ["main", "HEAD"]) {
    try {
      const date = execSync(`git log -1 --format=%cd --date=short ${ref}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (date) return date;
    } catch {
      // try the next ref
    }
  }
  return "";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_LAST_UPDATED: getLastCommitDate(),
  },
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
