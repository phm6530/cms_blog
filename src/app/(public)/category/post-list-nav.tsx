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
        tags: [REVALIDATE.BLOG.GROUPS],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  const { category } = response.result;

  const curNavList = category[curCategory];

  const activeStyle = (subGroupName?: string) => {
    const isActive = selectGroup === subGroupName;
    return cn(
      "rounded-full text-xs border dark:text-indigo-100 bg-zinc-100 border-transparent",
      isActive
        ? "text-primary text-indigo-300 border-red! border-indigo-400!"
        : "border"
    );
  };

  return (
    <>
      {/* <div className="grid grid-cols-[auto_1fr] items-center gap-5  mb-5">
        <span className="text-md font-Poppins font-extrabold">label</span>
        <span className="border-b border-foreground/40 w-[100px]"></span>
      </div> */}
      <section className="w-full gap-3 flex flex-wrap">
        <Button variant={"outline"} asChild className={activeStyle()}>
          <Link href={`/category/${curCategory}`}>
            전체보기 ({curNavList.postCnt})
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
                {group.subGroupName} ({group.postCount})
              </Link>
            </Button>
          );
        })}
      </section>
    </>
  );
}
