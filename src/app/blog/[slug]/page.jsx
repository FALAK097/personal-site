import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
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
    title: `${post.title} | Falak Gala's Blog`,
    description:
      post.description ||
      "Read my thoughts on software development and technology.",
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

  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "catppuccin-mocha",
          },
        ],
      ],
    },
  };

  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const nextPost = posts[currentIndex + 1] || null;
  const prevPost = posts[currentIndex - 1] || null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <BlogDetail post={post} prevPost={prevPost} nextPost={nextPost}>
        <MDXRemote
          source={post.content}
          options={options}
          components={{
            ...mdxComponents,
            pre: MdxCodeBlock,
          }}
        />
      </BlogDetail>
      <Footer />
    </div>
  );
}
