"use client";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

import { LIMIT_CNT, QUERYKEY } from "@/type/constants";
import PostItem from "../../category/post-list-item";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import LoadingSpinerV2 from "@/components/ui/loading-spinner-v2";

import { ObserverGSAPWrapper } from "@/components/ani-components/observer-wrapper";
import { InitialReturnData } from "../../category/[category]/_components/page";

export default function Keyword() {
  const { keyword } = useParams();
  const ref = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, isPending } = useInfiniteQuery<{
    list: InitialReturnData;
    isNextPage: boolean;
    total: string;
  }>({
    queryKey: [QUERYKEY.SEARCH, keyword],
    queryFn: async ({ pageParam }) => {
      const limit = LIMIT_CNT.POST_LIST;
      const cursor = pageParam !== 0 ? pageParam : null; // 일단 초기 0, APi 변경후에 받을예정임

      let baseUrl = `api/post?group=all&keyword=${decodeURIComponent(
        keyword as string
      )}`;
      baseUrl += `&cursor=${cursor}&limit=${limit}`;

      const response = await withFetchRevaildationAction<{
        list: InitialReturnData;
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
      <div className="border-b pb-5  pt-5 md:pt-15 text-xl flex gap-3 items-center">
        {decodeURIComponent(keyword as string)}
        {isPending ? (
          <Skeleton className="size-5" />
        ) : (
          <>
            <span className=" dark:text-indigo-400 text-primary">
              ( {data?.pages[0].total} )
            </span>
          </>
        )}
      </div>

      <>
        {isPending ? (
          <div className="py-15 text-center  col-span-full">
            <LoadingSpinerV2 text="loading ..." />
          </div>
        ) : (
          <>
            {flatPageDatas.length === 0 ? (
              <div className="py-15 text-center  col-span-full">
                <ObserverGSAPWrapper>
                  일치하는 검색어가 없습니다.
                </ObserverGSAPWrapper>
              </div>
            ) : (
              <>
                <section className="py-5 grid md:grid-cols-2 lg:grid-cols-3 w-full  gap-5 md:gap-10 relative">
                  {flatPageDatas?.length === 0 ? (
                    <div>등록된 콘텐츠가 없습니다.</div>
                  ) : (
                    flatPageDatas?.map((item, idx) => {
                      const isLast = flatPageDatas.length - 2 === idx;
                      return (
                        <ObserverGSAPWrapper key={`${item?.post_id}-${idx}`}>
                          <PostItem
                            {...item}
                            keyword={decodeURIComponent(keyword as string)}
                            ref={isLast ? ref : undefined}
                          />
                        </ObserverGSAPWrapper>
                      );
                    })
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
