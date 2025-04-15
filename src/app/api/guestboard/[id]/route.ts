import { auth } from "@/auth";
import { db } from "@/db/db";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { commentVerfiyDelete } from "@/lib/comment-verify-delete";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; //post_id
  const session = await auth(); // Session get ..
  const body = await req.json();

  try {
    if (isNaN(Number(id))) {
      throw new Error("잘못된 요청입니다.");
    }

    // 삭제 권한 check...
    await commentVerfiyDelete({
      InjectionSchema: guestBoardSchema,
      session,
      password: body.password,
      commentId: +id,
    });

    // 삭제 ㅇㅇ
    await db
      .delete(guestBoardSchema)
      .where(eq(guestBoardSchema.id, Number(id)));

    revalidateTag(`/guestbook`);

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
