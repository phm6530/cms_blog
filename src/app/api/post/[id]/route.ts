import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { REVALIDATE } from "@/type/constants";
import { WithTransaction } from "@/util/withTransaction";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { PostFormData } from "../route";

import { pinnedPostSchema } from "@/db/schema/post/pinned-post";

// 갈아끼우기
// 전체 덮어쓰기 (PUT)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const body: PostFormData = await req.json();
  const { id } = await context.params;
  try {
    if (!session?.user) throw new Error("권한이 없습니다.");

    const resultTx = await WithTransaction.run(async (tx) => {
      // 사용자 조회
      const [user] = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, session.user.email!));

      if (!user) throw new Error("없는 사용자입니다.");

      // 기존 메타데이터 수정
      const [rows] = await tx
        .update(blogMetaSchema)
        .set({
          post_title: body.title,
          post_description: body.description,
          category_id: body.postGroup.category
            ? +body.postGroup.category
            : null,
          sub_group_id: body.postGroup.group ? +body.postGroup.group : null,
          img_key: body.imgKey,
          update_at: new Date(),
          status: body.status,
          thumbnail_url: body.thumbnail,
        })
        .where(eq(blogMetaSchema.post_id, +id))
        .returning({
          id: blogMetaSchema.post_id,
          categoryName: blogMetaSchema.sub_group_id,
          status: blogMetaSchema.status,
        });

      // 본문 내용도 수정
      await tx
        .update(blogContentsSchema)
        .set({
          contents: body.contents,
        })
        .where(eq(blogContentsSchema.post_id, +id));

      return {
        postId: +rows.id,
        categoryName: rows.categoryName,
        status: rows.status,
      };
    });

    //고정콘텐츠 일경우는 메인 쪽도 초기화
    if (!!body.pinnedPost) {
      revalidateTag(REVALIDATE.POST.PINNED_POST);
    }

    revalidateTag(`${REVALIDATE.POST.DETAIL}:${id}`);
    revalidateTag(REVALIDATE.POST.LIST);
    revalidateTag(REVALIDATE.POST.CATEGORY);

    return NextResponse.json({
      success: true,
      result: {
        postId: resultTx.postId,
        postStatus: resultTx.status,
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  try {
    if (!session?.user) {
      throw new Error("권한이 없습니다.");
    }

    console.log(id);

    const [rows] = await db
      .select()
      .from(blogMetaSchema)
      .where(eq(blogMetaSchema.post_id, +id))
      .leftJoin(
        pinnedPostSchema,
        eq(pinnedPostSchema.post_id, blogMetaSchema.post_id)
      );

    if (!rows) {
      throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
    }

    const { pinned_post } = rows;

    await db.delete(blogMetaSchema).where(eq(blogMetaSchema.post_id, +id));

    //고정된 post면
    if (!!pinned_post) {
      revalidateTag(REVALIDATE.POST.PINNED_POST);
    }

    revalidateTag(`${REVALIDATE.POST.DETAIL}:${id}`); // 없애고
    revalidateTag(REVALIDATE.POST.LIST); // 리스트 초기화하고
    revalidateTag(REVALIDATE.POST.CATEGORY); //카테고리 숫자줄이고

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 500 }
      );
  }
}
