import { PinnedPostModel } from "@/type/post.type";
import { notFound } from "next/navigation";
import { CarouselSlide } from "../shared/carousel-slide";
import { Pin } from "lucide-react";
import getPinnedPosts from "@/service/pinned-post";

export default async function PinnedPosts() {
  const response = await getPinnedPosts<Array<PinnedPostModel>>();

  if (!response) {
    notFound();
  }
  const data = response;

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
        <CarouselSlide postList={response} />
      )}
    </div>
  );
}
