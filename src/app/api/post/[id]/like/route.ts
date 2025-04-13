import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { REVALIDATE } from "@/type/constants";
import { apiHandler } from "@/util/api-hanlder";
import { eq, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const actionsType = ["unlike", "like"];

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const qs = req.nextUrl.searchParams;
  const { id } = await context.params;
  const actions = qs.get("action");

  console.log(qs, id);

  return await apiHandler(async () => {
    if (!actions || !actionsType.includes(actions) || isNaN(+id)) {
      throw new Error("잘못된 요청입니다.");
    }

    await db
      .update(blogMetaSchema)
      .set({
        like_cnt: sql<number>`${blogMetaSchema.like_cnt} + ${
          actions === "like" ? 1 : -1
        }`,
      })
      .where(eq(blogMetaSchema.post_id, parseInt(id, 10)));
    revalidateTag(`${REVALIDATE.BLOG.DETAIL}:${id}`);
    return NextResponse.json({ message: "test..." });
  });
}
