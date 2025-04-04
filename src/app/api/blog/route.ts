import { db } from "@/db/db";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const list = await db
    .select()
    .from(blogMetaSchema)
    .orderBy(desc(blogMetaSchema.post_id))
    .limit(10)
    .offset(0);

  return NextResponse.json({ success: true, result: list });
}
