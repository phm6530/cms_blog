import getBlogList from "@/service/get-blog-list";
import { LIMIT_CNT, REVALIDATE } from "@/type/constants";
import { unstable_cache } from "next/cache";
import CategoryPage from "../_components/page";

const getCachedList = (categoryTag: string, groupTag: string) =>
  unstable_cache(
    async () => {
      const { list, isNextPage } = await getBlogList({
        groupTag,
        categoryTag,
        permission: false,
        searchKeyword: null,
        cursor: null,
        limit: LIMIT_CNT.POST_LIST,
        curPostId: null,
      });
      return { list, isNextPage };
    },
    [`${REVALIDATE.POST.LIST}:${categoryTag}:${groupTag}`],
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
  const { list, isNextPage } = await getCachedList(categoryTag, groupTag);

  return <CategoryPage initalData={list} initalIsNextPage={isNextPage} />;
}
