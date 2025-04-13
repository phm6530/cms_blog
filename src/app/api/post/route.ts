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
};

import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { blogSubGroup, categorySchema } from "@/db/schema/category";
import { commentSchema } from "@/db/schema/comments";
import { REVALIDATE } from "@/type/constants";
import { WithTransaction } from "@/util/withTransaction";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const group = url.searchParams.get("group");
  const category = url.searchParams.get("category");
  const searchKeyword = url.searchParams.get("keyword");

  // where..
  const whereQuery = and(
    category
      ? sql`LOWER(${categorySchema.group_name}) = ${category.toLowerCase()}`
      : undefined,
    group && group !== "all"
      ? sql`LOWER(${blogSubGroup.sub_group_name}) = ${group.toLowerCase()}`
      : undefined,
    searchKeyword
      ? ilike(blogMetaSchema.post_title, `%${searchKeyword}%`)
      : undefined
  );

  const rows = await db
    .select({
      blog_metadata: blogMetaSchema,
      blog_sub_group: blogSubGroup,
      blog_category: categorySchema,
      comment_count: sql<number>`COUNT(${commentSchema.id})`.as("comment_cnt"),
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
    .where(whereQuery)
    .groupBy(
      blogMetaSchema.post_id,
      blogSubGroup.sub_group_id,
      categorySchema.group_id
    )
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
  console.log(flatRows);

  return NextResponse.json({
    success: true,
    result: !!searchKeyword ? [...flatRows, +searchCnt] : flatRows,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const body: PostFormData = await req.json();

  try {
    if (!session?.user) {
      throw new Error("권한이 없습니다.");
    }

    const created_id = await WithTransaction.run(async (tx) => {
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
        })
        .returning({ id: blogMetaSchema.post_id });

      await tx.insert(blogContentsSchema).values({
        post_id: +rows.id,
        contents: body.contents,
      });

      return +rows.id;
    });
    revalidatePath("/category/blog");
    revalidateTag(REVALIDATE.BLOG.LIST);

    return NextResponse.json({
      success: true,
      result: {
        postId: created_id,
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
