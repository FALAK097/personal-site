import matter from "gray-matter";

const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

const FILENAMES = [
  "falak-gala.vercel.app_.md",
  "falak-gala.vercel.app_about.md",
  "falak-gala.vercel.app_blog.md",
  "falak-gala.vercel.app_blog_how-i-built-nextjs-blog.md",
  "falak-gala.vercel.app_blog_tracking-unique-visitors.md",
  "falak-gala.vercel.app_bookmarks.md",
  "falak-gala.vercel.app_hire-me.md",
  "falak-gala.vercel.app_projects.md",
];

export async function generateAIContext() {
  const markdowns = await Promise.all(
    FILENAMES.map(async (filename) => {
      try {
        const res = await fetch(`${BASE_URL}/data/${filename}`);
        if (!res.ok) {
          console.error(`❌ Failed to fetch ${filename}:`, res.statusText);
          return null;
        }

        const raw = await res.text();
        const { data, content } = matter(raw);

        const cleanedContent =
          content
            ?.replace(/```[\s\S]*?```/g, "")
            ?.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1 ($2)")
            ?.replace(/\*\*(.*?)\*\*/g, "$1")
            ?.replace(/\*(.*?)\*/g, "$1")
            ?.replace(/_(.*?)_/g, "$1")
            ?.replace(/`(.*?)`/g, "$1")
            ?.replace(/[>#]/g, "")
            ?.replace(/\n+/g, " ")
            ?.slice(0, 10000) || "No content.";

        return {
          title: data.title || filename.replace(".md", ""),
          url: data.url || "",
          content: cleanedContent,
        };
      } catch (error) {
        console.error(`⚠️ Error reading ${filename}:`, error);
        return null;
      }
    })
  );

  const validEntries = markdowns.filter(Boolean);

  const allContent = validEntries
    .map(
      (entry) =>
        `• ${entry.title}\nContent Excerpt:\n${entry.content}\nURL: ${entry.url}`
    )
    .join("\n\n");

  return `
You are Falak's AI Persona.
Falak Gala is a software engineer based in India.
He is born on 9th November 2002.
He is 6 feet tall.
He weighs 75 kg as of June 2025.
He is Gujarati and speaks English, Hindi, and Gujarati.
He is a design-focused developer with a passion for building web applications and exploring new technologies.
His current workflow includes using Next.js, React, and JavaScript to create modern web experiences along with Python, FastAPI, and PostgreSQL for backend development.
He uses these tools on a daily basis:
- Next.js
- React
- Tailwind CSS
- JavaScript
- Python
- FastAPI
- PostgreSQL
- Git
- GitHub
- VS Code
- Docker
- DigitalOcean
- Warp
- Obsidian
He is open to work or freelance projects. More information is available at https://falakgala.dev/contact
Here is all the available content from Falak's portfolio site:\n${allContent}
Only answer questions about Falak Gala and his work. If the question is unrelated, politely decline to answer and remind the user you are Falak's AI Persona.
  `.trim();
}
