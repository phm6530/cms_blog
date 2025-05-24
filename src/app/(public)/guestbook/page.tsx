"use client";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import GuestBookItem from "./components/guestbook-item";
import { CommentItemModel } from "@/lib/comment-bff";
import CommentForm from "@/components/comments/comment-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import LoadingSpinerV2 from "@/components/ui/loading-spinner-v2";

export default function GuestBookPage() {
  const ref = useRef<HTMLDivElement>(null);

  const { data, isFetching, isPending, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [REVALIDATE.GUEST_BOARD.GETBOARD],
      queryFn: async ({ pageParam }) => {
        let endPoint = "api/guestboard";
        const curCursor = pageParam === 0 ? undefined : pageParam;
        if (curCursor) {
          endPoint += `?cursor=${curCursor}`;
        }

        const response = await withFetchRevaildationAction<{
          list: CommentItemModel[];
          isNextPage: boolean;
        }>({
          endPoint,
          options: {
            next: {
              tags: [REVALIDATE.GUEST_BOARD.GETBOARD],
            },
            cache: "force-cache",
          },
        });

        if (!response.success) {
          throw new Error(response.message);
        }

        return response.result;
      },
      getNextPageParam: (lastPage) => {
        console.log(lastPage);
        if (lastPage.isNextPage) {
          return lastPage.list.at(-1)?.id;
        }
      },
      initialPageParam: 0,
    });

  useEffect(() => {
    if (!ref.current) return;

    const currentRef = ref.current;

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    };

    const io = new IntersectionObserver(callback, { threshold: 0.1 });
    io.observe(currentRef);

    return () => {
      io.unobserve(currentRef);
      io.disconnect();
    };
  }, [data, fetchNextPage]);

  const result = data?.pages.flatMap((e) => e.list) ?? [];

  return (
    <div className="max-w-[800px] mx-auto pt-[50px] pb-10">
      <span className="text-2xl md:text-3xl  font-SUIT-Regular flex items-center gap-5">
        GUEST BOOK
      </span>
      <p className="pt-3 text-xs flex items-center gap-2 opacity-70 ">
        방문 감사합니다 !
      </p>
      <section className="my-6">
        <CommentForm targetSchema="guestbook" />
      </section>

      {isPending && (
        <section className="flex flex-col gap-5">
          {[1, 2, 3, 4, 5, 6, 7].map((_, idx) => (
            <React.Fragment key={`skeleton:${idx}`}>
              <div data-testid="loading" className="mt-5 flex flex-col gap-3">
                <div className="flex gap-5 items-center">
                  <div className="size-10 bg-foreground/10 rounded-full animate-pulse" />
                  <div className="h-4 bg-foreground/10 w-[100px] rounded-full animate-pulse" />
                  <div className="h-4 bg-foreground/10 w-[50px] rounded-full animate-pulse" />
                </div>
                <div className="h-4 bg-foreground/10 w-2/3 rounded-full animate-pulse" />
                <div className="h-4 bg-foreground/10 w-full rounded-full animate-pulse" />
              </div>
            </React.Fragment>
          ))}
        </section>
      )}

      {result.map((item, idx) => {
        return <GuestBookItem deps={0} {...item} key={idx} />;
      })}
      {isFetching && <LoadingSpinerV2 />}

      {hasNextPage && <div ref={ref} className="w-full h-[50px]"></div>}
    </div>
  );
}
