import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    author: z.string().optional(),

    image: z.object({
      url: z.string(),
      alt: z.string().optional(),
    }),

    tags: z.array(z.string()),
  }),
});

const moviesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    author: z.string().optional(),

    image: z
      .object({
        url: z.string(),
        alt: z.string().optional(),
      }),

    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  movies: moviesCollection,
};
