import { REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

import { PostItemModel } from "@/type/post.type";
import { Heart, MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function RecentPost() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/post?group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, "all"],
      },
    },
  });

  return (
    <div className=" flex flex-col gap-4">
      <div className=" items-center gap-2 flex ">
        <h3 className="font-bold">POSTS </h3>
      </div>

      <div className="border-y flex flex-col border-border divide-y">
        {response.result?.slice(0, 4)?.map((data, idx) => {
          return (
            <Link
              href={`/post/${data.post_id}`}
              key={idx}
              className={cn(
                "w-full  grid grid-cols-[3fr_6fr] gap-10   transition-all    bg-center  py-5 overflow-hidden relative border-muted-foreground/30 group hover:border-purple-500 ",
                !data.thumbnail_url && "grid-cols-1"
              )}
            >
              {data.thumbnail_url && (
                <div className="relative   overflow-hidden  mr-0 rounded-lg aspect-[16/9]">
                  <Image
                    src={`${process.env.IMAGE_URL}/${data.thumbnail_url}`}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
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
                <h1 className="z-10 text-base break-keep mt-1 text-shadow ">
                  {data.post_title}
                </h1>
                <p className="text-[13px] text-muted-foreground   leading-5 z-10  line-clamp-2 max-w-[600px]">
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
        })}
      </div>
    </div>
  );
}
