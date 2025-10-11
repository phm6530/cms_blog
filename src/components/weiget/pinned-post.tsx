import { PinnedPostModel } from "@/type/post.type";
import { notFound } from "next/navigation";
import { CarouselSlide } from "../shared/carousel-slide";
import getPinnedPosts from "@/service/pinned-post";

export default async function PinnedPosts() {
  const response = await getPinnedPosts<Array<PinnedPostModel>>();

  if (!response) {
    notFound();
  }

  const data = response;

  return (
    <>
      <div className=" gap-1 relative w-full  ">
        {!data || data.length === 0 ? (
          "등록된 고정 콘텐츠가 없습니다."
        ) : (
          <CarouselSlide postList={response} />
        )}
      </div>
    </>
  );
}
