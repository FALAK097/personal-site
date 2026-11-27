import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/custom/page-header";
import { BlogSearch } from "@/components/blog/blog-search";
import { getAllPosts } from "@/lib/blog-source";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Engineering Writing: AI, Next.js & Infrastructure",
  description:
    "Practical engineering guides on production AI, Graph RAG, Next.js, self-hosting, developer tools, and infrastructure by Falak Gala.",
  path: "/writing",
});

export default async function WritingPage({ searchParams }) {
  const params = await searchParams;
  const initialQuery = typeof params?.q === "string" ? params.q.slice(0, 80) : "";
  const posts = await getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing — Falak Gala",
    url: "https://falakgala.dev/writing",
    mainEntity: {
      "@type": "Blog",
      name: "Falak Gala's Writing",
      url: "https://falakgala.dev/writing",
      author: {
        "@id": "https://falakgala.dev/#person",
      },
      blogPost: posts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        url: `https://falakgala.dev${post.url}`,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.updated || post.date).toISOString(),
      })),
    },
  };

  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="page-main">
        <div className="space-y-10">
          <PageHeader
            title="writing"
            intro="Notes from building frontend systems, AI products, and production infrastructure."
          />
          <BlogSearch posts={posts} initialQuery={initialQuery} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
