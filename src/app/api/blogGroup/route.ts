import { db } from "@/db/db";
import { blogGroup, blogSubGroup } from "@/db/schema/blog-group";
import { blogMetaSchema } from "@/db/schema/blog-metadata";
import { BlogGroupModel } from "@/type/blog-group";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const hashMap = new Map<string, BlogGroupModel>();

  const rows = await db
    .select({
      groupId: blogGroup.group_id,
      groupName: blogGroup.group_name,
      subGroupId: blogSubGroup.sub_group_id,
      subGroupName: blogSubGroup.sub_group_name,
      thumb: blogSubGroup.default_thum,
      postCount: sql<number>`COUNT(${blogMetaSchema.post_id})`.as("postCount"),
    })
    .from(blogGroup)
    .leftJoin(blogSubGroup, eq(blogGroup.group_id, blogSubGroup.group_id))
    .leftJoin(
      blogMetaSchema,
      eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
    )
    .groupBy(
      blogGroup.group_id,
      blogGroup.group_name,
      blogSubGroup.sub_group_id,
      blogSubGroup.sub_group_name,
      blogSubGroup.default_thum
    );

  let count = 0;
  const countType = (
    postCount: BlogGroupModel["subGroups"][number]["postCount"]
  ) => (typeof postCount === "string" ? parseInt(postCount, 10) : postCount);

  for (const items of rows) {
    if (!hashMap.has(items.groupName)) {
      hashMap.set(items.groupName, {
        groupId: items.groupId,
        groupName: items.groupName,

        subGroups: [],
      });
    }

    if (items.subGroupId) {
      const idx = hashMap.get(items.groupName)!;
      const postCount = countType(items.postCount);
      idx.subGroups.push({
        subGroupId: items.subGroupId,
        subGroupName: items.subGroupName!,
        postCount,
        thumb: items.thumb,
      });
      count += postCount;
    }
  }
  const tagGroups = [...hashMap.values(), count];

  console.log(tagGroups);

  return NextResponse.json({
    success: true,
    result: tagGroups,
  });
}
