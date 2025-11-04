import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Post, User } from "../db/types";

type UserWithPosts = User & {
  posts: Post[];
};

export async function getUserById(userId: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return user;
}

export async function getUserWithPosts(userId: number): Promise<UserWithPosts | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  const userPosts = await db.select().from(posts).where(eq(posts.authorId, userId));

  const { id, username, createdAt } = user;

  return {
    id,
    username,
    createdAt,
    posts: userPosts,
  };
}
