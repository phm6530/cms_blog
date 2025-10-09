"use server";
import { auth } from "@/auth";
import { db } from "@/db/db";
import { blogSubGroup, categorySchema } from "@/db/schema";
import { REVALIDATE } from "@/type/constants";
import { actionWrapper } from "@/util/action-wrapper";
import { and, eq, ne } from "drizzle-orm";

type ModifyCategory = {
  categoryName: string;
  groupId?: number;
  categoryId: number;
  description?: string;
};
/**
 * @description id있으면 subGorup 처리
 **/

export const modifyCategory = async ({
  groupId,
  categoryId,
  categoryName,
  description,
}: ModifyCategory) => {
  const isSub = groupId != null;

  const session = await auth();
  if (!session?.user) {
    throw new Error("권한 없음....");
  }

  const insertService = async () => {
    if (isSub) {
      const row = await db
        .select()
        .from(blogSubGroup)
        .where(
          and(
            eq(blogSubGroup.group_id, groupId),
            eq(blogSubGroup.sub_group_name, categoryName)
          )
        );

      if (row.length !== 0) {
        throw new Error("이미 존재하는 그룹 명입니다.");
      }

      return await db.insert(blogSubGroup).values({
        sub_group_name: categoryName,
        group_id: groupId,
      });
    } else {
      const rows = await db
        .select()
        .from(categorySchema)
        .where(
          and(
            eq(categorySchema.group_name, categoryName),
            ne(categorySchema.group_id, categoryId) // 현재 수정 중인 카테고리는 제외
          )
        );

      if (rows.length !== 0) {
        throw new Error("이미 존재하는 카테고리 명입니다.");
      }

      const [row] = await db
        .update(categorySchema)
        .set({
          group_name: categoryName,
          group_description: description,
        })
        .where(eq(categorySchema.group_id, categoryId!))
        .returning({
          id: categorySchema.group_id,
          categoryName: categorySchema.group_name,
          description: categorySchema.group_description,
        });

      return row;
    }
  };

  return await actionWrapper(insertService, {
    tags: [REVALIDATE.POST.CATEGORY],
  });
};
