import { Button } from "@/components/ui/button";
import { BlogGroupModel } from "@/type/blog-group";
import { REVALIDATE_TAGS } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostListNav() {
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

  return (
    <section className=" w-full gap-2 flex flex-wrap">
      {result.map((group) => {
        return group.subGroups.map((e) => {
          return (
            <Button
              variant={"outline"}
              asChild
              key={e.subGroupId}
              className="rounded-full text-xs"
            >
              <Link href={`/blog/${e.subGroupName}`}>{e.subGroupName} (0)</Link>
            </Button>
          );
        });
      })}
    </section>
  );
}
