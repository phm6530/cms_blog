"use client";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

import { QUERYKEY } from "@/type/constants";
import PostItem from "../../category/post-list-item";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { PostItemModel } from "@/type/post.type";
import { useEffect, useRef } from "react";
import LoadingSpinerV2 from "@/components/ui/loading-spinner-v2";
import PostItemSkeleton from "../../category/post-item-skeleton";

export default function Keyword() {
  const { keyword } = useParams();
  const ref = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isFetching, isPending } = useInfiniteQuery<{
    list: PostItemModel[];
    isNextPage: boolean;
    total: string;
  }>({
    queryKey: [QUERYKEY.SEARCH, keyword],
    queryFn: async ({ pageParam }) => {
      const limit = 10;
      const cursor = pageParam !== 0 ? pageParam : null; // 일단 초기 0, APi 변경후에 받을예정임

      let baseUrl = `api/post?group=all&keyword=${decodeURIComponent(
        keyword as string
      )}`;
      baseUrl += `&cursor=${cursor}&limit=${limit}`;

      const response = await withFetchRevaildationAction<{
        list: Array<PostItemModel>;
        isNextPage: boolean;
        total: string;
      }>({
        endPoint: baseUrl,
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.isNextPage) {
        return lastPage.list.at(-1)?.post_id;
      }
    },
    initialPageParam: 0,
    placeholderData: undefined,
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
    <>
      <div className="border-b pb-5 text-xl flex gap-3 items-center">
        {decodeURIComponent(keyword as string)}
        {isPending ? (
          <Skeleton className="size-5" />
        ) : (
          <span className=" dark:text-indigo-400 text-primary">
            ( {data?.pages[0].total} )
          </span>
        )}
      </div>

      <>
        {isPending ? (
          <div className="mt-5">
            {" "}
            <div className="flex flex-col gap-5 py-5">
              {Array.from({ length: 10 }).map((_, idx) => {
                return <PostItemSkeleton key={`skeleton-${idx}`} />;
              })}
            </div>
          </div>
        ) : (
          <>
            {flatPageDatas.length === 0 ? (
              <div className="my-10 ">검색어가 없습니다.</div>
            ) : (
              <>
                <section className=" flex flex-col">
                  <div className="flex flex-col">
                    {flatPageDatas?.length === 0 ? (
                      <div>등록된 콘텐츠가 없습니다.</div>
                    ) : (
                      flatPageDatas?.map((item, idx) => {
                        const isLast = flatPageDatas.length - 2 === idx;
                        return (
                          <PostItem
                            {...item}
                            key={`${item?.post_id}-${idx}`}
                            keyword={decodeURIComponent(keyword as string)}
                            ref={isLast ? ref : undefined}
                          />
                        );
                      })
                    )}
                  </div>
                  {isFetching && (
                    <>
                      <LoadingSpinerV2 text="loading ..." />
                    </>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </>
    </>
  );
}
