import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { guestSchema } from "@/db/schema/guest";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { mapToCommentModel } from "@/lib/comment-bff";
import { ComemntCreateService } from "@/lib/comment-create";
import { createCommentTree } from "@/lib/comment-mapping";
import { and, desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth(); // Session get ..

    const data: {
      guest?: string;
      password?: string;
      comment: string;
      parent_id?: number;
    } = await req.json();

    await ComemntCreateService({
      schema: guestBoardSchema,
      data,
      session,
    });

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

export async function GET() {
  const rows = await db
    .select({
      id: guestBoardSchema.id,
      comment: guestBoardSchema.comment,
      created_at: guestBoardSchema.created_at,
      author_type: guestBoardSchema.author_type,
      guest_nickname: guestSchema.nickname,
      guest_id: guestSchema.id,
      admin_email: usersTable.email,
      admin_nickname: usersTable.nickname,
      author_role: guestBoardSchema.author_type,
      parent_id: guestBoardSchema.parent_id,
      profile_img: usersTable.profile_img,
    })
    .from(guestBoardSchema)
    .leftJoin(
      guestSchema,
      and(
        eq(guestBoardSchema.author_id, guestSchema.id),
        eq(guestBoardSchema.author_type, "guest")
      )
    )
    .leftJoin(
      usersTable,
      and(
        eq(guestBoardSchema.author_id, usersTable.id),
        inArray(guestBoardSchema.author_type, ["admin", "super"])
      )
    )
    .orderBy(desc(guestBoardSchema.id));

  const commentList = mapToCommentModel(rows);
  return NextResponse.json({
    success: true,
    result: createCommentTree(commentList),
  });
}
