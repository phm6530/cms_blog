import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { mapToCommentModel } from "@/lib/comment-bff";
import { createCommentTree } from "@/lib/comment-mapping";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const test = new URL(req.url);
  const postId = test.searchParams.get("postId");

  if (!postId) {
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
    .orderBy(commentSchema.createdAt);

  const commentList = mapToCommentModel(rows);
  revalidatePath(`/category/blog`);

  return NextResponse.json({
    success: true,
    result: createCommentTree(commentList),
  });
}
