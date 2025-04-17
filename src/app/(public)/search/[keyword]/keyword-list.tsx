import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import PostItem from "../../category/post-list-item";
import { REVALIDATE } from "@/type/constants";
import { PostItemModel } from "@/type/post.type";
type SearchResult = [...PostItemModel[], number];

export default async function KeywordList({ keyword }: { keyword: string }) {
  const response = await withFetchRevaildationAction<SearchResult>({
    endPoint: `api/post?group=all&keyword=${keyword}`,
    options: {
      cache: "no-store",
      next: {
        tags: [REVALIDATE.POST.LIST],
      },
    },
  });
  const arr = response.result!;
  const last = arr?.pop();

  return (
    <>
      <div className="border-b pb-5 text-xl flex gap-3 items-center">
        {decodeURIComponent(keyword)}
        <span className="text-primary dark:text-indigo-400">
          ( {typeof last === "number" ? last : 0} )
        </span>
      </div>
      {(arr as PostItemModel[]).map((item, idx) => {
        return <PostItem {...item} key={idx} keyword={keyword} />;
      })}
    </>
  );
}
