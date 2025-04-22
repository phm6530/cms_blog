import { REVALIDATE } from "@/type/constants";

import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { PostItemModel } from "@/type/post.type";
import { cn } from "@/lib/utils";
import PostItem from "@/app/(public)/category/post-list-item";

export default async function RecentPost() {
  const { success, result } = await withFetchRevaildationAction<{
    list: PostItemModel[];
    isNextPage: boolean;
  }>({
    endPoint: `api/post?category=all&group=all`,
    options: {
      cache: "force-cache",
      next: {
        tags: [REVALIDATE.POST.LIST, "all"],
      },
    },
  });

  if (!success) {
    throw new Error("에러...");
  }

  const firstObj = result.list;

  return (
    <div className=" flex flex-col  md:w-full">
      <div className=" items-center gap-2 flex border-b pb-2 ">
        <h3>최신 글</h3>
      </div>

      <div
        className={cn(
          "flex flex-col",
          firstObj.length !== 0 && "divide-y border-border"
        )}
      >
        {firstObj.length === 0 ? (
          <div>등록된 콘텐츠가 없습니다.</div>
        ) : (
          firstObj.slice(0, 4)?.map((item, idx) => {
            return <PostItem {...item} key={`${item?.post_id}-${idx}`} />;
          })
        )}
      </div>
    </div>
  );
}
