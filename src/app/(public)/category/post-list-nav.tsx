"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CategoryModel } from "@/type/blog-group";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import React from "react";

type OmitThumb = Omit<CategoryModel["subGroups"], "thumb">;

export default function PostListNav({
  subGroups,
  categoryProps,
}: {
  subGroups: OmitThumb;
  categoryProps: Omit<CategoryModel, "subGroups">;
}) {
  const [groupSegment] = useSelectedLayoutSegments();

  const navArr: Array<Omit<OmitThumb[number], "thumb">> = [
    {
      id: categoryProps.id,
      subGroupName: "전체보기",
      postCount: categoryProps.postCnt,
      thumb: null,
    },
    ...subGroups,
  ];

  return (
    <>
      {/* 모바일 */}
      <Carousel className="md:hidden block pt-10" opts={{ dragFree: true }}>
        <CarouselContent className="pl-4 pr-4">
          {navArr.map((group, idx) => {
            const href =
              idx === 0
                ? `/category/${categoryProps.name}`
                : `/category/${categoryProps.name}/${group.subGroupName}`;

            const isActive =
              (idx === 0 && groupSegment === undefined) ||
              group.subGroupName === decodeURIComponent(groupSegment ?? "");

            return (
              <CarouselItem
                key={`${group.id}:${idx}`}
                className={cn(
                  "basis-auto shrink-0",
                  idx === 0 ? "pl-1" : "pl-2"
                )}
              >
                <Link
                  href={href}
                  className={cn(
                    "border px-4 py-3 rounded-full flex gap-1 whitespace-nowrap",
                    isActive && "bg-foreground text-background"
                  )}
                >
                  <span className="text-xs">{group.subGroupName}</span>
                  <span className="opacity-50 text-xs">
                    ({group.postCount})
                  </span>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* 데스크탑 */}
      <section className="w-full  mt-8 hidden md:block">
        {/* 서브 카테고리 목록 */}

        <div className="flex items-center gap-6 flex-wrap border-b py-4 pt-6">
          {navArr.map((group, idx) => {
            const href =
              idx === 0
                ? `/category/${categoryProps.name}`
                : `/category/${categoryProps.name}/${group.subGroupName}`;

            const isActive =
              (idx === 0 && groupSegment === undefined) ||
              group.subGroupName === decodeURIComponent(groupSegment ?? "");

            return (
              <React.Fragment key={`${group.id}:${idx}`}>
                <Link
                  href={href}
                  className={cn(
                    "transition-all text-sm hover:text-foreground",
                    isActive
                      ? " text-foreground underline "
                      : "text-muted-foreground "
                  )}
                >
                  <span>{group.subGroupName}</span>
                  <span className="opacity-40 ml-1.5 text-xs">
                    ({group.postCount})
                  </span>
                </Link>
                {/* {idx < subCategories.length - 1 && (
                  <span className="opacity-20">|</span>
                )} */}
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </>
  );
}
