import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PostItemModel } from "@/type/post.type";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
import { Badge } from "../ui/badge";

export function RecentPostSlider({ postList }: { postList: PostItemModel[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {postList.map((data, idx) => (
          <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="w-full flex flex-col border bg-cover bg-center overflow-hidden relative rounded-lg h-full">
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={`${process.env.IMAGE_URL}/${data.thumbnail_url}`}
                  alt={data.post_title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="flex flex-col gap-4 p-5 flex-grow">
                <div className="flex gap-2 items-center">
                  {DateUtils.isNew(data.created_at) && (
                    <Badge
                      variant={"outline"}
                      className="text-[10px] rounded-full border-rose-400 text-rose-400"
                    >
                      New
                    </Badge>
                  )}
                  <Badge
                    variant={"secondary"}
                    className="text-[10px] rounded-full"
                  >
                    {data.sub_group_name}
                  </Badge>
                </div>

                <h1 className="text-base break-keep">{data.post_title}</h1>
                <p className="text-xs text-muted-foreground leading-5 line-clamp-2">
                  {data.post_description}
                </p>

                <p className="text-xs text-muted-foreground mt-auto flex gap-3">
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
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
