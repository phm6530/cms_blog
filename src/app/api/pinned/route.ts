import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { blogSubGroup } from "@/db/schema/category";
import { commentSchema } from "@/db/schema/comments";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { apiHandler } from "@/util/api-hanlder";
import { asc, eq, sql } from "drizzle-orm";

export async function GET() {
  return await apiHandler(async () => {
    const response = await db
      .select({
        id: blogMetaSchema.post_id,
        created_at: blogMetaSchema.created_at,
        thumbnail_url: blogMetaSchema.thumbnail_url,
        sub_group_name: blogSubGroup.sub_group_name,
        like_cnt: blogMetaSchema.like_cnt,
        post_title: blogMetaSchema.post_title,
        post_description: blogMetaSchema.post_description,
        comment_count: sql<number>`COUNT(${commentSchema.id})`.as(
          "comment_cnt"
        ),
      })
      .from(pinnedPostSchema)
      .leftJoin(
        blogMetaSchema,
        eq(pinnedPostSchema.post_id, blogMetaSchema.post_id)
      )
      .leftJoin(
        blogSubGroup,
        eq(blogSubGroup.sub_group_id, blogMetaSchema.sub_group_id)
      )
      .leftJoin(
        commentSchema,
        eq(commentSchema.post_id, blogMetaSchema.post_id)
      )
      .groupBy(
        blogSubGroup.sub_group_id,
        blogMetaSchema.post_id,
        pinnedPostSchema.order
      )
      .orderBy(asc(pinnedPostSchema.order));

    console.log(response);

    return response;
  });
}
