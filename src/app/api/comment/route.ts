import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Author =
  | {
      role: "admin" | "super";
      admin_email: string;
      nickname: string;
      guest_id?: undefined;
      profile_img: string | null;
    }
  | {
      role: "guest";
      guest_id: number;
      nickname: string;
      admin_email?: undefined;
    };

export type CommentItemModel = {
  id: number;
  comment: string;
  parent_id: number | null;
  created_at: string;
  author: Author;
  post_id: number;
  children: CommentItemModel[]; //재귀 타입하기 ㅇㅇ
};

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

  // ✅ CommentItemModel[]로 가공
  const commentList: CommentItemModel[] = rows.map((data) => {
    const {
      author_role,
      admin_email,
      admin_nickname,
      guest_id,
      guest_nickname,
      created_at,
      profile_img,
      ...rest
    } = data;

    const author =
      author_role === "admin" || author_role === "super"
        ? {
            role: author_role!,
            admin_email: admin_email!,
            nickname: admin_nickname!,
            profile_img,
          }
        : {
            role: author_role!,
            guest_id: guest_id!,
            nickname: guest_nickname!,
            profile_img: null, //guest는 일단 Null처리
          };

    // 구조 변경,
    const obj: CommentItemModel = {
      ...rest,
      author,
      created_at: created_at.toISOString(),
      children: [],
    };
    return obj;
  });

  // ✅ O(n) 방식으로 트리 구성
  function buildCommentTreeFast(list: CommentItemModel[]): CommentItemModel[] {
    const map = new Map<number, CommentItemModel>();
    const rootComments: CommentItemModel[] = [];

    for (const item of list) {
      map.set(item.id, { ...item, children: [] });
    }

    for (const item of list) {
      const current = map.get(item.id)!;

      if (item.parent_id) {
        const parent = map.get(item.parent_id);
        if (parent) parent.children.push(current);
      } else {
        rootComments.push(current);
      }
    }

    return rootComments;
  }

  return NextResponse.json({
    success: true,
    result: buildCommentTreeFast(commentList),
  });
}
