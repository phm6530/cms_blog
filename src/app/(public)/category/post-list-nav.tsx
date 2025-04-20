import { Button } from "@/components/ui/button";
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
      "rounded-full text-xs border bg-transparent border-foreground dark:border dark:text-indigo-100",
      isActive
        ? "text-primary dark:text-indigo-300 border-muted-foreground dark:border-indigo-400!"
        : "border border-border"
    );
  };

  return (
    <>
      <section className="w-full gap-3 flex flex-wrap mb-6 ">
        <Button variant={"outline"} asChild className={activeStyle("all")}>
          <Link href={`/category/${curCategory}`}>
            전체보기{" "}
            <span className="dark:text-indigo-300 dark:opacity-100 opacity-50">
              ({curNavList.postCnt})
            </span>
          </Link>
        </Button>

        {curNavList.subGroups.map((group) => {
          return (
            <Button
              variant={"outline"}
              asChild
              key={group.id}
              className={activeStyle(group.subGroupName)}
            >
              <Link href={`/category/${curCategory}/${group.subGroupName}`}>
                {group.subGroupName}{" "}
                <span className="dark:text-indigo-300 dark:opacity-100 opacity-50">
                  ({group.postCount})
                </span>
              </Link>
            </Button>
          );
        })}
      </section>
    </>
  );
}
