import { auth } from "@/auth";
import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth();
  const body = await req.json();

  return await apiHandler(async () => {
    if (!session?.user || !id) {
      throw new Error("권한이 없거나 잘못된 요청입니다.");
    }

    const test = await db
      .update(blogMetaSchema)
      .set({ view: body.view })
      .where(eq(blogMetaSchema.post_id, +id))
      .returning({ view: blogMetaSchema.view });

    revalidateTag(`${REVALIDATE.BLOG.DETAIL}:${id}`);
    revalidateTag(REVALIDATE.BLOG.LIST);
    revalidateTag(REVALIDATE.BLOG.GROUPS);

    return test;
  });
}
