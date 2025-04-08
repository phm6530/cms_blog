import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { guestSchema } from "@/db/schema/guest";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type AdminComment = {
  role: "admin" | "super";
  admin_email: string;
  nickname: string;
};

type GuestComment = {
  role: "guest";
  guest_nickname: string;
  guest_id: number;
};

type Author = AdminComment | GuestComment;

export type GuestBookModel = {
  id: number;
  content: string;
  parent_id: number | null;
  created_at: string;
  author: Author;
  children: GuestBookModel[];
};

export async function GET() {
  const rows = await db
    .select({
      id: guestBoardSchema.idx,
      content: guestBoardSchema.contents,
      createAt: guestBoardSchema.createdAt,
      author_type: guestBoardSchema.author_type,
      guest_nickname: guestSchema.nickname,
      guest_id: guestSchema.id,
      admin_email: usersTable.email,
      admin_nickname: usersTable.nickname,
      author_role: usersTable.role || "guest",
      parent_id: guestBoardSchema.parent_id,
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
        eq(guestBoardSchema.author_type, "admin")
      )
    )
    .orderBy(desc(guestBoardSchema.idx));

  const commentList: GuestBookModel[] = rows.map((data) => {
    const {
      author_role,
      admin_email,
      admin_nickname,
      guest_id,
      guest_nickname,
      createAt,
      ...rest
    } = data;

    const author =
      author_role === "admin" || author_role === "super"
        ? {
            role: author_role,
            admin_email: admin_email!,
            nickname: admin_nickname!,
          }
        : {
            role: "guest" as const,
            guest_id: guest_id!,
            guest_nickname: guest_nickname!,
          };

    // 구조 변경,
    const obj: GuestBookModel = {
      ...rest,
      created_at: createAt.toISOString(),
      author,
      children: [],
    };
    return obj;
  });

  function mappingTree(list: GuestBookModel[]) {
    const hashMap = new Map<number, GuestBookModel>();
    const result: GuestBookModel[] = [];

    for (const item of list) {
      hashMap.set(item.id, item);
    }

    for (const item of list) {
      //가져와서 부모인지 체크하고 분기하기
      const current = hashMap.get(item.id)!;
      if (!!item.parent_id) {
        const parent = hashMap.get(item.parent_id);

        if (parent) parent.children.push(current);
      } else {
        result.push(current);
      }
    }

    return result;
  }

  return NextResponse.json({ success: true, result: mappingTree(commentList) });
}
