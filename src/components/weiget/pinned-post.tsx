import { PostItemModel } from "@/app/(public)/____[group]/post-list";
import { REVALIDATE } from "@/type/constants";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

export default async function PinnedPosts() {
  const response = await withFetchRevaildationAction<PostItemModel[]>({
    endPoint: `api/post?category=blog`,
    options: {
      cache: "force-cache",
      next: {
        tags: [`${REVALIDATE.BLOG.LIST}:all`],
      },
    },
  });

  console.log(response);

  return (
    <div>
      <h3>Pinned Post</h3>
      <div className="border w-full p-5 rounded-2xl"></div>
    </div>
  );
}
