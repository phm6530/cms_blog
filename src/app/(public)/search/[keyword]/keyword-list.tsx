import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import PostItem from "../../blog/[group]/component/post-list-item";
import { PostItemModel } from "../../blog/[group]/post-list";
import { REVALIDATE } from "@/type/constants";
type SearchResult = [...PostItemModel[], number];

export default async function KeywordList({ keyword }: { keyword: string }) {
  const response = await withFetchRevaildationAction<SearchResult>({
    endPoint: `api/blog?group=all&keyword=${keyword}`,
    options: {
      cache: "no-store",
      next: {
        tags: [REVALIDATE.BLOG.LIST],
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
