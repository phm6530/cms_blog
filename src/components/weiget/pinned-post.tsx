import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { PostItemModel } from "@/type/post.type";
import { Heart, MessageCircle, Pin } from "lucide-react";
import { DateUtils } from "@/util/date-uill";

function PinnedSubPosts(data: PostItemModel) {
  return (
    <>
      <div className="w-full border p-7 rounded-xl grid grid-cols-2 gap-4 bg-cover bg-center overflow-hidden relative">
        <div className="relative w-full rounded-xl   overflow-hidden">
          <Image
            src={`${process.env.IMAGE_URL}/${data.thumbnail_url}`}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Badge variant={"outline"} className="z-1">
            {data.sub_group_name}
          </Badge>
          <h1 className="z-10 text-base break-keep">{data.post_title}</h1>
          <p className="text-xs leading-5 z-10  line-clamp-2 max-w-[600px]">
            {data.post_description}
          </p>
        </div>
      </div>
    </>
  );
}

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

  const data = response.result![1];
  // console.log(`${process.env.IMAGE_URL}/${data.thumbnail_url}`);

  return (
    <div className="flex flex-col gap-4 relative">
      <div className=" items-center gap-2 flex">
        <Pin size={17} />
        <h3>Pinned Post </h3>
      </div>

      <div
        className="w-full  p-7 pt-24 rounded-xl flex flex-col gap-4 bg-cover bg-center overflow-hidden relative"
        style={{
          backgroundImage: `url(${process.env.IMAGE_URL}/${data.thumbnail_url})`,
        }}
      >
        <div
          className="w-full h-full  absolute bottom-0 left-0 z-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, black 80% , black 100%)",
          }}
        />
        <Badge variant={"outline"} className="z-1 text-white rounded-full">
          {data.sub_group_name}
        </Badge>
        <h1 className="text-white z-10 text-2xl">{data.post_title}</h1>
        <p className="text-xs leading-5 z-10 text-white line-clamp-2 max-w-[600px]">
          {data.post_description}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex gap-3 z-1">
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

      <div className="flex flex-col gap-5">
        <div className=" items-center gap-2 flex">
          <Pin size={17} />
          <h3>Pinned Post </h3>
        </div>
        <div className="flex gap-5">
          {response.result?.slice(2, 4).map((e) => {
            return <PinnedSubPosts {...e} key={e.post_id} />;
          })}
        </div>
      </div>
    </div>
  );
}
