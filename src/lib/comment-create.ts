import { usersTable } from "@/db/schema";
import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { guestBoardSchema } from "@/db/schema/guest-board";
import { WithTransaction } from "@/util/withTransaction";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Session } from "next-auth";

type CommentCreateServiceProps = {
  schema: typeof commentSchema | typeof guestBoardSchema;
  data: {
    guest?: string;
    password?: string;
    comment: string;
    parent_id?: number;
  };
  session: Session | null;
  postId?: string;
};

export async function ComemntCreateService({
  schema,
  data,
  session,
  postId,
}: CommentCreateServiceProps) {
  return await WithTransaction.run(async (tx) => {
    const isCommentSchema = schema === commentSchema;

    // Guest
    if (data.guest && data.password) {
      const [row] = await tx
        .insert(guestSchema)
        .values({
          nickname: data.guest,
          password: await bcrypt.hash(data.password, 10),
          guest_icon: null,
        })
        .returning({ id: guestSchema.id });

      if (!row) {
        throw new Error("게스트 생성 실패");
      }

      await tx.insert(schema).values({
        comment: data.comment,
        parent_id: data.parent_id ?? null,
        author_id: row.id,
        author_type: "guest",

        ...(!!isCommentSchema
          ? {
              post_id: parseInt(postId!, 10),
            }
          : {}),
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

      await tx.insert(schema).values({
        comment: data.comment!,
        parent_id: data.parent_id ?? null,
        author_id: rows.id,
        author_type: session.user.role as "admin" | "super",
        ...(!!isCommentSchema
          ? {
              post_id: parseInt(postId!, 10),
            }
          : {}),
      });
    }
  });
}
