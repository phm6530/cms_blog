"use client";

import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound, useParams } from "next/navigation";
import PostItem from "../../category/post-list-item";
import { PostItemModel } from "@/type/post.type";
import { useInfiniteQuery } from "@tanstack/react-query";

type InfinityResult<T> = {
  success: boolean;
  result: { list: Array<T>; isNextPage: boolean };
};

export default function CategoryPage() {
  const { category: categoryList }: { category: string[] } = useParams();
  const [category, group] = categoryList;
  const isSubGroup = group ?? "all"; // 없으면 전체 다 가져오기

  const { data, fetchNextPage, isFetching, isPending } = useInfiniteQuery<
    InfinityResult<PostItemModel>
  >({
    queryKey: [],
    queryFn: async ({ pageParam }) => {
      const limit = 10;
      const cursor = pageParam !== 0 ? pageParam : null; // 일단 초기 0, APi 변경후에 받을예정임

      let baseUrl = `api/post?category=${category}&group=${isSubGroup}`;
      baseUrl += `&cursor=${cursor}&limit=${limit}`;

      return await withFetchRevaildationAction<InfinityResult<PostItemModel>>({
        endPoint: baseUrl,
        options: {
          cache: "no-store",
          next: {
            tags: [REVALIDATE.BLOG.LIST, category, isSubGroup],
          },
        },
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.isNextPage;
    },
    initialPageParam: 0,
  });

  // if (!response.success) {
  //   notFound();
  // }

  const flatPageDatas = data?.pages.flatMap((page) => page.result.list);

  return (
    <section className=" flex flex-col">
      <div className="flex flex-col">
        {flatPageDatas?.map((item, idx) => {
          return <PostItem {...item} key={`${item.post_id}-${idx}`} />;
        })}
      </div>
    </section>
  );
}
