import { auth } from "@/auth";
import { db } from "@/db/db";
import { blogSubGroup, categorySchema } from "@/db/schema/category";
import { REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { and, eq, ilike } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body: { categoryName: string; id?: number } = await req.json();
  const session = await auth();

  /**
   * @description id있으면 subGorup 처리
   **/
  const addGroup = !!body.id ? "subgorup" : "category";

  return await apiHandler(async () => {
    if (!session?.user) {
      throw new Error("권한 없음....");
    }

    if (addGroup === "subgorup" && body.id) {
      const row = await db
        .select()
        .from(blogSubGroup)
        .where(
          and(
            eq(blogSubGroup.group_id, body.id),
            eq(blogSubGroup.sub_group_name, body.categoryName)
          )
        );

      if (row.length !== 0) {
        throw new Error("이미 존재하는 그룹 명입니다.");
      }

      await db.insert(blogSubGroup).values({
        sub_group_name: body.categoryName,
        group_id: body.id,
      });
    } else {
      const row = await db
        .select()
        .from(categorySchema)
        .where(ilike(categorySchema.group_name, body.categoryName));
      if (row.length !== 0) {
        throw new Error("이미 존재하는 카테고리 명입니다.");
      }
      await db.insert(categorySchema).values({
        group_name: body.categoryName,
      });
    }

    revalidateTag(REVALIDATE.BLOG.GROUPS);
  });
}

export async function DELETE(req: NextRequest) {
  const body: { id: number } = await req.json();
  const session = await auth();

  return await apiHandler(async () => {
    if (!session?.user) {
      throw new Error("권한 없음....");
    }
    const row = await db
      .select()
      .from(categorySchema)
      .where(eq(categorySchema.group_id, body.id));

    if (row.length === 0 || !row) {
      throw new Error("이미 삭제되었거나 잘못된 요청입니다.");
    }
    await db.delete(categorySchema).where(eq(categorySchema.group_id, body.id));
    revalidateTag(REVALIDATE.BLOG.GROUPS);
  });
}
