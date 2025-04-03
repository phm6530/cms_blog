import { db } from "@/db/db";
import { blogGroup, blogSubGroup } from "@/db/schema/blog-group";
import { BlogGroupModel } from "@/type/blog-group";
import { eq } from "drizzle-orm";
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
    })
    .from(blogGroup)
    .leftJoin(blogSubGroup, eq(blogGroup.group_id, blogSubGroup.group_id));

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
      idx.subGroups.push({
        subGroupId: items.subGroupId,
        subGroupName: items.subGroupName!,
        thumb: items.thumb,
      });
    }
  }
  const tagGroups = [...hashMap.values()];

  console.log("요청안옴 ㅎ");
  return NextResponse.json({
    success: true,
    result: tagGroups,
  });
}
