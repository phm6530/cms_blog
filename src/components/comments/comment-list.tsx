"use client";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import CommentItem from "./comment-item";
import { REVALIDATE } from "@/type/constants";
import { CommentItemModel } from "@/lib/comment-bff";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CommentList({ postId }: { postId: string }) {
  // falt할랫더니 다밀려서 성능 이슈있을수있음 이게나음
  // const [list, setList] = useState<Array<Array<CommentItemModel>> | null>(null);
  const [moreView, setMoreView] = useState<boolean>(false);
  /**
   *
   * @description 부모는 오름차순으로, 자식은 내림차순으로 가져오기 ㅇㅇ
   */
  const { data, isLoading } = useInfiniteQuery({
    queryKey: [`${REVALIDATE.COMMENT}:${postId}`],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const limit = 10; //댓글 일단 1개ㅐ씩씩
      const cursor = pageParam !== 0 ? pageParam : null;

      let baseEndpont = `api/comment/${postId}`;
      baseEndpont += `?cursor=${cursor}&limit=${limit}`;

      const response = await withFetchRevaildationAction<{
        success: boolean;
        result: Array<CommentItemModel>;
      }>({
        endPoint: baseEndpont,
        options: {
          cache: "no-store",
          next: {
            tags: [`${REVALIDATE.COMMENT}:${postId}`],
          },
        },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.result;
    },
    getNextPageParam: (lastPage) => {
      console.log(lastPage);
      return null;
    },
    initialPageParam: 0,
  });

  // console.log(data);

  // useEffect(() => {
  //   if (data?.pages) {
  //     setList((prev) => {
  //       const lastPage = data.pages.at(-1)?.result;

  //       if (!lastPage) return prev;

  //       if (prev === null) {
  //         return [lastPage];
  //       } else {
  //         return [lastPage, ...prev];
  //       }
  //     });
  //   }
  // }, [data]);

  if (isLoading || !data) {
    return <section className="mt-5 mb-10">loading....</section>;
  }

  const flatData = data.pages.flatMap((e) => e.result);

  return (
    <section className="mt-5 mb-10">
      <div className="border-b py-4 ">댓글 {flatData.length} 개 </div>
      {flatData.length > 10 && (
        <div
          onClick={() => setMoreView(true)}
          className="text-center text-sm py-3 border cursor-pointer hover:underline"
        >
          이전 댓글 보기 ({flatData.length - 10})
        </div>
      )}
      <div>
        {flatData.length === 0 ? (
          <div className="py-16 text-center ">
            <p className="text-xl">아직 등록된 댓글이 없습니다.</p>
          </div>
        ) : (
          flatData.map((block, idx) => {
            return (
              <CommentItem
                key={`${postId}-${block.id}`}
                {...block}
                deps={0}
                className={cn(
                  idx < flatData.length - 10 ? "hidden" : undefined,
                  moreView && "block"
                )}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
