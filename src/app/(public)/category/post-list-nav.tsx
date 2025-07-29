import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CategoryModel } from "@/type/blog-group";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostListNav({
  curCategory,
  selectGroup,
}: {
  curCategory: string;
  selectGroup?: string;
}) {
  const response = await withFetchRevaildationAction<{
    category: { [key: string]: CategoryModel };
    count: number;
  }>({
    endPoint: "api/category",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.POST.CATEGORY],
      },
    },
  });

  if (!response.success) {
    notFound();
  }

  const { category } = response.result;
  const curNavList = category[curCategory];
  const activeStyle = (subGroupName?: string) => {
    const isActive = selectGroup === subGroupName || selectGroup === undefined;

    return cn(
      "rounded-full text-xs border border-foreground dark:border border-0! py-3 px-5 ",
      isActive
        ? "text-white  border-muted-foreground bg-foreground text-secondary"
        : "border-0 border-border bg-muted-foreground/10"
    );
  };

  return (
    <>
      <Carousel
        className="md:hidden block"
        opts={{
          dragFree: true,
        }}
      >
        <CarouselContent className="pl-5 md:pl-0 md:flex md:flex-wrap ">
          <CarouselItem className="basis-auto shrink-0">
            <button className={activeStyle("all")}>
              <Link href={`/category/${curCategory}`}>
                전체보기{" "}
                <span className="dark:text-indigo-100  dark:opacity-100 opacity-50 text-[10px]">
                  ({curNavList.postCnt})
                </span>
              </Link>
            </button>
          </CarouselItem>

          {curNavList.subGroups.map((group, idx) => (
            <CarouselItem
              className={cn(
                "basis-auto shrink-0 pl-2!",
                idx === curNavList.subGroups.length - 1 && "mr-4"
              )}
              key={group.id}
            >
              <button className={activeStyle(group.subGroupName)}>
                <Link href={`/category/${curCategory}/${group.subGroupName}`}>
                  {group.subGroupName}{" "}
                  <span className="dark:text-indigo-300 dark:opacity-100 opacity-50 text-xs">
                    ({group.postCount})
                  </span>
                </Link>
              </button>
            </CarouselItem>
          ))}

          <CarouselItem className="basis-auto shrink-0 w-4" />
        </CarouselContent>
      </Carousel>

      <section className="w-full pl-5  gap-3 hidden flex-wrap mb-6 md:flex mt-10">
        <button className={activeStyle("all")}>
          <Link href={`/category/${curCategory}`}>
            전체보기{" "}
            <span className="dark:text-indigo-300 dark:opacity-100 opacity-50 text-xs">
              ({curNavList.postCnt})
            </span>
          </Link>
        </button>

        {curNavList.subGroups.map((group) => {
          return (
            <button key={group.id} className={activeStyle(group.subGroupName)}>
              <Link href={`/category/${curCategory}/${group.subGroupName}`}>
                {group.subGroupName}{" "}
                <span className="dark:text-indigo-300 dark:opacity-100 opacity-50 text-xs">
                  ({group.postCount})
                </span>
              </Link>
            </button>
          );
        })}
      </section>
    </>
  );
}
