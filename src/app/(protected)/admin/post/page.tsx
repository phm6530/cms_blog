"use client";
import { REVALIDATE } from "@/type/constants";
import { AdminPostItemModel } from "@/type/post.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostListItem from "../components/post-list-item";
import withClientFetch from "@/util/withClientFetch";
import SearchInput from "@/components/ui/search-input";

export default function Page() {
  const isSubGroup = "all";
  const category = "all";

  const { data, fetchNextPage, isFetching, isPending } = useInfiniteQuery({
    queryKey: [REVALIDATE.BLOG.LIST, category, isSubGroup],
    queryFn: async ({ pageParam }) => {
      const limit = 10;
      const cursor = pageParam !== 0 ? pageParam : null; // 일단 초기 0, APi 변경후에 받을예정임

      let baseUrl = `api/post?category=${category}&group=${isSubGroup}`;
      baseUrl += `&cursor=${cursor}&limit=${limit}`;

      const response = await withClientFetch<{
        success: boolean;
        result: {
          list: Array<AdminPostItemModel>;
          isNextPage: boolean;
        };
      }>({
        endPoint: baseUrl,
        requireAuth: true,
      });
      if (response.success) {
      }
      return response.result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.isNextPage) {
        return lastPage.list.at(-1)?.post_id;
      }
    },
    initialPageParam: 0,
    staleTime: 10000,
  });

  if (isPending) {
    return "loading......";
  }

  if (!data) {
    return <>데이터 없음</>;
  }
  const flatPageDatas = data?.pages.flatMap((page) => page.list);

  return (
    <div className="flex flex-col gap-4 justify-start">
      <SearchInput name="keyword" className="ml-0 mr-auto" />
      <section className="border divide-y">
        {flatPageDatas.map((item, idx) => {
          return (
            <PostListItem key={`admin:${item.post_id}:${idx}`} {...item} />
          );
        })}
      </section>
    </div>
  );
}
