import { commentSchema } from "@/db/schema/comments";
import { guestSchema } from "@/db/schema/guest";
import { WithTransaction } from "@/util/withTransaction";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const data: {
    guest: string;
    password: string;
    contents: string;
    parent_id?: number;
  } = await req.json();

  console.log((await context.params).id, data);

  const { id } = await context.params;

  await WithTransaction.run(async (tx) => {
    let guestId: number | undefined;

    // Guest가 있을 때만 등록
    if (data.guest) {
      const [row] = await tx
        .insert(guestSchema)
        .values({
          nickname: data.guest,
          password: await bcrypt.hash(data.password, 10),
        })
        .returning({ id: guestSchema.id });

      guestId = row.id;
    }

    if (!guestId) {
      throw new Error("게스트 생성 실패");
    }

    await tx.insert(commentSchema).values({
      comment: data.contents,
      parent_id: data.parent_id ?? null,
      author_id: guestId,
      author_type: "guest",
      post_id: parseInt(id, 10),
    });
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
