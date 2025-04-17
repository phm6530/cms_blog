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
import { blogSubGroup, categorySchema } from "@/db/schema/category";
import { apiHandler } from "@/util/api-hanlder";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; //v15 부턴 바꼇나보네

  return await apiHandler(async () => {
    if (!id) {
      return NextResponse.json(
        { error: true, message: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

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
      .where(eq(blogContentsSchema.post_id, +id));

    if (!rows) {
      throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
    }

    return rows;
  });
}

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

    await WithTransaction.run(async (tx) => {
      // 사용자 조회
      const [user] = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, session.user.email!));

      if (!user) throw new Error("없는 사용자입니다.");

      // 기존 메타데이터 수정
      await tx
        .update(blogMetaSchema)
        .set({
          post_title: body.title,
          post_description: body.description,
          category_id: +body.postGroup.category,
          sub_group_id: +body.postGroup.group,
          img_key: body.imgKey,
          update_at: new Date(),
          view: body.view,
          thumbnail_url: body.thumbnail,
        })
        .where(eq(blogMetaSchema.post_id, +id));

      // 본문 내용도 수정
      await tx
        .update(blogContentsSchema)
        .set({
          contents: body.contents,
        })
        .where(eq(blogContentsSchema.post_id, +id));
    });

    revalidateTag(`${REVALIDATE.POST.DETAIL}:${id}`);
    revalidateTag(REVALIDATE.POST.LIST);
    revalidateTag(REVALIDATE.POST.CATEGORY);

    return NextResponse.json({ success: true });
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

    const rows = await db
      .select()
      .from(blogMetaSchema)
      .where(eq(blogMetaSchema.post_id, +id));

    if (!rows) {
      throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
    }

    await db.delete(blogMetaSchema).where(eq(blogMetaSchema.post_id, +id));

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
