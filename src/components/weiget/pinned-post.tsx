import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { Badge } from "../ui/badge";
import { PostItemModel } from "@/type/post.type";
import { Heart, MessageCircle } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function PinnedPosts() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/pinned`,
    options: {
      cache: "no-store",
      next: {
        tags: [REVALIDATE.BLOG.LIST, "pinneds"],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  const data = response.result[2];

  if (!data) {
    return "등록된 고정 콘텐츠가 없습니다.";
  }

  return (
    <div className="flex flex-col gap-1 relative">
      <div
        className="w-full grid grid-cols-[6fr_4fr] border-border gap-10 p-10 bg-[#f9f7f4] dark:bg-[#252526] rounded-xl  flex-col  bg-cover bg-center overflow-hidden relative"
        style={{
          backgroundClip: "padding-box",
        }}
      >
        <div className="flex flex-col  items-start ">
          <div className="flex gap-2 mt-5">
            <Badge
              variant={"outline"}
              className="z-1 rounded-full border-foreground/50"
            >
              {data.sub_group_name}
            </Badge>
            <Badge
              variant={"outline"}
              className="z-1 rounded-full bg-yellow-400 text-black"
            >
              pinned
            </Badge>
          </div>

          <h1 className="text-shadow leading-9 mt-5 z-10 text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] text-2xl w-[60%] break-keep ">
            {data.post_title}
          </h1>
          <p className="text-sm leading-6 z-10 mt-5 line-clamp-2 max-w-[300px] opacity-90 dark:text-[#cccccc]">
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
