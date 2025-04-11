import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { guestBoardSchema } from "@/db/schema/guest-board";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { Session } from "next-auth";

export async function commentVerfiyDelete({
  InjectionSchema,
  session,
  password,
  commentId,
}: {
  InjectionSchema: typeof commentSchema | typeof guestBoardSchema;
  session: Session | null;
  password: string | null;
  commentId: number;
}) {
  const [row] = await db
    .select({
      role: InjectionSchema.author_type,
      email: usersTable.email,
      guestPassword: guestSchema.password,
    })
    .from(InjectionSchema)
    .leftJoin(
      usersTable,
      and(
        eq(InjectionSchema.author_id, usersTable.id),
        eq(InjectionSchema.author_type, usersTable.role)
      )
    )
    .leftJoin(guestSchema, and(eq(InjectionSchema.author_id, guestSchema.id)))
    .where(eq(InjectionSchema.id, Number(commentId)));

  if (!row) throw new Error("이미 삭제되었거나 잘못된 요청입니다.");

  const { role, email, guestPassword } = row;

  const isAdmin =
    ["super", "admin"].includes(role) && email === session?.user?.email;

  let isGuestVerified = false;
  if (role === "guest") {
    if (!password || !guestPassword) throw new Error("비밀번호가 필요합니다.");

    isGuestVerified = await bcrypt.compare(password, guestPassword);
    if (!isGuestVerified) throw new Error("비밀번호가 일치하지 않습니다.");
  }

  if (!isAdmin && !isGuestVerified) {
    throw new Error("삭제 권한이 없습니다.");
  }
}
