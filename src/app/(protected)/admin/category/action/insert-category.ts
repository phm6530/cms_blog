"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import { blogSubGroup, categorySchema } from "@/db/schema";
import { REVALIDATE } from "@/type/constants";
import { actionWrapper } from "@/util/action-wrapper";
import { and, eq, ilike } from "drizzle-orm";

export async function insertCategory({
  id,
  categoryName,
  description,
}: {
  id?: number;
  categoryName: string;
  description?: string;
}) {
  const session = await auth();

  /**
   * @description id 있으면 subGorup 처리
   **/
  const addGroup = !!id ? "subgorup" : "category";

  const insertService = async () => {
    if (!session?.user) {
      throw new Error("권한 없음....");
    }

    if (addGroup === "subgorup" && id) {
      const row = await db
        .select()
        .from(blogSubGroup)
        .where(
          and(
            eq(blogSubGroup.group_id, id),
            eq(blogSubGroup.sub_group_name, categoryName)
          )
        );

      if (row.length !== 0) {
        throw new Error("이미 존재하는 그룹 명입니다.");
      }

      await db.insert(blogSubGroup).values({
        sub_group_name: categoryName,
        group_id: id,
      });
    } else {
      const row = await db
        .select()
        .from(categorySchema)
        .where(ilike(categorySchema.group_name, categoryName));
      if (row.length !== 0) {
        throw new Error("이미 존재하는 카테고리 명입니다.");
      }
      await db.insert(categorySchema).values({
        group_name: categoryName,
        group_description: description,
      });
    }
  };

  return await actionWrapper(insertService, {
    tags: [REVALIDATE.POST.CATEGORY],
  });
}
