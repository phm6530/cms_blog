import getBlogList from "@/service/get-blog-list";
import CategoryPage from "./_components/page";
import { unstable_cache } from "next/cache";
import { LIMIT_CNT, REVALIDATE } from "@/type/constants";

//전체
const getCachedList = (categoryTag: string) =>
  unstable_cache(
    async () => {
      const { list, isNextPage } = await getBlogList({
        groupTag: null,
        categoryTag,
        permission: false,
        searchKeyword: null,
        cursor: null,
        limit: LIMIT_CNT.POST_LIST,
        curPostId: null,
      });
      return { list, isNextPage };
    },
    [`${REVALIDATE.POST.LIST}:${categoryTag}:all`],
    { tags: [REVALIDATE.POST.LIST] }
  )();

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryTag = decodeURI(category);
  const { list, isNextPage } = await getCachedList(categoryTag);

  return <CategoryPage initalData={list} initalIsNextPage={isNextPage} />;
}
