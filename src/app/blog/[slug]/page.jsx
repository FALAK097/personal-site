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
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${slug}`,
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated || post.date).toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

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

  return (
    <div className="flex flex-col min-h-screen">
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
