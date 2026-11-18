import { getAllPosts } from "@/lib/blog-source";
import { projects } from "@/lib/project-data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPosts();

  const projectLines = projects
    .slice(0, 6)
    .map((p) => {
      const url = p.deployedUrl || p.githubUrl || `${SITE_URL}/projects`;
      return `- [${p.title}](${url}): ${p.description}`;
    })
    .join("\n");

  const postLines = posts
    .map((post) => `- [${post.title}](${SITE_URL}${post.url}): ${post.description}`)
    .join("\n");

  const body = `# Falak Gala

> Minimalist Next.js developer portfolio and engineering blog of Falak Gala, a Software & AI Engineer in Mumbai building production AI systems, full-stack SaaS products (Waitlyze, OutCallerAI), desktop tools (Glyph), and calm editorial web interfaces.

## Portfolio Architecture & UI/UX Craft

- Stack: Next.js 16 App Router, React 19, Tailwind CSS v4, Motion, Fumadocs MDX, Cloudflare Workers (OpenNext), Cloudflare D1, Geist typography.
- Design Philosophy: Narrow editorial canvas, restrained \`#5CBEFF\` accent, flat scannable lists, list/grid view toggles, hover-only previews, interactive AI assistant, and reduced-motion support.
- Source Code: https://github.com/FALAK097/personal-site

## Key Pages

- [Home](${SITE_URL}/): Overview, featured projects, recent engineering articles, and GitHub activity.
- [Projects](${SITE_URL}/projects): Production products, AI applications, and independent tools.
- [Writing](${SITE_URL}/writing): Technical deep dives on Graph RAG, Next.js, CI/CD, and self-hosting.
- [About](${SITE_URL}/about): Engineering experience, working stack, and education.
- [Bookmarks](${SITE_URL}/bookmarks): Curated UI/UX inspiration, design systems, and developer tools.
- [Stats](${SITE_URL}/stats): Live AI token usage and Cloudflare site traffic metrics.
- [Contact](${SITE_URL}/contact): Direct contact form, Cal.com booking, and resume.
- [Resume (PDF)](${SITE_URL}/resume): Direct resume download/preview.
- [Full Context (llms-full.txt)](${SITE_URL}/llms-full.txt): Complete portfolio, experience, and article summaries.

## Featured Projects

${projectLines}

## Engineering Writing

${postLines}

## Contact & Profiles

- Email: hi@falakgala.dev
- GitHub: https://github.com/FALAK097
- X / Twitter: https://x.com/FalakGala097
- LinkedIn: https://www.linkedin.com/in/falak-gala
- DEV Community: https://dev.to/falakgala
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
