import { db } from "@/db/db";
import { commentSchema } from "@/db/schema";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { blogSubGroup, categorySchema } from "@/db/schema/category";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { REVALIDATE } from "@/type/constants";
import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

type GetPostItem = { id: string };

async function _getPostItem({ id }: GetPostItem) {
  if (!id) throw new Error("id가 누락되었습니다.");

  const [rows] = await db
    .select({
      blog_metadata: blogMetaSchema,
      blog_contents: blogContentsSchema,
      blog_sub_group: blogSubGroup,
      category: categorySchema,
      pinned_post: pinnedPostSchema,
      comment_cnt: sql<number>`
      (SELECT COUNT(*) FROM ${commentSchema} WHERE ${commentSchema.post_id} = ${blogMetaSchema.post_id})
    `,
    })
    .from(blogMetaSchema)
    .innerJoin(
      blogContentsSchema,
      eq(blogContentsSchema.post_id, blogMetaSchema.post_id)
    )
    .innerJoin(
      blogSubGroup,
      eq(blogSubGroup.sub_group_id, blogMetaSchema.sub_group_id)
    )
    .innerJoin(
      categorySchema,
      eq(categorySchema.group_id, blogMetaSchema.category_id)
    )
    .leftJoin(
      pinnedPostSchema,
      eq(pinnedPostSchema.post_id, blogMetaSchema.post_id)
    )
    .leftJoin(commentSchema, eq(commentSchema.post_id, blogMetaSchema.post_id))
    .where(eq(blogContentsSchema.post_id, +id));

  if (!rows || Object.keys(rows).length === 0) {
    throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
  }
  return rows;
}
type RawPostItem = Awaited<ReturnType<typeof _getPostItem>>;

const getPostItem = async <T extends RawPostItem>(id: string): Promise<T> =>
  unstable_cache(
    () => _getPostItem({ id }) as Promise<T>,
    [`${REVALIDATE.POST.DETAIL}:${id}`],
    { tags: [`${REVALIDATE.POST.DETAIL}:${id}`] }
  )();

export default getPostItem;
