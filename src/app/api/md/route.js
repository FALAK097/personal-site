import { renderMarkdownRoute } from "@/lib/md-registry";
import { SITE_URL } from "@/lib/site";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path =
    request.headers.get("x-markdown-path") || searchParams.get("path") || "/";

  if (path.startsWith("/api/") || path.startsWith("/_next/")) {
    return new Response(
      "# 404 Not Found\n\nNo Markdown representation exists for this endpoint.",
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex",
          Vary: "Accept",
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        },
      },
    );
  }

  const doc = await renderMarkdownRoute(path);

  if (!doc) {
    const notFoundContent = `# 404 Not Found

The requested page \`${path}\` does not exist on falakgala.dev.

## Where to Look Next
- [Home](${SITE_URL}/)
- [About](${SITE_URL}/about)
- [Projects](${SITE_URL}/projects)
- [Writing](${SITE_URL}/writing)
- [Contact](${SITE_URL}/contact)
- [LLMs Index](${SITE_URL}/llms.txt)
- [Full LLMs Context](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;
    return new Response(notFoundContent, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Robots-Tag": "noindex",
        Vary: "Accept",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    });
  }

  return new Response(doc.content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "X-Markdown-Tokens": String(doc.tokens),
      Link: `<${doc.canonicalUrl}>; rel="canonical"`,
      Vary: "Accept",
      "Cache-Control": "public, max-age=1800, s-maxage=3600",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    },
  });
}
