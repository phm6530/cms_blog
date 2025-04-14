import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";

type WeigetComemnt = {
  post_id: number;
  comment: string;
  createdAt: string;
};

export default async function RecentGuestBoard() {
  const response = await withFetchRevaildationAction<WeigetComemnt[]>({
    endPoint: `api/weiget/comment?target=guest`,
    options: {
      cache: "no-store",
      next: {
        tags: [REVALIDATE.WEIGET.COMMENT],
      },
    },
  });

  return (
    <div className=" max-h-[50vh] flex flex-col gap-4 mt-6">
      <p className=" border-b text-sm pb-2 border-foreground/20">방명록</p>
      <div className="flex flex-col gap-2">
        {response.result?.slice(0, 5)?.map((post, idx) => {
          return (
            <Link
              href={`/guestbook`}
              key={`${idx}-${post.post_id}`}
              className="text-[13px] grid grid-cols-[auto_1fr] gap-3 hover:underline items-start"
            >
              <p className=" leading-5 mt-[0px] ">
                {DateUtils.dateFormatKR(post.createdAt, "YY. MM. DD.")}
              </p>
              <p className="line-clamp-2 leading-5">{post.comment}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
