import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { Badge } from "../ui/badge";
import { PostItemModel } from "@/type/post.type";
import { Heart, MessageCircle, Pin } from "lucide-react";
import { DateUtils } from "@/util/date-uill";

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

  const data = response.result![2];

  return (
    <div className="flex flex-col gap-3 relative">
      <div className=" items-center gap-2 flex">
        <Pin size={17} />
        <h3 className="font-bold">Pinned Post </h3>
      </div>

      <div
        className="w-full border border-border p-7 pt-24  rounded-xl flex flex-col gap-4 bg-cover bg-center overflow-hidden relative"
        style={{
          backgroundImage: `url(${process.env.IMAGE_URL}/${data.thumbnail_url})`,
          backgroundClip: "padding-box",
        }}
      >
        <div
          className="w-full h-full absolute bottom-0 left-0 z-0 opacity-80 backdrop-blur-3xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(90, 100, 110, 0.5), rgba(60, 70, 80, 0.7), rgba(30, 35, 40, 1))",
          }}
        />
        <Badge variant={"outline"} className="z-1 text-white rounded-full">
          {data.sub_group_name}
        </Badge>
        <h1 className="text-white z-10 text-2xl">{data.post_title}</h1>
        <p className="text-xs leading-5 z-10 text-white line-clamp-2 max-w-[600px]">
          {data.post_description}
        </p>
        <p className="text-xs text-white/60 mt-1 flex gap-3 z-1">
          <span className="flex gap-1 items-center">
            <MessageCircle className="size-4" /> {data.comment_count}
          </span>
          <span className="flex gap-1 items-center">
            <Heart className="size-4" /> {data.like_cnt}
          </span>

          <span className="border-l border-border/30 pl-3">
            {DateUtils.dateFormatKR(data.created_at, "YY. MM. DD")}
          </span>
        </p>
      </div>
    </div>
  );
}
