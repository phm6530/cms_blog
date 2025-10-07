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

  React.useLayoutEffect(() => {
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
      >
        <CarouselContent>
          {postList.map((data, index) => (
            <CarouselItem
              key={index}
              className="w-[50px]  md:basis-1/3 overflow-hidden"
            >
              <div
                className="aspect-[16/11] bg-cover "
                style={{
                  backgroundClip: "padding-box",
                  backgroundImage: `url(${unsplashS3Mapping(
                    data.thumbnail_url
                  )})`,
                }}
                onClick={() => router.push(`/post/${data.post_id}`)}
              ></div>{" "}
              <div className="flex flex-col  items-start  z-10 mt-auto  ">
                <div className="flex gap-2 mt-5">
                  <Badge
                    variant={"outline"}
                    className="z-1 rounded-full  md:text-xs! text-[10px]"
                  >
                    {data.sub_group_name}
                  </Badge>
                  {/* <Badge
                    variant={"outline"}
                    className="z-1 rounded-full bg-yellow-400 text-black md:text-xs! text-[10px]"
                  >
                    pinned
                  </Badge> */}
                </div>

                <h1 className="text-shadow md:w-[80%]   leading-relaxed  mt-3 md:mt-5 z-10  text-2xl md:text-lg  break-keep whitespace-pre-line font-bold">
                  {data.post_title}
                </h1>
                <p className="text-sm w-[70%] md:block md:text-xs leading-relaxed z-10  md:mt-5 mt-2 line-clamp-2 md:line-clamp-2! max-w-[400px] opacity-90 dark:text-[#cccccc]">
                  {data.post_description}
                </p>

                <div className="text-xs  flex gap-3 z-1 opacity-60 mt-auto">
                  <span className="border-l text-xs border-border/30  mt-5 text-white">
                    {DateUtils.dateFormatKR(data.created_at, "YY. MM. DD")}
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-17px] md:flex hidden  bg-background! border-transparent! hover:border-border!" />
        <CarouselNext className="right-[-22px] md:flex hidden bg-background! border-transparent! hover:border-border!" />
      </Carousel>
      <div className="mt-3 flex gap-1 justify-center h-3">
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
