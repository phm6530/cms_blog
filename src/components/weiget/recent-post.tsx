import { PostItemModel } from "@/app/(public)/blog/[group]/post-list";
import { REVALIDATE_TAGS } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default async function RecentPost() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/blog?group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE_TAGS.BLOG.LIST, "all"],
      },
    },
  });

  return (
    <div className=" max-h-[50vh] flex flex-col gap-4">
      <p className=" border-b text-xs pb-2">최신 글</p>
      <div className="flex flex-col gap-4">
        {response.result?.slice(0, 5)?.map((post, idx) => {
          return (
            <Link
              href={`/blog/${post.sub_group_name}/${post.post_id}`}
              key={`${idx}-${post.post_id}`}
              className="flex flex-col gap-2"
            >
              <div className="flex gap-1">
                <Badge variant={"outline"} className="text-xs">
                  {post.sub_group_name}
                </Badge>
                <p className="line-clamp-1 text-sm">{post.post_title}</p>
              </div>
              <p className="text-xs line-clamp-1 opacity-50">
                {post.post_description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
