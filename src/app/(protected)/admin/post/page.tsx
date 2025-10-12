"use client";
import { LIMIT_CNT, REVALIDATE } from "@/type/constants";
import { AdminPostItemModel } from "@/type/post.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostListItem from "../components/post-list-item";
import withClientFetch from "@/util/withClientFetch";

import { useEffect, useRef, useState } from "react";
import LoadingSpinerV2 from "@/components/ui/loading-spinner-v2";
import { Button } from "@/components/ui/button";

import { PinnedSearchInput } from "./pinned/pinned-searchInput";

export default function Page() {
  const isSubGroup = "all";
  const category = "all";
  const ref = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState<string>("");

  const { data, isPending, hasNextPage, fetchNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: [REVALIDATE.POST.LIST, category, isSubGroup, keyword],
      queryFn: async ({ pageParam }) => {
        const limit = LIMIT_CNT.POST_LIST;
        const cursor = pageParam !== 0 ? pageParam : null;

        let baseUrl = `api/post?category=${category}&group=${isSubGroup}`;

        if (!(keyword.trim() === "")) {
          baseUrl += `&keyword=${keyword}`;
        }

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

  useEffect(() => {
    if (!ref.current) return;

    const currentRef = ref.current;

    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entity) => {
          if (entity.isIntersecting) {
            fetchNextPage();
          }
        });
      },
      { threshold: 1 }
    );

    io.observe(currentRef);

    return () => {
      io.unobserve(currentRef);
      io.disconnect();
    };
  }, [data, fetchNextPage]);

  const flatPageDatas = data?.pages.flatMap((page) => page.list) ?? [];

  return (
    <div className="flex flex-col gap-4 justify-start ">
      <PinnedSearchInput cb={setKeyword} />

      <section className="border-t divide-y mb-10">
        {isPending ? (
          <div className="py-10">
            <LoadingSpinerV2 />
          </div>
        ) : (
          <>
            {flatPageDatas.length === 0 && (
              <div className="py-5">등록된 데이터가 없습니다.</div>
            )}
            {flatPageDatas!.map((item, idx) => {
              return (
                <PostListItem key={`admin:${item.post_id}:${idx}`} {...item} />
              );
            })}

            {hasNextPage && (
              <Button
                variant={"outline"}
                className="text-center text-sm w-full "
                onClick={() => fetchNextPage()}
              >
                {isFetching ? <LoadingSpinerV2 /> : "  + 10개 더 가져오기"}
              </Button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
