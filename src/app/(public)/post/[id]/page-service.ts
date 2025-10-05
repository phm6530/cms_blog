import { db } from "@/db/db";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { blogSubGroup, categorySchema } from "@/db/schema/category";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { eq } from "drizzle-orm";

type GetPostItem = { id: string };

export async function getPostItem({ id }: GetPostItem) {
  if (!id) throw new Error("id가 누락되었습니다.");

  const [rows] = await db
    .select()
    .from(blogMetaSchema)
    .innerJoin(
      blogContentsSchema,
      eq(blogContentsSchema.post_id, blogMetaSchema.post_id)
    )
    .leftJoin(
      blogSubGroup,
      eq(blogSubGroup.sub_group_id, blogMetaSchema.sub_group_id)
    )
    .leftJoin(
      categorySchema,
      eq(categorySchema.group_id, blogMetaSchema.category_id)
    )
    .leftJoin(
      pinnedPostSchema,
      eq(pinnedPostSchema.post_id, blogMetaSchema.post_id)
    )
    .where(eq(blogContentsSchema.post_id, +id));

  if (!rows || Object.keys(rows).length === 0) {
    throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
  }
  return rows;
}
