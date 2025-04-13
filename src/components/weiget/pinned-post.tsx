import { PostItemModel } from "@/app/(public)/____[group]/post-list";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { Badge } from "../ui/badge";
import Image from "next/image";

function PinnedSubPosts(data: any) {
  return (
    <div className="w-full  rounded-xl flex gap-4 bg-cover bg-center overflow-hidden relative">
      <div className="relative w-full rounded-xl  overflow-hidden">
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
  );
}

export default async function PinnedPosts() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/post?category=blog`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST],
      },
    },
  });

  const data = response.result![3];
  const data2 = response.result![2];
  const data3 = response.result![9];
  // console.log(`${process.env.IMAGE_URL}/${data.thumbnail_url}`);

  return (
    <div className="flex flex-col gap-9 relative">
      <div className="flex items-center gap-5">
        <h3>Pinned Post</h3>
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
        <Badge variant={"outline"} className="z-1">
          {data.sub_group_name}
        </Badge>
        <h1 className="text-white z-10 text-2xl">{data.post_title}</h1>
        <p className="text-xs leading-5 z-10 text-white line-clamp-2 max-w-[600px]">
          {data.post_description}
        </p>
      </div>
      <div className="flex gap-10">
        {response.result?.slice(4, 6).map((e) => {
          return <PinnedSubPosts {...e} key={e.post_id} />;
        })}
      </div>
    </div>
  );
}
