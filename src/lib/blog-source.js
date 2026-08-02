import { cache } from "react";
import { loader } from "fumadocs-core/source";
import { blog } from "@source/server";
import readingTime from "reading-time";

export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});

async function toPost(page) {
  const source = await page.data.getText("processed");

  return {
    title: page.data.title,
    description: page.data.description,
    date: page.data.date,
    updated: page.data.updated,
    tags: page.data.tags,
    image: page.data.image,
    featured: page.data.featured,
    slug: page.slugs.join("/"),
    url: page.url,
    readingTime: Math.max(1, Math.ceil(readingTime(source).minutes)),
  };
}

export const getAllPosts = cache(async () => {
  const pages = blogSource
    .getPages()
    .filter((page) => page.data.published !== false);
  const posts = await Promise.all(pages.map(toPost));

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
});

export const getPostBySlug = cache(async (slug) => {
  const page = blogSource.getPage(slug ? slug.split("/") : undefined);

  if (!page || page.data.published === false) return null;

  return {
    ...(await toPost(page)),
    body: page.data.body,
    toc: page.data.toc,
  };
});
