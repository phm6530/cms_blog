import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { post_id }: { post_id: number } = await req.json();

  return await apiHandler(async () => {
    if (!post_id) {
      throw new Error("잘못된 요청입니다.");
    }

    const post = await db
      .select({ id: blogMetaSchema.post_id })
      .from(blogMetaSchema)
      .where(eq(blogMetaSchema.post_id, post_id));

    if (post.length === 0) {
      throw new Error("해당 게시물이 존재하지 않습니다.");
    }

    // 2. 이미 고정되었는지 확인
    const pinned = await db
      .select()
      .from(pinnedPostSchema)
      .where(eq(pinnedPostSchema.post_id, post_id));

    if (pinned.length > 0) {
      throw new Error("이미 고정된 게시물입니다.");
    }

    const [rows] = await db
      .select({ cnt: sql<number>`COUNT(*)` })
      .from(pinnedPostSchema);

    if (Number(rows.cnt) >= 5) {
      throw new Error("고정 콘텐츠는 최대 5개까지만 등록할 수 있습니다.");
    }

    // 3. 현재 고정 콘텐츠 개수 확인
    const curOrderResult = await db
      .select({ maxOrder: sql<number>`MAX(${pinnedPostSchema.order})` })
      .from(pinnedPostSchema);

    const maxOrder = curOrderResult?.[0]?.maxOrder ?? 0;

    // 4. 고정 콘텐츠 삽입
    const inserted = await db.insert(pinnedPostSchema).values({
      post_id,
      active: true,
      order: Number(maxOrder) + 1,
    });

    // 초기화
    revalidateTag(REVALIDATE.POST.PINNED_POST);
    return inserted;
  });
}
