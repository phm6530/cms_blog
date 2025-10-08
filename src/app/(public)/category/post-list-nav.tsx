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

export default async function PostListNav({
  curCategory,
  curSubGroup, // 추가
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
        <CarouselContent className="pl-5 md:pl-0 md:flex md:flex-wrap">
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
                  "basis-auto shrink-0 pl-2!",
                  idx === subCategories.length - 1 && "mr-4"
                )}
              >
                <Link
                  href={href}
                  className={cn(
                    "border px-4 py-3 rounded-full flex gap-1",
                    isActive && "bg-red-50"
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
          <CarouselItem className="basis-auto shrink-0 w-4" />
        </CarouselContent>
      </Carousel>

      {/* 데스크탑 */}
      <section className="w-full gap-2 hidden flex-wrap mb-6 md:flex mt-10">
        {subCategories.map((group, idx) => {
          const href =
            idx === 0
              ? `/category/${curCategory}`
              : `/category/${curCategory}/${group.subGroupName}`;

          const isActive =
            (idx === 0 && !curSubGroup) || curSubGroup === group.subGroupName;

          return (
            <Link
              key={group.id}
              href={href}
              className={cn(
                "border px-4 py-3 rounded-full flex gap-1",
                isActive && " bg-foreground text-muted"
              )}
            >
              <span className="text-xs">{group.subGroupName}</span>
              <span className="opacity-50 text-xs">({group.postCount})</span>
            </Link>
          );
        })}
      </section>
    </>
  );
}
