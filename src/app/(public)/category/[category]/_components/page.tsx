"use client";

import { LIMIT_CNT, REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { usePathname } from "next/navigation";
import PostItem from "../../post-list-item";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostItemSkeleton from "../../post-item-skeleton";
import { useEffect, useRef } from "react";
import LoadingSpinerV2 from "@/components/ui/loading-spinner-v2";
import getBlogList from "@/service/get-blog-list";

import { ObserverGSAPWrapper } from "@/components/ani-components/observer-wrapper";
import { useGSAP } from "@gsap/react";

export type InitialReturnData = Awaited<ReturnType<typeof getBlogList>>["list"];
type CategoryPage = {
  initalData: InitialReturnData;
  initalIsNextPage: boolean;
};

export default function CategoryPage({
  initalData,
  initalIsNextPage,
}: CategoryPage) {
  const ref = useRef<HTMLDivElement>(null);

  const paths = usePathname();
  const [categoryName, groupName] = paths.split("/").slice(2);
  const decodingcategoryName = decodeURIComponent(categoryName);
  const isSubGroup = groupName ?? "all";

  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery<{
      list: InitialReturnData;
      isNextPage: boolean;
    }>({
      queryKey: [REVALIDATE.POST.LIST, decodingcategoryName, isSubGroup],
      queryFn: async ({ pageParam }) => {
        const limit = LIMIT_CNT.POST_LIST;
        const cursor = pageParam !== 0 ? pageParam : null; // 일단 초기 0, APi 변경후에 받을예정임

        let baseUrl = `api/post?category=${decodingcategoryName}&group=${isSubGroup}`;
        baseUrl += `&cursor=${cursor}&limit=${limit}`;

        const response = await withFetchRevaildationAction<{
          list: InitialReturnData;
          isNextPage: boolean;
        }>({
          endPoint: baseUrl,
          options: {
            cache: "force-cache",
            next: {
              tags: [
                REVALIDATE.POST.LIST,
                `${REVALIDATE.POST.LIST}:${decodingcategoryName}:${isSubGroup}`,
              ],
            },
          },
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
      initialData: {
        pages: [{ list: initalData, isNextPage: initalIsNextPage }],
        pageParams: [0],
      },
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      enabled: false,
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

  const flatPageDatas = data?.pages.flatMap((page) => page.list);
  useGSAP(() => {}, {});
  if (isPending || !data) {
    return (
      <div className="flex flex-col gap-5 py-5">
        {Array.from({ length: 10 }).map((_, idx) => {
          return <PostItemSkeleton key={`skeleton-${idx}`} />;
        })}
      </div>
    );
  }

  return (
    <section className=" grid md:grid-cols-2 lg:grid-cols-3 w-full  gap-5 md:gap-10 relative">
      {flatPageDatas?.length === 0 ? (
        <div className="py-5 text-center  col-span-full">
          <ObserverGSAPWrapper>등록된 콘텐츠가 없습니다.</ObserverGSAPWrapper>
        </div>
      ) : (
        data.pages.map((page) =>
          page.list.map((item) => (
            <ObserverGSAPWrapper key={item.post_id}>
              <PostItem {...item} />
            </ObserverGSAPWrapper>
          ))
        )
      )}

      {isFetching && (
        <>
          <LoadingSpinerV2 text="loading ..." />
        </>
      )}

      {/* //InfinityScrollTriger */}
      {hasNextPage && (
        <div
          ref={ref}
          className="w-full h-5  col-span-full absolute bottom-10"
        />
      )}
    </section>
  );
}
