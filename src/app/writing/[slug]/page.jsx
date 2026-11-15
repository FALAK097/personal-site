import { getPostBySlug, getAllPosts } from "@/lib/blog-source";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MdxCodeBlock } from "@/components/blog/mdx-code-block";
import { mdxComponents } from "@/components/blog/mdx-components";
import BlogDetail from "@/components/blog/blog-detail";

export async function generateMetadata(context) {
  const params = await context.params;
  const slug = params.slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/writing/${slug}`,
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/writing/${slug}`,
      siteName: "Falak Gala",
      locale: "en_US",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated || post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@FalakGala097",
    },
  };
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost(context) {
  const params = await context.params;
  const slug = params.slug;
  const post = await getPostBySlug(slug);

  if (!post) return notFound();

  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const nextPost = posts[currentIndex + 1] || null;
  const prevPost = posts[currentIndex - 1] || null;

  const Content = post.body;
  const postMetadata = {
    ...post,
    body: undefined,
    toc: undefined,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated || post.date).toISOString(),
    url: `https://falakgala.dev/writing/${slug}`,
    image: `https://falakgala.dev/writing/${slug}/opengraph-image`,
    author: {
      "@type": "Person",
      name: "Falak Gala",
      url: "https://falakgala.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Falak Gala",
      url: "https://falakgala.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://falakgala.dev/writing/${slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://falakgala.dev",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writing",
        item: "https://falakgala.dev/writing",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://falakgala.dev/writing/${slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <BlogDetail
        post={postMetadata}
        toc={post.toc}
        prevPost={prevPost}
        nextPost={nextPost}
      >
        <Content components={{ ...mdxComponents, pre: MdxCodeBlock }} />
      </BlogDetail>
      <Footer />
    </div>
  );
}
