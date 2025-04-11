import { auth } from "@/auth";
import { db } from "@/db/db";
import { commentSchema } from "@/db/schema/comments";
import { ComemntCreateService } from "@/lib/comment-create";
import { commentVerfiyDelete } from "@/lib/comment-verify-delete";
import { REVALIDATE } from "@/type/constants";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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
    revalidateTag(REVALIDATE.BLOG.LIST);

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
