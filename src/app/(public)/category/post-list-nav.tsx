import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import getCategories from "@/service/get-category";
import { CategoryModel } from "@/type/blog-group";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function PostListNav({
  curCategory,
  curSubGroup,
}: {
  curCategory: string;
  curSubGroup: string | null;
}) {
  const response = await getCategories();
  if (!response) notFound();

  const { categories } = response;
  const curNavList = categories[curCategory];
  const subCategories: CategoryModel["subGroups"] = [
    {
      id: 0,
      subGroupName: "전체보기",
      thumb: null,
      postCount: curNavList.postCnt,
    },
    ...curNavList.subGroups,
  ];

  return (
    <>
      {/* 모바일 */}
      <Carousel className="md:hidden block" opts={{ dragFree: true }}>
        <CarouselContent className="pl-5">
          {subCategories.map((group, idx) => {
            const href =
              idx === 0
                ? `/category/${curCategory}`
                : `/category/${curCategory}/${group.subGroupName}`;

            const isActive =
              (idx === 0 && !curSubGroup) || curSubGroup === group.subGroupName;

            return (
              <CarouselItem
                key={group.id}
                className={cn(
                  "basis-auto shrink-0 pl-2",
                  idx === subCategories.length - 1 && "mr-4"
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
          {subCategories.map((group, idx) => {
            const href =
              idx === 0
                ? `/category/${curCategory}`
                : `/category/${curCategory}/${group.subGroupName}`;

            const isActive =
              (idx === 0 && !curSubGroup) || curSubGroup === group.subGroupName;

            return (
              <React.Fragment key={group.id}>
                <Link href={href} className={cn(" transition-all")}>
                  <span
                    className={cn(
                      "transition-all text-sm",
                      isActive
                        ? " text-foreground underline "
                        : "text-muted-foreground "
                    )}
                  >
                    {group.subGroupName}
                  </span>
                  <span className="opacity-40 ml-1.5 text-xs">
                    ({group.postCount})
                  </span>
                </Link>
                {idx < subCategories.length - 1 && (
                  <span className="opacity-20">|</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>
    </>
  );
}
