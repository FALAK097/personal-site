"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon, UploadIcon } from "@/components/icons";
import { Button } from "../ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/lib/animation";

export default function BlogDetail({ post, children, prevPost, nextPost }) {
  const router = useTransitionRouter();

  const handleShare = async () => {
    await navigator.share({
      url: window.location.href,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8">
        <a
          onClick={(e) => {
            e.preventDefault();
            router.push("/blog", {
              onTransitionReady: slideInOut,
            });
          }}
          href="/blog"
          className="flex items-center gap-2 text-muted-foreground hover:text-clay-400 transition-colors"
        >
          <ArrowLeftIcon /> Back to Blog
        </a>
      </div>
      <motion.article
        className="blog-prose prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-8 prose-li:text-muted-foreground prose-li:leading-7 prose-strong:text-foreground prose-code:font-medium prose-pre:my-0 prose-pre:bg-transparent"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-8 text-sm text-muted-foreground border-b pb-4">
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{post.readingTime} min read</span>
        </div>
        {children}
      </motion.article>

      <div className="mt-8 flex items-center justify-end gap-4 pt-4 border-t">
        <div className="flex items-center gap-1">
          <p className="text-sm text-muted-foreground">
            Enjoyed this article? Share it with your network!
          </p>
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="cursor-pointer bg-transparent border-none text-clay-400 hover:bg-transparent hover:text-clay-400"
          >
            <UploadIcon />
          </Button>
        </div>
      </div>
      <nav className="mt-8 pt-8 flex justify-between items-center">
        {prevPost && (
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push(`/blog/${prevPost.slug}`, {
                onTransitionReady: slideInOut,
              });
            }}
            href={`/blog/${prevPost.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-clay-400 transition-colors no-underline"
          >
            <ArrowLeftIcon />
            {prevPost.title}
          </a>
        )}
        {nextPost && (
          <a
            onClick={(e) => {
              e.preventDefault();
              router.push(`/blog/${nextPost.slug}`, {
                onTransitionReady: slideInOut,
              });
            }}
            href={`/blog/${nextPost.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-clay-400 transition-colors ml-auto no-underline"
          >
            {nextPost.title}
            <ArrowRightIcon />
          </a>
        )}
      </nav>
    </div>
  );
}
