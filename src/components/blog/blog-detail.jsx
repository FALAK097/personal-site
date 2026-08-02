"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, UploadIcon } from "@/components/icons";
import { Button } from "../ui/button";
import { useTransitionRouter } from "next-view-transitions";
import { slideInOut } from "@/lib/animation";
import { ArticleToc } from "@/components/blog/article-toc";

export default function BlogDetail({ post, children, toc, prevPost, nextPost }) {
  const router = useTransitionRouter();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Failed to share article:", error);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
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
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article
          className="blog-prose prose prose-slate min-w-0 max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-8 prose-li:text-muted-foreground prose-li:leading-7 prose-strong:text-foreground prose-code:font-medium prose-pre:my-0 prose-pre:bg-transparent"
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <div className="mb-8 flex flex-wrap gap-2 border-b pb-4 text-sm text-muted-foreground">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            {post.updated && (
              <>
                <span>•</span>
                <span>Updated {new Date(post.updated).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </>
            )}
          </div>
          <ArticleToc items={toc} variant="mobile" />
          {children}
        </article>
        <ArticleToc items={toc} />
      </div>

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
            aria-label={shared ? "Article link copied" : "Share article"}
          >
            {shared ? <span className="text-xs font-medium">Copied</span> : <UploadIcon />}
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
