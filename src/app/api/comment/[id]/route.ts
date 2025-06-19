import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { mapToCommentModel } from "@/lib/comment-bff";
import { ComemntCreateService } from "@/lib/comment-create";
import { createCommentTree } from "@/lib/comment-mapping";
import { commentVerfiyDelete } from "@/lib/comment-verify-delete";
import { REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { and, asc, eq, inArray } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const qs = req.nextUrl.searchParams;
  const { id: postId } = await context.params;

  // 기본 10개 설정
  const limit = Number(qs.get("limit")) ?? 10;

  return await apiHandler(async () => {
    if (!postId || isNaN(limit)) {
      throw new Error("잘못된 요청입니다.");
    }

    const rows = await db
      .select({
        id: commentSchema.id,
        post_id: commentSchema.post_id,
        comment: commentSchema.comment,
        created_at: commentSchema.createdAt,
        parent_id: commentSchema.parent_id,

        guest_nickname: guestSchema.nickname,
        guest_id: guestSchema.id,
        admin_email: usersTable.email,
        admin_nickname: usersTable.nickname,
        author_role: commentSchema.author_type,
        profile_img: usersTable.profile_img,
      })
      .from(commentSchema)
      .leftJoin(
        guestSchema,
        and(
          eq(commentSchema.author_id, guestSchema.id),
          eq(commentSchema.author_type, "guest")
        )
      )
      .leftJoin(
        usersTable,
        and(
          eq(commentSchema.author_id, usersTable.id),
          inArray(commentSchema.author_type, ["admin", "super"])
        )
      )
      .where(eq(commentSchema.post_id, parseInt(postId, 10)))
      .orderBy(asc(commentSchema.createdAt));

    const commentList = mapToCommentModel(rows);

    revalidatePath(`/category/blog`);

    return { success: true, result: createCommentTree(commentList) };
  });
}

// Delete
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth(); // Session get ..

  const url = new URL(req.url);
  const comment_id = url.searchParams.get("item"); // commit_id
  const { id: post_id } = await context.params; //post_id
  const body = await req.json();

  try {
    if (!comment_id || isNaN(Number(comment_id))) {
      throw new Error("잘못된 요청입니다.");
    }
    // 삭제 권한 check...
    await commentVerfiyDelete({
      InjectionSchema: commentSchema,
      session,
      password: body.password,
      commentId: +comment_id,
    });

    // 삭제 ㅇㅇ
    await db
      .delete(commentSchema)
      .where(eq(commentSchema.id, Number(comment_id)));

    revalidateTag(`${REVALIDATE.COMMENT}:${post_id}`);
    revalidateTag(REVALIDATE.POST.LIST);
    revalidateTag(REVALIDATE.WEIGET.COMMENT);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }
  }
}

// post
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth(); // Session get ..

  const data: {
    guest?: string;
    password?: string;
    comment: string;
    parent_id?: number;
  } = await req.json();

  const { id } = await context.params;
  try {
    // 댓글 생성
    await ComemntCreateService({
      schema: commentSchema,
      data,
      session,
      postId: id,
    });
    revalidateTag(REVALIDATE.WEIGET.COMMENT);
    // 캐싱 초기화
    revalidateTag(`${REVALIDATE.COMMENT}:${id}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }
  }
}
