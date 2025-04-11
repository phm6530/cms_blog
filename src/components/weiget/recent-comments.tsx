import { REVALIDATE } from "@/type/constants";
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
      cache: "no-store",
      next: {
        tags: [REVALIDATE.WEIGET.COMMENT],
      },
    },
  });

  return (
    <div className=" max-h-[50vh] flex flex-col gap-4">
      <p className=" border-b text-sm pb-2">방명록</p>
      <div className="flex flex-col gap-2">
        {response.result?.slice(0, 5)?.map((post, idx) => {
          return (
            <Link
              href={`/guestbook`}
              key={`${idx}-${post.post_id}`}
              className="text-xs flex gap-2 hover:bg-primary/30 underline"
            >
              {/* {DateUtils.isNew(post.createdAt) && <BadgeNew />} */}
              <p className="line-clamp-1">{post.comment}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
