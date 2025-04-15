import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

import { PostItemModel } from "@/type/post.type";
import { Heart, MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function RecentPost() {
  const { success, result } = await withFetchRevaildationAction<{
    list: PostItemModel[];
    isNextPage: boolean;
  }>({
    endPoint: `api/post?category=all&group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, "all"],
      },
    },
  });
  if (!success) {
    throw new Error("에러...");
  }

  const firstObj = result.list;

  return (
    <div className=" flex flex-col ">
      <div className=" items-center gap-2 flex border-b pb-2 ">
        <h3 className="font-bold">POSTS </h3>
      </div>

      <div
        className={cn(
          "flex flex-col",
          firstObj.length !== 0 && "divide-y border-border"
        )}
      >
        {firstObj.length === 0 ? (
          <div>등록된 콘텐츠가 없습니다.</div>
        ) : (
          firstObj.slice(0, 4)?.map((data, idx) => {
            return (
              <Link
                href={`/post/${data.post_id}`}
                key={idx}
                className={cn(
                  "hover:pl-5 hover:border-l-5 hover:border-l-purple-500 w-full   gap-10   transition-all    bg-center  py-6 overflow-hidden relative border-muted-foreground/30 group  ",
                  !data.thumbnail_url && "grid-cols-1"
                )}
              >
                {/* {data.thumbnail_url && (
                  <div className="relative   overflow-hidden  mr-0 rounded-lg aspect-[16/9]">
                    <Image
                      src={`${process.env.IMAGE_URL}/${data.thumbnail_url}`}
                      alt=""
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )} */}
                <div className="flex flex-col gap-2  flex-1">
                  <div className="flex gap-2">
                    {DateUtils.isNew(data.created_at) && (
                      <Badge
                        variant={"outline"}
                        className="relative text-[10px] rounded-full border-rose-400 text-rose-400 animate-wiggle"
                      >
                        New
                      </Badge>
                    )}
                    <Badge
                      variant={"secondary"}
                      className="text-[10px] rounded-full"
                    >
                      {data.sub_group_name}
                    </Badge>{" "}
                  </div>
                  <h1 className="z-10 text-xl break-keep mt-1 text-shadow group-hover:text-purple-400 transition-all">
                    {data.post_title}
                  </h1>
                  <p className="text-[13px] text-muted-foreground   leading-5 z-10  line-clamp-2 max-w-[600px] w-[70%]">
                    {data.post_description}
                  </p>
                  <p className="text-xs text-muted-foreground  flex gap-4 z-1 mt-5 ">
                    <span className="flex gap-1 items-center">
                      <MessageCircle className="size-4" /> {data.comment_count}
                    </span>
                    <span className="flex gap-1 items-center">
                      <Heart className="size-4" /> {data.like_cnt}
                    </span>

                    <span className="border-l border-border/30 pl-3 ml-auto">
                      {DateUtils.dateFormatKR(data.created_at, "YY. MM. DD")}
                    </span>
                  </p>
                </div>{" "}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
