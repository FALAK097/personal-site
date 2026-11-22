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
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_LAST_UPDATED: getLastCommitDate(),
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/blog/:slug*", destination: "/writing/:slug*", permanent: true },
      { source: "/hire-me", destination: "/contact", permanent: true },
      { source: "/resume", destination: "/resume.pdf", permanent: true },
      { source: "/cv", destination: "/resume.pdf", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</llms.txt>; rel="describedby"; type="text/plain", </llms-full.txt>; rel="alternate"; type="text/plain", </.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/json", </rss.xml>; rel="alternate"; type="application/rss+xml", </api/md?path=%2F>; rel="alternate"; type="text/markdown"',
          },
        ],
      },
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'inline; filename="Falak-Gala-Resume.pdf"',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  configPath: "source.config.ts",
  macro: false,
});

export default withMDX(nextConfig);
