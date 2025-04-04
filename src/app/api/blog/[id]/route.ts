import { db } from "@/db/db";
import { blogContentsSchema } from "@/db/schema/blog-contents";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; //v15 부턴 바꼇나보네

  if (!id) {
    return NextResponse.json(
      { error: true, message: "잘못된 요청입니다." },
      { status: 400 }
    );
  }

  const [rows] = await db
    .select()
    .from(blogMetaSchema)
    .innerJoin(
      blogContentsSchema,
      eq(blogContentsSchema.post_id, blogMetaSchema.post_id)
    )
    .where(eq(blogContentsSchema.post_id, id));

  return NextResponse.json({ success: true, result: rows }, { status: 200 });
}
