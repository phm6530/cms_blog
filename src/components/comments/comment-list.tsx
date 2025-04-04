import { CommentItemModel } from "@/app/api/comment/route";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { notFound } from "next/navigation";
import CommentItem from "./comment-item";
import { REVALIDATE_TAGS } from "@/type/constants";

export default async function CommentList({ postId }: { postId: string }) {
  const response = await withFetchRevaildationAction<CommentItemModel[]>({
    endPoint: `api/comment?postId=${postId}`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE_TAGS.COMMENT, postId],
      },
    },
  });

  if (!response.success) {
    notFound();
  }

  return (
    <article>
      {response.result.map((comment) => {
        return (
          <CommentItem key={`${postId}-${comment.id}`} {...comment} deps={0} />
        );
      })}
    </article>
  );
}
