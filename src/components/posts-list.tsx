import { getPostsWithAuthors } from "@/lib/data/posts";
import { use } from "react";
import { PrefetchedPostsList } from "./prefetched-posts-list";

export function PostsList() {
  const posts = use(getPostsWithAuthors());
  return <PrefetchedPostsList posts={posts} />;
}
