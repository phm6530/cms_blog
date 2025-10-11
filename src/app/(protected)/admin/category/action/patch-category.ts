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
 * @description id있으면 subGroup 수정, 없으면 category 수정
 **/
export const modifyCategory = async ({
  groupId,
  categoryId,
  categoryName,
  description,
}: ModifyCategory) => {
  const isSub = groupId != null;

  const session = await auth();
  if (!session?.user) throw new Error("권한 없음");

  const execModify = async () => {
    if (isSub) {
      // 동일 그룹명 존재 여부 검사 (현재 그룹 제외)

      const dup = await db
        .select()
        .from(blogSubGroup)
        .where(
          and(
            eq(blogSubGroup.group_id, groupId),
            eq(blogSubGroup.sub_group_name, categoryName),
            ne(blogSubGroup.sub_group_id, categoryId)
          )
        );

      if (dup.length > 0) throw new Error("이미 존재하는 서브 그룹 명입니다.");
      console.log(categoryName);

      const [row] = await db
        .update(blogSubGroup)
        .set({
          sub_group_name: categoryName,
        })
        .where(eq(blogSubGroup.sub_group_id, groupId))
        .returning({
          id: blogSubGroup.sub_group_id,
          subGroupName: blogSubGroup.sub_group_name,
        });
      console.log(row);
      return row;
    } else {
      const dup = await db
        .select()
        .from(categorySchema)
        .where(
          and(
            eq(categorySchema.group_name, categoryName),
            ne(categorySchema.group_id, categoryId)
          )
        );

      if (dup.length > 0) throw new Error("이미 존재하는 카테고리 명입니다.");

      const [row] = await db
        .update(categorySchema)
        .set({
          group_name: categoryName,
          group_description: description,
        })
        .where(eq(categorySchema.group_id, categoryId))
        .returning({
          id: categorySchema.group_id,
          categoryName: categorySchema.group_name,
          description: categorySchema.group_description,
        });
      console.log(row);
      return row;
    }
  };

  return await actionWrapper(execModify, {
    tags: [REVALIDATE.POST.CATEGORY],
  });
};
