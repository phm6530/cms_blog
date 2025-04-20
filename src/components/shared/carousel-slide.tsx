"use client";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { PostItemModel } from "@/type/post.type";
import { Badge } from "../ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ENV } from "@/type/constants";
import { useRouter } from "next/navigation";

export function CarouselSlide({ postList }: { postList: PostItemModel[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {postList.map((data, index) => (
            <CarouselItem key={index}>
              <div
                className="w-full cursor-pointer grid grid-cols-[6fr_4fr] border-border gap-10 p-10 bg-[#f9f7f4] dark:bg-[#252526] rounded-xl  flex-col  bg-cover bg-center overflow-hidden relative"
                style={{
                  backgroundClip: "padding-box",
                }}
                onClick={() => router.push(`/post/${data.post_id}`)}
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

                  <h1 className="text-shadow  leading-9 mt-5 z-10 text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] text-2xl w-[60%] break-keep ">
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
                  {data.thumbnail_url && (
                    <Image
                      src={`${ENV.IMAGE_URL_PUBLIC}${data.thumbnail_url}`}
                      fill
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="mt-3 flex gap-1 justify-center">
        {Array.from({ length: count }).map((_, idx) => {
          return (
            <div
              key={`nav-${idx}`}
              className={cn(
                " rounded-full bg-muted-foreground/40 cursor-pointer size-2 transition-all",
                idx + 1 === current && "bg-violet-400 h-2 w-5"
              )}
              onClick={() => {
                api?.scrollTo(idx);
              }}
            ></div>
          );
        })}
      </div>
    </>
  );
}
