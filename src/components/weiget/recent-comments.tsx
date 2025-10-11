import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";

type WidgetComment = {
  post_id: number;
  comment: string;
  createdAt: string;
};

export default async function RecentComment() {
  const { result } = await withFetchRevaildationAction<WidgetComment[]>({
    endPoint: "api/weiget/comment",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.WEIGET.COMMENT],
      },
    },
  });

  const comments = result ?? [];

  return (
    <div className="flex flex-col gap-2 rounded-xl">
      <p className="pb-1 text-xs border-b">최근 댓글</p>
      <div className="flex flex-col gap-1">
        {!comments.length && (
          <p className="text-xs text-muted-foreground">
            등록된 댓글이 없습니다.
          </p>
        )}

        {comments.slice(0, 4).map((post, idx) => (
          <Link
            key={`${post.post_id}:${idx}`}
            href={`/post/${post.post_id}`}
            className="flex items-start justify-between gap-3 text-[13px] group"
          >
            <p className="flex items-center text-xs leading-5 line-clamp-2 group-hover:underline">
              {post.comment}
              {DateUtils.isNew(post.createdAt) && (
                <span className="flex items-center justify-center ml-2 size-2.5 text-[7px] rounded-sm bg-red-400 text-white">
                  N
                </span>
              )}
            </p>
            <p className="text-[10px] leading-5 opacity-50">
              {DateUtils.dateFormatKR(post.createdAt, "YY. MM. DD.")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
