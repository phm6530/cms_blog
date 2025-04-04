import { db } from "@/db/db";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type CommentItemModel = {
  id: number;
  comment: string; //본문
  post_id: number;
  parent_id: number | null;
  created_at: string;
  author: {
    id: number;
    type: string;
    nickname: string;
  };

  children: CommentItemModel[]; //재귀 타입하기 ㅇㅇ
};

export async function GET(req: NextRequest) {
  const test = new URL(req.url);
  const postId = test.searchParams.get("postId");

  if (!postId) {
    throw new Error("잘못된 요청입니다.");
  }

  const result = await db
    .select({
      id: commentSchema.id,
      post_id: commentSchema.post_id,
      comment: commentSchema.comment,
      created_at: commentSchema.createdAt,
      parent_id: commentSchema.parent_id,
      author: {
        id: guestSchema.id,
        nickname: guestSchema.nickname,
      },
    })
    .from(commentSchema)
    .leftJoin(
      guestSchema,
      and(
        eq(commentSchema.author_id, guestSchema.id),
        eq(commentSchema.author_type, "guest")
      )
    )
    .where(eq(commentSchema.post_id, parseInt(postId, 10)));

  // ✅ CommentItemModel[]로 가공
  const commentList: CommentItemModel[] = result.map(({ author, ...rest }) => ({
    ...rest,
    created_at: rest.created_at.toISOString(),
    author: {
      id: author!.id,
      nickname: author!.nickname,
      type: "guest",
    },
    children: [],
  }));

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
