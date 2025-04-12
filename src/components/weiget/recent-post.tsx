import { PostItemModel } from "@/app/(public)/blog/[group]/post-list";
import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import BadgeNew from "../shared/badge-new";
import Image from "next/image";

export default async function RecentPost() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/blog?group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, "all"],
      },
    },
  });

  return (
    <div className=" max-h-[50vh] flex flex-col gap-4">
      <p className=" border-b text-sm pb-2">최신 글</p>
      <div className="flex flex-col gap-3">
        {response.result?.slice(0, 3)?.map((post, idx) => {
          return (
            <Link
              href={`/post/${post.post_id}`}
              className="grid grid-cols-[1fr_auto] gap-2 hover:underline"
              key={idx}
            >
              <div className="flex flex-col gap-2 w-full">
                <p className="line-clamp-2 text-xs max-w-[150px] leading-5">
                  {post.post_title}
                </p>
                <span className="text-xs opacity-50">
                  {DateUtils.dateFormatKR(post.created_at, "YYYY. MM. DD")}
                </span>
              </div>{" "}
              <div className="relative size-13 overflow-hidden rounded-[4px]">
                {post.thumbnail_url && (
                  <Image
                    src={`${process.env.IMAGE_URL}/${post.thumbnail_url}`}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
