import { db } from "@/db/db";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return await apiHandler(async () => {
    if (id === "undefined" || !id) {
      throw new Error("잘못된 요청입니다.");
    }
    await db.delete(pinnedPostSchema).where(eq(pinnedPostSchema.id, +id));
    revalidateTag(REVALIDATE.PINNED_POST);
  });
}
