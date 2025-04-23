import { auth } from "@/auth";
import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { POST_STATUS, REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  const body = await req.json();

  return await apiHandler(async () => {
    if (!session?.user || !id) {
      throw new Error("권한이 없거나 잘못된 요청입니다.");
    }

    const rows = await db
      .update(blogMetaSchema)
      .set({ status: body.status })
      .where(eq(blogMetaSchema.post_id, +id))
      .returning({ view: blogMetaSchema.status });

    if (body.status === POST_STATUS.PRIVATE && body.pinnedId) {
      await db
        .delete(pinnedPostSchema)
        .where(eq(pinnedPostSchema.id, body.pinnedId));
      revalidateTag(REVALIDATE.PINNED_POST); // Pin 했던거면 풀기
    }

    revalidateTag(`${REVALIDATE.POST.DETAIL}:${id}`); //해당 Post
    revalidateTag(REVALIDATE.POST.LIST); //리스트
    revalidateTag(REVALIDATE.POST.CATEGORY); // 카테고리
    return rows;
  });
}
