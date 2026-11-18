import { getAllPosts } from "@/lib/blog-source";
import { education, experiences, skillCategories } from "@/lib/about-data";
import { projects } from "@/lib/project-data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getAllPosts();

  const experienceSection = experiences
    .map(
      (job) =>
        `### ${job.title} — ${job.company} (${job.duration})\n` +
        `Technologies: ${job.technologies.join(", ")}\n` +
        job.achievements.map((a) => `- ${a}`).join("\n"),
    )
    .join("\n\n");

  const skillsSection = Object.entries(skillCategories)
    .map(([category, items]) => `- **${category}**: ${items.join(", ")}`)
    .join("\n");

  const educationSection = education
    .map((e) => `- **${e.degree}**, ${e.institution} (${e.duration}) — ${e.grade}`)
    .join("\n");

  const projectsSection = projects
    .map(
      (p) =>
        `### ${p.title}${p.kind === "work" ? " (Work)" : ""}\n` +
        `- Description: ${p.description}\n` +
        `- Stack: ${p.tags.join(", ")}\n` +
        (p.deployedUrl ? `- Live URL: ${p.deployedUrl}\n` : "") +
        (p.githubUrl ? `- GitHub: ${p.githubUrl}\n` : ""),
    )
    .join("\n");

  const postsSection = posts
    .map(
      (post) =>
        `### ${post.title}\n` +
        `- URL: ${SITE_URL}${post.url}\n` +
        `- Published: ${post.date}${post.updated ? ` (Updated: ${post.updated})` : ""}\n` +
        `- Reading Time: ${post.readingTime} min\n` +
        `- Summary: ${post.description}\n` +
        (post.tags?.length ? `- Tags: ${post.tags.join(", ")}\n` : ""),
    )
    .join("\n");

  const body = `# Falak Gala — Complete Portfolio & Engineering Context

URL: ${SITE_URL}
Role: Software & AI Engineer (Product Engineering, Next.js, FastAPI, AI Systems)
Location: Mumbai, India
Email: hi@falakgala.dev
GitHub: https://github.com/FALAK097
Portfolio Source: https://github.com/FALAK097/personal-site

## Portfolio Overview & UI/UX Architecture

falakgala.dev is an open-source, minimalist editorial developer portfolio built with Next.js 16 App Router, React 19, Tailwind CSS v4, Motion, and Fumadocs MDX, deployed on Cloudflare Workers via OpenNext with Cloudflare D1 and R2 caching. It showcases calm Geist typography, list/grid showcase toggles, hover-only image previews, interactive micro-interactions, an AI persona assistant, live Tokscale token telemetry, and full-article RSS syndication.

## Experience

${experienceSection}

## Working Stack

${skillsSection}

## Education

${educationSection}

## Projects

${projectsSection}

## Writing & Case Studies

${postsSection}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
