import { db } from "@/db/db";
import { blogMetaSchema, blogSubGroup, categorySchema } from "@/db/schema";
import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const _getCategories = async () => {
  const hashMap = new Map<string, CategoryModel>();
  const rows = await db
    .select({
      groupId: categorySchema.group_id,
      groupName: categorySchema.group_name,
      subGroupId: blogSubGroup.sub_group_id,
      subGroupName: blogSubGroup.sub_group_name,
      thumb: blogSubGroup.default_thum,
      postCount: sql<number>`COUNT(${blogMetaSchema.post_id})`.as("postCount"),
      groupDescription: categorySchema.group_description,
    })
    .from(categorySchema)
    .leftJoin(blogSubGroup, eq(categorySchema.group_id, blogSubGroup.group_id))
    .leftJoin(
      blogMetaSchema,
      eq(blogMetaSchema.sub_group_id, blogSubGroup.sub_group_id)
    )
    // .where(eq(blogMetaSchema.view, true))
    .groupBy(
      categorySchema.group_id,
      categorySchema.group_name,
      blogSubGroup.sub_group_id,
      blogSubGroup.sub_group_name,
      blogSubGroup.default_thum,
      categorySchema.group_description
    );

  let count = 0;
  const countType = (
    postCount: CategoryModel["subGroups"][number]["postCount"]
  ) => (typeof postCount === "string" ? parseInt(postCount, 10) : postCount);

  for (const items of rows) {
    if (!hashMap.has(items.groupName)) {
      hashMap.set(items.groupName, {
        id: items.groupId,
        name: items.groupName,
        description: items.groupDescription,
        postCnt: 0,
        subGroups: [],
      });
    }

    if (items.subGroupId) {
      const idx = hashMap.get(items.groupName)!;
      const postCount = countType(items.postCount);

      idx.subGroups.push({
        id: items.subGroupId,
        subGroupName: items.subGroupName!,
        postCount,
        thumb: items.thumb,
      });

      idx.postCnt += postCount; // category 별
      count += postCount;
    }
  }

  return {
    categories: Object.fromEntries(hashMap),
    count,
  };
};

const getCategories = unstable_cache(
  _getCategories,
  [REVALIDATE.POST.CATEGORY],
  {
    tags: [REVALIDATE.POST.CATEGORY],
  }
);

export default getCategories;
