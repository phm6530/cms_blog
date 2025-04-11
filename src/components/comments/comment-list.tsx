import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import CommentItem from "./comment-item";
import { REVALIDATE } from "@/type/constants";
import { CommentItemModel } from "@/lib/comment-bff";

export default async function CommentList({ postId }: { postId: string }) {
  const response = await withFetchRevaildationAction<CommentItemModel[]>({
    endPoint: `api/comment?postId=${postId}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [`${REVALIDATE.COMMENT}:${postId}`],
      },
    },
  });

  if (!response.success) {
    notFound();
  }

  return (
    <section className="mt-5 mb-10">
      <div className="border-b py-4 ">댓글 {response.result.length} 개 </div>
      <div>
        {response.result.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xl">아직 등록된 댓글이 없습니다.</p>
          </div>
        ) : (
          response.result.map((comment) => {
            return (
              <CommentItem
                key={`${postId}-${comment.id}`}
                {...comment}
                deps={0}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
