import { auth } from "@/auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { guestSchema } from "@/db/schema/guest";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { mapToCommentModel } from "@/lib/comment-bff";
import { ComemntCreateService } from "@/lib/comment-create";
import { createCommentTree } from "@/lib/comment-mapping";
import { REVALIDATE } from "@/type/constants";

import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
} from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { DateUtils } from "@/util/date-uill";

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

    // revaildateTags
    revalidateTag(REVALIDATE.GUEST_BOARD.GETBOARD);
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

// 인피니티 스크롤 - cursor
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams;
  const cursor = qs.get("cursor");

  const LIMIT = 10;

  // 공유할 Base Query
  const baseQuery = db
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
      guest_img: guestSchema.guest_icon,
      admin_img: usersTable.profile_img,
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

  // 부모 부터 가져옴,
  const parents = await baseQuery
    .where(
      and(
        !!cursor ? lt(guestBoardSchema.id, Number(cursor)) : undefined,
        isNull(guestBoardSchema.parent_id)
      )
    )
    .limit(LIMIT + 1); // 다음꺼 계산을 위해 + 1

  const limitParents = parents.slice(0, LIMIT);

  // 부모 Ids
  const parentIds = limitParents.map((e) => e.id);

  // 대댓글 list
  const replies = await baseQuery.where(
    and(
      inArray(guestBoardSchema.parent_id, parentIds),
      isNotNull(guestBoardSchema.parent_id)
    )
  );

  const newArr = [...limitParents, ...replies];
  const commentList = mapToCommentModel(newArr);

  const status: { [key: string]: any } = {};

  if (!cursor) {
    // 전체
    const [row] = await db.select({ count: count() }).from(guestBoardSchema);
    const { startOfToday, endOfToday } = DateUtils.krUTC();

    const rows = await db
      .select({ count: count() })
      .from(guestBoardSchema)
      .where(
        and(
          gte(guestBoardSchema.created_at, startOfToday),
          lt(guestBoardSchema.created_at, endOfToday),
          isNull(guestBoardSchema.parent_id)
        )
      );

    status["total"] = row.count;
    status["today"] = rows[0].count;
  }

  return NextResponse.json({
    success: true,
    result: {
      list: createCommentTree(commentList),
      isNextPage: parents.length > LIMIT,
      ...(!cursor && { status }),
    },
  });
}
