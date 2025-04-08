import { db } from "@/db/db";
import { blogSubGroup } from "@/db/schema/blog-group";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const QUERYSTRING_blogSubGroup = url.searchParams.get("group");

  const rows = await db
    .select()
    .from(blogMetaSchema)
    .innerJoin(
      blogSubGroup,
      eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
    )
    .where(
      !QUERYSTRING_blogSubGroup || QUERYSTRING_blogSubGroup === "all"
        ? undefined
        : eq(blogSubGroup.sub_group_name, QUERYSTRING_blogSubGroup)
    )
    .orderBy(desc(blogMetaSchema.post_id))
    .limit(10)
    .offset(0);

  const flatRows = rows.map(({ blog_metadata, blog_sub_group }) => {
    return { ...blog_metadata, sub_group_name: blog_sub_group.sub_group_name };
  });

  return NextResponse.json({ success: true, result: flatRows });
}
