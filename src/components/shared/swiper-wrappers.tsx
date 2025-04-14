"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { PostItemModel } from "@/type/post.type";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
export default function SwiperWrapper({
  postList,
}: {
  postList: PostItemModel[];
}) {
  return (
    <div>
      <Swiper
        spaceBetween={15}
        slidesPerView={3}
        // navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        loop
      >
        {postList.map((data, idx) => {
          return (
            <SwiperSlide
              key={idx}
              className="w-full flex flex-col border bg-cover bg-center overflow-hidden relative rounded-lg"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden ">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.thumbnail_url}`}
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col gap-4 p-5">
                <h1 className="z-10 text-base break-keep">{data.post_title}</h1>
                <p className="text-xs text-muted-foreground leading-5 z-10  line-clamp-2 max-w-[600px]">
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
