"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { asc } from "drizzle-orm";

export async function getPinnedPosts() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("권한이 없습니다.");
  }

  const rows = await db
    .select()
    .from(pinnedPostSchema)
    .orderBy(asc(pinnedPostSchema.order));
  return rows;
}
