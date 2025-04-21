"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientCaraousel({
  curCategory,
  selectGroup,
}: {
  curCategory: string;
  selectGroup?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const queryclient = useQueryClient();
  const category = queryclient.getQueryData<{ [key: string]: CategoryModel }>([
    REVALIDATE.POST.CATEGORY,
  ]);

  useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  if (!category) return;

  const curNavList = category[curCategory];
  const activeStyle = (subGroupName?: string) => {
    const isActive = selectGroup === subGroupName || selectGroup === undefined;

    return cn(
      "rounded-full text-xs border bg-transparent border-foreground dark:border dark:text-indigo-100",
      isActive
        ? "text-primary dark:text-indigo-300 border-muted-foreground dark:border-indigo-400!"
        : "border border-border"
    );
  };

  return (
    <>
      <Carousel
        opts={{
          dragFree: true,
        }}
      >
        <CarouselContent className="pl-5 md:pl-0 md:flex md:flex-wrap md:gap-2">
          <CarouselItem className="basis-auto shrink-0">
            <Button variant={"outline"} asChild className={activeStyle("all")}>
              <Link href={`/category/${curCategory}`}>
                전체보기{" "}
                <span className="dark:text-indigo-300 dark:opacity-100 opacity-50">
                  ({curNavList.postCnt})
                </span>
              </Link>
            </Button>
          </CarouselItem>

          {curNavList.subGroups.map((group, idx) => (
            <CarouselItem
              className={cn(
                "basis-auto shrink-0 pl-2!",
                idx === curNavList.subGroups.length - 1 && "mr-4"
              )}
              key={group.id}
            >
              <Button
                variant={"outline"}
                asChild
                className={activeStyle(group.subGroupName)}
              >
                <Link href={`/category/${curCategory}/${group.subGroupName}`}>
                  {group.subGroupName}{" "}
                  <span className="dark:text-indigo-300 dark:opacity-100 opacity-50">
                    ({group.postCount})
                  </span>
                </Link>
              </Button>
            </CarouselItem>
          ))}

          <CarouselItem className="basis-auto shrink-0 w-4" />
        </CarouselContent>
      </Carousel>
    </>
  );
}
