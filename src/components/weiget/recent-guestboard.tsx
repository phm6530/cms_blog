import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";

type WeigetComemnt = {
  post_id: number;
  comment: string;
  created_at: string;
};

export default async function RecentGuestBoard() {
  const response = await withFetchRevaildationAction<WeigetComemnt[]>({
    endPoint: `api/weiget/comment?target=guest`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.WEIGET.COMMENT],
      },
    },
  });

  return (
    <div className="  flex flex-col gap-4 ">
      <p className=" border-b  pb-2 border-foreground/20 text-xs">방명록</p>
      <div className="flex flex-col gap-2">
        {response.result?.length === 0 && (
          <span className="text-xs">등록된 방명록이 없습니다.</span>
        )}

        {response.result?.slice(0, 5)?.map((post, idx) => {
          return (
            <Link
              href={`/guestbook`}
              key={`${idx}-${post.post_id}`}
              className="text-[13px] grid grid-cols-[auto_1fr] gap-3 hover:underline items-start"
            >
              <p className=" leading-5 mt-[0px] text-xs">
                {DateUtils.dateFormatKR(post.created_at, "YY. MM. DD.")}
              </p>
              <p className="line-clamp-2 leading-5 text-xs">{post.comment}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
