import { getAllPosts, getPostBySlug } from "@/lib/blog-source";
import { education, experiences, skillCategories } from "@/lib/about-data";
import { projects } from "@/lib/project-data";
import { SITE_URL } from "@/lib/site";

function estimateTokens(text) {
  return Math.max(1, Math.ceil(text.length / 4));
}

function normalizePath(rawPath) {
  if (!rawPath) return "/";
  const trimmed = rawPath.split("?")[0].split("#")[0].trim();
  if (!trimmed || trimmed === "/") return "/";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

function buildResult(path, content) {
  const canonicalUrl = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return {
    canonicalUrl,
    content,
    tokens: estimateTokens(content),
  };
}

export async function renderMarkdownRoute(rawPath) {
  const path = normalizePath(rawPath);

  if (path === "/") {
    const posts = await getAllPosts();
    const recentProjects = projects.slice(0, 5);
    const recentPosts = posts.slice(0, 5);

    const projectLines = recentProjects
      .map((p) => {
        const url = p.deployedUrl || p.githubUrl || `${SITE_URL}/projects`;
        return `- [${p.title}](${url}): ${p.description} (Stack: ${p.tags.join(", ")})`;
      })
      .join("\n");

    const postLines = recentPosts
      .map(
        (post) =>
          `- [${post.title}](${SITE_URL}${post.url}) (${post.date}) — ${post.description}`,
      )
      .join("\n");

    const content = `# Falak Gala — Software, AI & Next.js Product Engineer

> Minimalist Next.js developer portfolio and engineering blog of Falak Gala, a Software & AI Engineer based in Mumbai, India. Building production AI systems (Graph RAG, AI voice agents), full-stack SaaS products (Waitlyze, OutCallerAI), desktop tools (Glyph), and high-craft web software.

## Navigation
- [Home](${SITE_URL}/)
- [About](${SITE_URL}/about)
- [Projects](${SITE_URL}/projects)
- [Writing](${SITE_URL}/writing)
- [Bookmarks](${SITE_URL}/bookmarks)
- [Stats](${SITE_URL}/stats)
- [Contact](${SITE_URL}/contact)
- [Resume (PDF)](${SITE_URL}/resume.pdf)
- [LLMs Index](${SITE_URL}/llms.txt)
- [Full LLMs Context](${SITE_URL}/llms-full.txt)

## Featured Projects
${projectLines}

## Recent Engineering Writing
${postLines}

## Contact & Profiles
- Email: hi@falakgala.dev
- Book a call: https://cal.com/falak
- GitHub: https://github.com/FALAK097
- X / Twitter: https://x.com/FalakGala097
- LinkedIn: https://www.linkedin.com/in/falak-gala
`;
    return buildResult("/", content);
  }

  if (path === "/about") {
    const expSection = experiences
      .map(
        (job) =>
          `### ${job.title} — ${job.company} (${job.duration})\n` +
          `Technologies: ${job.technologies.join(", ")}\n\n` +
          job.achievements.map((a) => `- ${a}`).join("\n"),
      )
      .join("\n\n");

    const skillsSection = Object.entries(skillCategories)
      .map(([category, items]) => `- **${category}**: ${items.join(", ")}`)
      .join("\n");

    const eduSection = education
      .map((e) => `- **${e.degree}**, ${e.institution} (${e.duration}) — ${e.grade}`)
      .join("\n");

    const content = `# About Falak Gala

Software & AI Engineer based in Mumbai, India, building across product engineering, AI systems, infrastructure, and full-stack Next.js and FastAPI software.

## Experience

${expSection}

## Working Stack

${skillsSection}

## Education

${eduSection}

## Links
- [Projects](${SITE_URL}/projects)
- [Writing](${SITE_URL}/writing)
- [Contact](${SITE_URL}/contact)
- [Resume (PDF)](${SITE_URL}/resume.pdf)
`;
    return buildResult("/about", content);
  }

  if (path === "/projects") {
    const projectSection = projects
      .map(
        (p) =>
          `## ${p.title}${p.kind === "work" ? " (Work)" : ""}\n` +
          `${p.description}\n\n` +
          `- Stack: ${p.tags.join(", ")}\n` +
          (p.deployedUrl ? `- Live URL: ${p.deployedUrl}\n` : "") +
          (p.githubUrl ? `- GitHub: ${p.githubUrl}\n` : ""),
      )
      .join("\n");

    const content = `# Projects — Falak Gala

Production SaaS products, AI systems, desktop apps, and Next.js engineering projects designed and shipped by Falak Gala.

${projectSection}`;
    return buildResult("/projects", content);
  }

  if (path === "/writing") {
    const posts = await getAllPosts();
    const postSection = posts
      .map(
        (post) =>
          `## [${post.title}](${SITE_URL}${post.url})\n` +
          `- Published: ${post.date}${post.updated ? ` (Updated: ${post.updated})` : ""}\n` +
          `- Reading time: ${post.readingTime} min\n` +
          (post.tags?.length ? `- Tags: ${post.tags.join(", ")}\n` : "") +
          `- Markdown copy: ${SITE_URL}/api/md?path=${encodeURIComponent(post.url)}\n\n` +
          `${post.description}\n`,
      )
      .join("\n");

    const content = `# Writing — Falak Gala

Engineering notes, production RAG case studies, Next.js guides, and self-hosting deep dives by Falak Gala.

- [RSS Feed](${SITE_URL}/rss.xml)

${postSection}`;
    return buildResult("/writing", content);
  }

  if (path.startsWith("/writing/")) {
    const slug = path.slice("/writing/".length);
    const post = await getPostBySlug(slug);
    if (!post) return null;

    const metaLines = [
      `- Author: Falak Gala (${SITE_URL})`,
      `- Canonical URL: ${SITE_URL}${post.url}`,
      `- Published: ${post.date}`,
      ...(post.updated ? [`- Updated: ${post.updated}`] : []),
      `- Reading time: ${post.readingTime} min`,
      ...(post.tags?.length ? [`- Tags: ${post.tags.join(", ")}`] : []),
    ].join("\n");

    const content = `# ${post.title}

> ${post.description}

${metaLines}

---

${post.content}
`;
    return buildResult(`/writing/${slug}`, content);
  }

  if (path === "/bookmarks") {
    const content = `# Bookmarks — Falak Gala

Curated UI/UX design inspiration, developer tools, AI resources, and engineering references collected by Falak Gala.

Browse the full interactive list at [falakgala.dev/bookmarks](${SITE_URL}/bookmarks).
`;
    return buildResult("/bookmarks", content);
  }

  if (path === "/stats") {
    const content = `# Stats — Falak Gala

Live snapshot of AI token usage (synced from Tokscale) and site traffic metrics for falakgala.dev.

View the interactive charts at [falakgala.dev/stats](${SITE_URL}/stats).
`;
    return buildResult("/stats", content);
  }

  if (path === "/contact") {
    const content = `# Contact — Falak Gala

Work with Falak Gala across product engineering, AI systems, infrastructure, and full-stack software.

## Direct Contact
- Email: hi@falakgala.dev
- Book a call: https://cal.com/falak
- Resume (PDF): ${SITE_URL}/resume.pdf
- Contact form: ${SITE_URL}/contact

Typical response time: within two working days.
`;
    return buildResult("/contact", content);
  }

  if (path === "/newsletter") {
    const content = `# Newsletter — Falak Gala

Subscribe for updates on new engineering articles, shipped projects, and technical deep dives at [falakgala.dev/newsletter](${SITE_URL}/newsletter), or follow via [RSS](${SITE_URL}/rss.xml).
`;
    return buildResult("/newsletter", content);
  }

  return null;
}
