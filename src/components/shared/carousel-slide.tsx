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
import { DateUtils } from "@/util/date-uill";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";

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
          // dragFree: true,
        }}
        setApi={setApi}
      >
        <CarouselContent className="animate-wiggle md:mr-0 mr-10 translate-x-4.5">
          {postList.map((data, index) => (
            <CarouselItem key={index} className="w-[50px] basis-1/1 ">
              <div
                className={cn(
                  `w-full cursor-pointer grid border-border gap-10 p-10  rounded-xl  flex-col bg-left bg-cover overflow-hidden relative
                  after:absolute after:inset-0 after:animate-opacity after:bg-cover  after:bg-center after:bg-no-repeat after:content-['']
                 after:bg-gradient-to-bl from:via-black/10 after:to-black/70 after:z-1
                  `
                )}
                style={{
                  backgroundClip: "padding-box",
                  backgroundImage: `url(${unsplashS3Mapping(
                    data.thumbnail_url
                  )})`,
                }}
                onClick={() => router.push(`/post/${data.post_id}`)}
              >
                <div className="flex flex-col  items-start pt-20 z-10">
                  <div className="flex gap-2 mt-5">
                    <Badge
                      variant={"outline"}
                      className="z-1 rounded-full border-white/30 text-white"
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

                  <h1
                    className="text-shadow md:w-[80%] text-white leading-9 mt-5 z-10 text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] text-2xl  break-keep "
                    style={{ textShadow: "1px 1px 3px black" }}
                  >
                    {data.post_title}
                  </h1>
                  <p className="text-sm leading-6 z-10 text-white mt-5 line-clamp-2 max-w-[300px] opacity-90 dark:text-[#cccccc]">
                    {data.post_description}
                  </p>

                  <div className="text-xs  flex gap-3 z-1 opacity-60 mt-auto">
                    {/* <span className="flex gap-1 items-center">
                      <MessageCircle className="size-4" /> {data.comment_count}
                    </span>
                    <span className="flex gap-1 items-center">
                      <Heart className="size-4" /> {data.like_cnt}
                    </span> */}

                    <span className="border-l border-border/30  mt-5 text-white">
                      {DateUtils.dateFormatKR(data.created_at, "YY. MM. DD")}
                    </span>
                  </div>
                </div>

                {/* <div className=" rounded-xl relative overflow-hidden aspect-[16/10] md:aspect-[16/17]">
                  {data.thumbnail_url && (
                    <Image
                      src={`${unsplashS3Mapping(data.thumbnail_url)}`}
                      fill
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div> */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-15px]" />
        <CarouselNext className="right-[-15px]" />
      </Carousel>
      <div className="mt-3 flex gap-1 justify-center">
        {Array.from({ length: count }).map((_, idx) => {
          return (
            <div
              key={`nav-${idx}`}
              className={cn(
                " rounded-full bg-muted-foreground/40 cursor-pointer size-2 transition-all",
                idx + 1 === current && " h-2 w-5 bg-muted-foreground/80"
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
