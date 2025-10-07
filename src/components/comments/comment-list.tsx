"use client";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import CommentItem from "./comment-item";
import { REVALIDATE } from "@/type/constants";
import { CommentItemModel } from "@/lib/comment-bff";
import { useInfiniteQuery } from "@tanstack/react-query";
export default function CommentList({ postId }: { postId: string }) {
  // falt할랫더니 다밀려서 성능 이슈있을수있음 이게나음
  // const [list, setList] = useState<Array<Array<CommentItemModel>> | null>(null);

  /**
   * @description 부모는 오름차순으로, 자식은 내림차순으로 가져오기 ㅇㅇ
   */

  const { data, isLoading } = useInfiniteQuery({
    queryKey: [`${REVALIDATE.COMMENT}:${postId}`],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const limit = 10;
      const cursor = pageParam !== 0 ? pageParam : null;

      let baseEndpont = `api/comment/${postId}`;
      baseEndpont += `?cursor=${cursor}&limit=${limit}`;

      const response = await withFetchRevaildationAction<{
        success: boolean;
        result: Array<CommentItemModel>;
      }>({
        endPoint: baseEndpont,
        options: {
          cache: "force-cache",
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
      void lastPage;
      return null;
    },
    initialPageParam: 0,
  });

  if (isLoading || !data) {
    return <section className="mt-5 mb-10">loading....</section>;
  }

  const flatData = data.pages.flatMap((e) => e.result);

  return (
    <section className="mt-5 mb-10">
      <div className="border-b py-4 ">댓글 {flatData.length} 개 </div>

      <div>
        {flatData.length === 0 ? (
          <div className="py-30 text-center border-b">
            <p className="text-base md:text-xl">아직 등록된 댓글이 없습니다.</p>
          </div>
        ) : (
          flatData.map((block) => {
            return (
              <CommentItem
                key={`${postId}-${block.id}`}
                {...block}
                deps={0}
                // className={cn(
                //   idx < flatData.length - 10 ? "hidden" : undefined,
                //   moreView && "block"
                // )}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
