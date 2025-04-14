import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { Badge } from "../ui/badge";
import { PostItemModel } from "@/type/post.type";
import { Heart, MessageCircle, Pin } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
import Image from "next/image";

export default async function PinnedPosts() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/post?category=blog`,
    options: {
      cache: "no-store",
      next: {
        tags: [REVALIDATE.BLOG.LIST],
      },
    },
  });

  const data = response.result![3];

  return (
    <div className="flex flex-col gap-1 relative">
      <div
        className="w-full grid grid-cols-[6fr_4fr] border-border gap-10 p-10 bg-[#f9f7f4] dark:bg-[#ffffff05] rounded-xl  flex-col  bg-cover bg-center overflow-hidden relative"
        style={{
          backgroundClip: "padding-box",
        }}
      >
        <div className="flex flex-col gap-8 items-start ">
          <div className="flex gap-2">
            <Badge variant={"outline"} className="z-1 rounded-full">
              {data.sub_group_name}
            </Badge>
            <Badge
              variant={"outline"}
              className="z-1 rounded-full bg-purple-500 text-white"
            >
              pinned
            </Badge>
          </div>

          <h1 className="text-shadow leading-9  z-10 text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] text-2xl w-[60%] break-keep ">
            {data.post_title}
          </h1>
          <p className="text-sm leading-6 z-10  line-clamp-2 max-w-[300px] opacity-90">
            {data.post_description}
          </p>

          <div className="text-xs  flex gap-3 z-1 mt-auto  opacity-60">
            <span className="flex gap-1 items-center">
              <MessageCircle className="size-4" /> {data.comment_count}
            </span>
            <span className="flex gap-1 items-center">
              <Heart className="size-4" /> {data.like_cnt}
            </span>

            <span className="border-l border-border/30 pl-3">
              {DateUtils.dateFormatKR(data.created_at, "YY. MM. DD")}
            </span>
          </div>
        </div>

        <div className="rounded-xl relative overflow-hidden aspect-[16/17]">
          <Image
            src={`${process.env.IMAGE_URL}/${data.thumbnail_url}`}
            fill
            alt=""
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
