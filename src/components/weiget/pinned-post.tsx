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

  return (
    <div className=" gap-1 relative w-full  grid grid-cols-[1fr_2fr] mt-20">
      <div className="  gap-2 flex flex-col pb-2 ">
        <Pin size={14} />
        <h3 className="text-3xl">PINNED POST </h3>
        <p>고정콘텐츠 입니다.</p>
      </div>
      {!data || data.length === 0 ? (
        "등록된 고정 콘텐츠가 없습니다."
      ) : (
        <CarouselSlide postList={response.result} />
      )}
    </div>
  );
}
