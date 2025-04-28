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
    <section className="relative">
      <Carousel
        opts={{
          loop: true,

          containScroll: "trimSnaps",
        }}
        setApi={setApi}
        className={cn(
          "md:static!  top-0 md:w-full   w-[calc(100%+40px)]  left-0 ",
          postList.length > 1 && "-translate-x-5 pl-5 md:pl-0 md:-translate-x-0"
        )}
      >
        <CarouselContent
          className={cn(
            "nimate-wiggle md:mr-0 mr-20",
            postList.length <= 1 && "mr-0"
          )}
        >
          {postList.map((data, index) => (
            <CarouselItem
              key={index}
              className="w-[50px] basis-1/1 md:basis-1/1 overflow-hidden"
            >
              <div
                className={cn(
                  `w-full md:aspect-[16/7]  aspect-[16/17]  cursor-pointer grid border-border p-6 md:p-10  rounded-xl  flex-col bg-center bg-cover  relative
                  after:absolute after:inset-0 after:animate-opacity after:bg-cover after:bg-center after:bg-no-repeat after:content-['']
                 after:bg-gradient-to-b md:after:bg-gradient-to-l after:from-white/30 after:via-black/30 after:to-black/80 md:after:to-via-black/20 after:z-1 after:rounded-xl!
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
                <div className="flex flex-col  items-start  z-10 mt-auto  ">
                  <div className="flex gap-2 mt-5">
                    <Badge
                      variant={"outline"}
                      className="z-1 rounded-full border-white/30 text-white md:text-xs! text-[10px]"
                    >
                      {data.sub_group_name}
                    </Badge>
                    <Badge
                      variant={"outline"}
                      className="z-1 rounded-full bg-yellow-400 text-black md:text-xs! text-[10px]"
                    >
                      pinned
                    </Badge>
                  </div>

                  <h1
                    className="text-shadow md:w-[80%] text-white md:leading-9 leading-9  mt-3 md:mt-5 z-10 text-shadow-[0_35px_35px_rgb(0_0_0_/_0.25)] w-[80%] text-2xl md:text-2xl  break-keep "
                    style={{ textShadow: "1px 1px 3px black" }}
                  >
                    {data.post_title}
                  </h1>
                  <p className="text-sm w-[70%] md:block md:text-sm!  leading-6 z-10 text-white md:mt-5 mt-2 line-clamp-2 md:line-clamp-2! max-w-[400px] opacity-90 dark:text-[#cccccc]">
                    {data.post_description}
                  </p>

                  <div className="text-xs  flex gap-3 z-1 opacity-60 mt-auto">
                    <span className="border-l text-xs border-border/30  mt-5 text-white">
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
        <CarouselPrevious className="left-[-15px] md:flex hidden" />
        <CarouselNext className="right-[-15px] md:flex hidden" />
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
    </section>
  );
}
