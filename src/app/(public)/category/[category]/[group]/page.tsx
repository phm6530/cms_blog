import getBlogList from "@/service/get-blog-list";
import { REVALIDATE } from "@/type/constants";
import { unstable_cache } from "next/cache";
import CategoryPage from "../_components/page";

const getCachedList = (categoryTag: string, groupTag: string) =>
  unstable_cache(
    async () => {
      const { list, rowsCnt } = await getBlogList({
        groupTag,
        categoryTag,
        permission: false,
        searchKeyword: null,
        cursor: null,
        limit: 10,
        curPostId: null,
      });
      return { list, rowsCnt };
    },
    [`${REVALIDATE.POST.LIST}:${categoryTag}:all`],
    { tags: [REVALIDATE.POST.LIST] }
  )();
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; group: string }>;
}) {
  const { category, group } = await params;
  const categoryTag = decodeURI(category);
  const groupTag = decodeURI(group);
  const { list, rowsCnt } = await getCachedList(categoryTag, groupTag);

  return <CategoryPage initalData={list} initalIsNextPage={rowsCnt > 10} />;
}
