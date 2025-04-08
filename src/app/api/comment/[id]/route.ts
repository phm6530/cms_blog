import { auth } from "@/auth";
import { usersTable } from "@/db/schema";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { REVALIDATE } from "@/type/constants";
import { WithTransaction } from "@/util/withTransaction";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth(); // Session get ..

  const data: {
    guest?: string;
    password?: string;
    contents: string;
    parent_id?: number;
  } = await req.json();

  const { id } = await context.params;
  try {
    await WithTransaction.run(async (tx) => {
      // Guest
      if (data.guest && data.password) {
        const [row] = await tx
          .insert(guestSchema)
          .values({
            nickname: data.guest,
            password: await bcrypt.hash(data.password, 10),
          })
          .returning({ id: guestSchema.id });

        if (!row) {
          throw new Error("게스트 생성 실패");
        }

        await tx.insert(commentSchema).values({
          comment: data.contents,
          parent_id: data.parent_id ?? null,
          author_id: row.id,
          author_type: "guest",
          post_id: parseInt(id, 10),
        });
      }
      // 세션이 존재하면 user
      else if (!!session?.user) {
        const [rows] = await tx
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.email, session.user.email!));

        if (!rows) {
          throw new Error("존재 하지 않는 사용자 입니다.");
        }

        await tx.insert(commentSchema).values({
          comment: data.contents,
          parent_id: data.parent_id ?? null,
          author_id: rows.id,
          author_type: session.user.role as "admin" | "super",
          post_id: parseInt(id, 10),
        });
      }
      revalidateTag(`${REVALIDATE.COMMENT}:${id}`);
    });
    //성송시
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
