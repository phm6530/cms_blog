import { db } from "@/db/db";
import {
  blogMetaSchema,
  blogSubGroup,
  categorySchema,
  commentSchema,
  pinnedPostSchema,
} from "@/db/schema";
import { and, desc, eq, ilike, lte, not, sql } from "drizzle-orm";

type GetBlogList = (args: {
  categoryTag: string | null;
  groupTag: string | null;
  searchKeyword: string | null;
  permission: boolean;
  cursor: number | null;
  limit: number;
  curPostId: number | null;
}) => Promise<any>;

export default async function getBlogList({
  categoryTag,
  groupTag,
  searchKeyword,
  permission,
  cursor,
  limit,
  curPostId,
}: GetBlogList extends (args: infer T) => any ? T : never) {
  const whereQuery = and(
    categoryTag && categoryTag !== "all"
      ? sql`LOWER("category"."group_name") = ${categoryTag.toLowerCase()}`
      : undefined,
    groupTag && groupTag !== "all"
      ? sql`LOWER(${blogSubGroup.sub_group_name}) = ${groupTag.toLowerCase()}`
      : undefined,
    searchKeyword
      ? ilike(blogMetaSchema.post_title, `%${searchKeyword}%`)
      : undefined,
    !!permission ? undefined : eq(blogMetaSchema.status, "published"),
    !!cursor ? lte(blogMetaSchema.post_id, cursor) : undefined,
    !!curPostId ? not(eq(blogMetaSchema.post_id, +curPostId)) : undefined
  );

  const rows = await db
    .select({
      blog_metadata: blogMetaSchema,
      blog_sub_group: blogSubGroup,
      blog_category: categorySchema,
      comment_count: sql<number>`COUNT(${commentSchema.id})`.as("comment_cnt"),
      ...(!!permission && {
        is_pinned:
          sql<boolean>`CASE WHEN ${pinnedPostSchema.post_id} IS NOT NULL THEN true ELSE false END`.as(
            "is_pinned"
          ),
        pin_id: pinnedPostSchema.id,
      }),
    })
    .from(blogMetaSchema)
    .innerJoin(
      blogSubGroup,
      eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
    )
    .leftJoin(commentSchema, eq(commentSchema.post_id, blogMetaSchema.post_id))
    .leftJoin(
      categorySchema,
      eq(categorySchema.group_id, blogSubGroup.group_id)
    )
    .leftJoin(
      pinnedPostSchema,
      eq(pinnedPostSchema.post_id, blogMetaSchema.post_id)
    )
    .where(whereQuery)
    .groupBy(
      blogMetaSchema.post_id,
      blogSubGroup.sub_group_id,
      categorySchema.group_id,
      ...(!!permission ? [pinnedPostSchema.post_id, pinnedPostSchema.id] : [])
    )
    .orderBy(desc(blogMetaSchema.post_id))
    .limit(limit + 1);

  const flatRows = rows
    .slice(0, limit)
    .map(
      ({
        blog_metadata,
        blog_sub_group,
        comment_count,
        is_pinned,
        pin_id,
      }) => ({
        ...blog_metadata,
        sub_group_name: blog_sub_group.sub_group_name,
        comment_count: +comment_count,
        pin: { is_pinned, pin_id },
      })
    );

  let searchCnt = 0;
  if (searchKeyword) {
    const [row] = await db
      .select({ count: sql<number>`COUNT(*)`.as("count") })
      .from(blogMetaSchema)
      .innerJoin(
        blogSubGroup,
        eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
      )
      .leftJoin(
        categorySchema,
        eq(categorySchema.group_id, blogSubGroup.group_id)
      )
      .where(whereQuery);

    searchCnt = row.count;
  }

  return {
    list: flatRows,
    searchCnt,
    rowsCnt: rows.length,
  };
}
