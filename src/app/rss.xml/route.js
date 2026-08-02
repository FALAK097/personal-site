import { getAllPosts } from "@/lib/blog-source";

function escapeXml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://falakgala.dev";
  const items = posts
    .map(
      (post) => `
    <item>
      <guid isPermaLink="true">${escapeXml(`${siteUrl}${post.url}`)}</guid>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${siteUrl}${post.url}`)}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Falak Gala&apos;s Blog</title>
    <description>Software engineering notes and practical build stories by Falak Gala.</description>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>en-us</language>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
