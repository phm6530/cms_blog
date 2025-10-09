"use server";
import { auth } from "@/auth";
import { db } from "@/db/db";
import { blogSubGroup, categorySchema } from "@/db/schema";
import { REVALIDATE } from "@/type/constants";
import { actionWrapper } from "@/util/action-wrapper";
import { and, eq } from "drizzle-orm";

async function deleteCategory({
  groupId,
  categoryId,
}: {
  groupId?: number;
  categoryId: number;
}) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("권한 없음....");
  }

  const isSub = groupId != null;

  // 스키마
  const schema = isSub ? blogSubGroup : categorySchema;

  const whereConditions = isSub
    ? and(
        eq(blogSubGroup.group_id, categoryId),
        eq(blogSubGroup.sub_group_id, groupId)
      )
    : eq(categorySchema.group_id, categoryId);

  const row = await db.select().from(schema).where(whereConditions);

  if (row.length === 0) {
    throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
  }

  await db.delete(schema).where(whereConditions);
}

export default actionWrapper(deleteCategory, {
  tags: [REVALIDATE.POST.CATEGORY],
});
