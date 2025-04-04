import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BlogGroupModel } from "@/type/blog-group";
import { REVALIDATE_TAGS } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostListNav({
  selectGroup,
}: {
  selectGroup?: string;
}) {
  const response = await withFetchRevaildationAction<BlogGroupModel[]>({
    endPoint: "api/blogGroup",
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE_TAGS.BLOG.GROUPS],
      },
    },
  });

  if (!response.success) {
    notFound();
  }
  const result = response.result;

  const activeStyle = (subGroupName?: string) => {
    const isActive = selectGroup === subGroupName;
    return cn(
      "rounded-full text-xs border",
      isActive ? "text-primary border-primary" : "border-none"
    );
  };

  return (
    <section className=" w-full gap-2 flex flex-wrap">
      <Button variant={"outline"} asChild className={activeStyle()}>
        <Link href={`/blog`}>전체보기 (0)</Link>
      </Button>

      {result.map((group) => {
        return group.subGroups.map((e) => {
          return (
            <Button
              variant={"outline"}
              asChild
              key={e.subGroupId}
              className={activeStyle(e.subGroupName)}
            >
              <Link href={`/blog/${e.subGroupName}`}>{e.subGroupName} (0)</Link>
            </Button>
          );
        });
      })}
    </section>
  );
}
