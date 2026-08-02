import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

export const blog = defineDocs({
  dir: "src/content/blog",
  docs: {
    schema: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      date: z.string().date(),
      updated: z.string().date().optional(),
      tags: z.array(z.string()).default([]),
      image: z.string().optional(),
      published: z.boolean().default(true),
      featured: z.boolean().default(false),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "catppuccin-mocha",
      },
    },
  },
});
