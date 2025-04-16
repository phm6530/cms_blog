"use server";
import { pinnedPostSchema } from "@/db/schema/post/pinned-post";
import { REVALIDATE } from "@/type/constants";
import { WithTransaction } from "@/util/withTransaction";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function replaceSortAction(
  replaceSortArr: Array<{ pinId: number; newOrder: number }>
) {
  try {
    await WithTransaction.run(async (tx) => {
      return await Promise.all(
        replaceSortArr.map((e) => {
          return tx
            .update(pinnedPostSchema)
            .set({ order: e.newOrder })
            .where(eq(pinnedPostSchema.id, e.pinId));
        })
      );
    });
    // 메인 고정글 순서 변경
    revalidateTag(REVALIDATE.PINNED_POST);

    return { success: true };
  } catch (err) {
    console.error("정렬 저장 실패", err);
    return { success: false, message: "정렬 저장 중 오류 발생" };
  }
}
