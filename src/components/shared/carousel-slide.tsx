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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";
import { Button } from "../ui/button";

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
              className="flex gap-[3rem]   basis-1/1 overflow-hidden"
            >
              <div
                onClick={() => router.push(`/post/${data.post_id}`)}
                className=" relative  overflow-hidden w-[65%]  after:absolute after:inset-0 after:animate-opacity after:bg-cover  after:bg-center md:rounded-2xl after:bg-no-repeat after:content-['']
        after:bg-gradient-to-b after:from-black-0 after:via-black/0 after:to-black/80  aspect-[16/12]   text-white"
              >
                <div
                  className="absolute  w-full h-full  rounded-2xl bg-center top-0 left-0    "
                  style={{
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    animation: `
            bgScaleInit 5s cubic-bezier(0, 0.75, 0, 0.62) forwards, 
            bgScaleLoop 10s 5s ease  infinite alternate,
            opacity .5s ease-out forwards`,
                    backgroundImage: `url(${unsplashS3Mapping(
                      data.thumbnail_url
                    )})`,
                  }}
                ></div>
                <div
                  className="absolute p-5 bottom-0  z-2 bg-red-50/5 rounded-tr-2xl"
                  style={{
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span className="text-base opacity-45 font-extrabold">
                    0{current}
                  </span>
                </div>
              </div>
              <div className="flex flex-col   z-10  py-10 w-[40%] ">
                <div className="flex gap-2 ">
                  <Badge
                    variant={"secondary"}
                    className="text-[10px] rounded-full"
                  >
                    {data.sub_group_name}
                  </Badge>
                </div>

                <h1 className="text-shadow leading-snug  mt-3 z-10  text-2xl md:text-3xl  break-keep whitespace-pre-line ">
                  {data.post_title}
                </h1>

                <p className="text-sm  line-clamp-3 md:text-sm leading-relaxed z-10 mt-6   opacity-90 text-muted-foreground">
                  {data.post_description}
                </p>

                <div className="text-xs  flex gap-3 z-1  mt-auto">
                  <Button className="text-xs p-5 px-6">Read More</Button>
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
