import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { PinnedPostModel } from "@/type/post.type";
import { notFound } from "next/navigation";
import { CarouselSlide } from "../shared/carousel-slide";
import { Pin } from "lucide-react";

export default async function PinnedPosts() {
  const response = await withFetchRevaildationAction<Array<PinnedPostModel>>({
    endPoint: `api/pinned`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.PINNED_POST],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  const data = response.result;

  if (!data) {
    return "등록된 고정 콘텐츠가 없습니다.";
  }

  return (
    <div className="flex flex-col gap-1 relative w-full">
      <div className=" items-center gap-2 flex  pb-2 ">
        <Pin size={14} />
        <h3>Pinned Posts </h3>
      </div>

      <CarouselSlide postList={response.result} />
    </div>
  );
}
