import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const catalog = {
    version: "1.0",
    name: "Falak Gala",
    url: SITE_URL,
    description:
      "Portfolio and engineering blog of Falak Gala — Software & AI Engineer building production AI systems, SaaS products (Waitlyze, OutCallerAI), and minimalist Next.js software.",
    contact: {
      email: "hi@falakgala.dev",
      url: `${SITE_URL}/contact`,
      booking: "https://cal.com/falak",
    },
    resources: [
      {
        type: "llms-txt",
        url: `${SITE_URL}/llms.txt`,
        mediaType: "text/plain",
        description: "Concise index of Falak Gala's portfolio, projects, writing, and when-to-use guidance.",
      },
      {
        type: "llms-full-txt",
        url: `${SITE_URL}/llms-full.txt`,
        mediaType: "text/plain",
        description: "Complete portfolio context including experience, skills, projects, and article summaries.",
      },
      {
        type: "markdown-mirror",
        url: `${SITE_URL}/api/md?path=/`,
        mediaType: "text/markdown",
        description:
          "Markdown representations of every public page. Also served at any canonical URL via Accept: text/markdown content negotiation.",
      },
      {
        type: "rss",
        url: `${SITE_URL}/rss.xml`,
        mediaType: "application/rss+xml",
        description: "Full-article RSS feed of engineering writing and case studies.",
      },
      {
        type: "sitemap",
        url: `${SITE_URL}/sitemap.xml`,
        mediaType: "application/xml",
        description: "XML sitemap of all indexable pages and engineering articles.",
      },
      {
        type: "resume",
        url: `${SITE_URL}/resume.pdf`,
        mediaType: "application/pdf",
        description: "Current resume of Falak Gala.",
      },
    ],
  };

  return Response.json(catalog, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
  });
}
