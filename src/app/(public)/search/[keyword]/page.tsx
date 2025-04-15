"use client";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";

import { QUERYKEY } from "@/type/constants";
import PostItem from "../../category/post-list-item";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { PostItemModel } from "@/type/post.type";

type SearchResult = [...PostItemModel[], number];

export default function Keyword() {
  const { keyword } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [QUERYKEY.SEARCH, keyword],
    queryFn: async () => {
      const response = await withFetchRevaildationAction<SearchResult>({
        endPoint: `api/blog?group=all&keyword=${decodeURIComponent(
          keyword as string
        )}`,
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response;
    },
    staleTime: 10000,
    gcTime: 30000,
  });

  const arr = [...(data?.result ?? [])];
  const maybeCount = arr.pop();
  const count = typeof maybeCount === "number" ? maybeCount : 0;
  const postItems = arr as PostItemModel[];

  return (
    <>
      <div className="border-b pb-5 text-xl flex gap-3 items-center">
        {decodeURIComponent(keyword as string)}
        {isLoading ? (
          <Skeleton className="size-5" />
        ) : (
          <span className=" dark:text-indigo-400 text-primary">
            ( {count} )
          </span>
        )}
      </div>

      <>
        {isLoading ? (
          <div className="mt-5">검색 중 .....</div>
        ) : (
          <>
            {arr.length === 0 ? (
              <div className="mt-5">검색어가 없습니다.</div>
            ) : (
              <>
                {(postItems as PostItemModel[]).map((item, idx) => {
                  return (
                    <PostItem
                      {...item}
                      key={idx}
                      keyword={decodeURIComponent(keyword as string)}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </>
    </>
  );
}
