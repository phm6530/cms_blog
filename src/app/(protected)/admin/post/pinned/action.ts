"use server";

import getPinnedPosts from "@/service/pinned-post";
import { PinnedPostModel } from "@/type/post.type";

export async function actionPinnedPosts(): Promise<PinnedPostModel[]> {
  return await getPinnedPosts();
}
