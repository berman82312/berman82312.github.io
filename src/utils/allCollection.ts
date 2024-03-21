import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

type AllCollectionEntry = CollectionEntry<"posts" | "movies">;
const modifySlug =
  (name: string) => (entry: AllCollectionEntry) => ({
    ...entry,
    slug: `/${name}/` + entry.slug,
  });
export const allPosts = [
  ...(await getCollection("posts")).map(modifySlug("posts")),
  ...(await getCollection("movies")).map(modifySlug('movies')),
];

export default allPosts;