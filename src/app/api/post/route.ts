export type PostFormData = {
  title: string;
  contents: string;
  description: string;
  postGroup: {
    category: number;
    group: number;
  };
  thumbnail: string | null;
  defaultThumbNail: boolean;
  imgKey: string;
  view: boolean;
};

import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { blogSubGroup, categorySchema } from "@/db/schema/category";
import { commentSchema } from "@/db/schema/comments";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { REVALIDATE } from "@/type/constants";
import { WithTransaction } from "@/util/withTransaction";
import { and, desc, eq, ilike, lt, not, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams;
  const group = qs.get("group");
  const category = qs.get("category");
  const searchKeyword = qs.get("keyword");
  const curPostId = qs.get("curPost"); //현재 보는 PostId

  const session = await auth();

  const cursorQuery = qs.get("cursor");
  const cursor = cursorQuery ? Number(cursorQuery) : undefined;

  const limitQuery = qs.get("limit");
  const limit = limitQuery ? Number(limitQuery) : 10; // 기본값 10

  // where..
  const whereQuery = and(
    category && category !== "all"
      ? sql`LOWER(${categorySchema.group_name}) = ${category.toLowerCase()}`
      : undefined,
    group && group !== "all"
      ? sql`LOWER(${blogSubGroup.sub_group_name}) = ${group.toLowerCase()}`
      : undefined,
    searchKeyword
      ? ilike(blogMetaSchema.post_title, `%${searchKeyword}%`)
      : undefined,
    // session 있으면 비밀글도 가져오기
    !!session ? undefined : eq(blogMetaSchema.view, true),
    !!cursor ? lt(blogMetaSchema.post_id, cursor) : undefined,
    !!curPostId ? not(eq(blogMetaSchema.post_id, +curPostId)) : undefined
  );

  const rows = await db
    .select({
      blog_metadata: blogMetaSchema,
      blog_sub_group: blogSubGroup,
      blog_category: categorySchema,
      comment_count: sql<number>`COUNT(${commentSchema.id})`.as("comment_cnt"),
      ...(!!session?.user && {
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
      ...(!!session?.user
        ? [pinnedPostSchema.post_id, pinnedPostSchema.id]
        : [])
    )
    .orderBy(desc(blogMetaSchema.post_id))
    .limit(limit + 1);

  const flatRows = rows
    .slice(0, limit)
    .map(
      ({ blog_metadata, blog_sub_group, comment_count, is_pinned, pin_id }) => {
        return {
          ...blog_metadata,
          sub_group_name: blog_sub_group.sub_group_name,
          comment_count: +comment_count,
          pin: {
            is_pinned,
            pin_id,
          },
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

  return NextResponse.json(
    {
      success: true,
      result: {
        list: flatRows,
        isNextPage: rows.length > limit,
        ...(!!searchKeyword && { total: searchCnt }),
      },
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const body: PostFormData = await req.json();

  try {
    if (!session?.user) {
      throw new Error("권한이 없습니다.");
    }

    const resultTx = await WithTransaction.run(async (tx) => {
      const [user] = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, session.user.email!));

      if (!user) {
        throw new Error("없는 사용자 입니다.");
      }

      const [rows] = await tx
        .insert(blogMetaSchema)
        .values({
          post_title: body.title,
          post_description: body.description,
          category_id: +body.postGroup.category,
          sub_group_id: +body.postGroup.group,
          author_id: user.id,
          img_key: body.imgKey,
          view: body.view,
          thumbnail_url: body.thumbnail,
        })
        .returning({
          id: blogMetaSchema.post_id,
          categoryName: blogMetaSchema.sub_group_id,
        });

      await tx.insert(blogContentsSchema).values({
        post_id: +rows.id,
        contents: body.contents,
      });

      return {
        postId: +rows.id,
        categoryName: rows.categoryName,
      };
    });

    revalidateTag(REVALIDATE.POST.LIST);
    revalidateTag(REVALIDATE.POST.CATEGORY);

    return NextResponse.json({
      success: true,
      result: {
        postId: resultTx.postId,
      },
    });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
  }
}
