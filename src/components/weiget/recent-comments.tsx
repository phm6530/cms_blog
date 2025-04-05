import { PostItemModel } from "@/app/(public)/blog/[group]/post-list";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import Link from "next/link";

export default async function RecentComment() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/blog?group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.BLOG.LIST, "all"],
      },
    },
  });

  return (
    <div className=" max-h-[50vh] flex flex-col gap-4">
      <p className=" border-b text-xs pb-2">최신 댓글</p>
      <div className="flex flex-col gap-2">
        {response.result?.slice(0, 5)?.map((post, idx) => {
          return (
            <Link
              href={`/blog/${post.sub_group_name}/${post.post_id}`}
              key={`${idx}-${post.post_id}`}
              className="flex flex-col items-center gap-2"
            >
              <p className="line-clamp-1 text-sm">{post.post_title}</p>
              <p className="text-xs line-clamp-2 opacity-45">
                {post.post_description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
