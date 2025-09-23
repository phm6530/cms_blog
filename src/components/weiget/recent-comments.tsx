import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";

type WeigetComemnt = {
  post_id: number;
  comment: string;
  createdAt: string;
};

export default async function RecentComment() {
  const response = await withFetchRevaildationAction<WeigetComemnt[]>({
    endPoint: `api/weiget/comment`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.WEIGET.COMMENT],
      },
    },
  });

  return (
    <div className=" max-h-[50vh] flex flex-col gap-4 mt-6 ">
      <p className=" border-b border-foreground/20 text-sm pb-2">최근 댓글</p>
      <div className="flex flex-col gap-2">
        {response.result?.length === 0 && <div>등록된 댓글이 없습니다.</div>}

        {response.result?.slice(0, 5)?.map((post, idx) => {
          return (
            <Link
              href={`/post/${post.post_id}`}
              key={`${idx}-${post.post_id}`}
              className="text-[13px] grid grid-cols-[auto_1fr] gap-3  hover:underline items-start"
            >
              <p className=" leading-5 mt-[0px] text-[10px] opacity-50">
                {DateUtils.dateFormatKR(post.createdAt, "YY. MM. DD.")}
              </p>
              <p className="line-clamp-2 leading-5 text-xs">{post.comment}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
