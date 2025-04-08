import { db } from "@/db/db";
import { blogSubGroup } from "@/db/schema/blog-group";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { commentSchema } from "@/db/schema/comments";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const QUERYSTRING_blogSubGroup = url.searchParams.get("group");
  const searchKeyword = url.searchParams.get("keyword");

  // where..
  const whereQuery = and(
    QUERYSTRING_blogSubGroup && QUERYSTRING_blogSubGroup !== "all"
      ? sql`LOWER(${
          blogSubGroup.sub_group_name
        }) = ${QUERYSTRING_blogSubGroup.toLowerCase()}`
      : undefined,
    searchKeyword
      ? ilike(blogMetaSchema.post_title, `%${searchKeyword}%`)
      : undefined
  );

  const rows = await db
    .select({
      blog_metadata: blogMetaSchema,
      blog_sub_group: blogSubGroup,
      comment_count: sql<number>`COUNT(${commentSchema.id})`.as("comment_cnt"),
    })
    .from(blogMetaSchema)
    .innerJoin(
      blogSubGroup,
      eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
    )
    .leftJoin(commentSchema, eq(commentSchema.post_id, blogMetaSchema.post_id))
    .where(whereQuery)
    .groupBy(blogMetaSchema.post_id, blogSubGroup.sub_group_id)
    .orderBy(desc(blogMetaSchema.post_id))
    .limit(10)
    .offset(0);

  const flatRows = rows.map(
    ({ blog_metadata, blog_sub_group, comment_count }) => {
      return {
        ...blog_metadata,
        sub_group_name: blog_sub_group.sub_group_name,
        comment_count: +comment_count,
      };
    }
  );
  let searchCnt = 0;
  if (!!searchKeyword) {
    const [rows] = await db
      .select({
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(blogMetaSchema)
      .innerJoin(
        blogSubGroup,
        eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
      )
      .where(whereQuery);
    searchCnt = rows.count;
  }

  return NextResponse.json({
    success: true,
    result: searchCnt !== undefined ? [...flatRows, +searchCnt] : flatRows,
  });
}
