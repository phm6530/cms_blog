"use client";
import withClientFetch from "@/util/withClientFetch";

import { useQuery } from "@tanstack/react-query";

export default function VisitorWiget() {
  // visitor...
  const { data, isLoading } = useQuery<{
    result: {
      allVisitor_cnt: number;
      today_cnt: number;
    };
  }>({
    queryKey: ["visitor"],
    queryFn: async () => {
      return await withClientFetch({
        endPoint: `api/visitor`,
        requireAuth: true,
      });
    },
    staleTime: 60 * 1000,
  });

  return (
    <>
      <div className="flex items-center gap-3  rounded-3xl p-5 bg-zinc-50/5 mt-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-8">
            <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin "></div>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-end  ">
              <span className="opacity-50 text-xs">오늘 방문자</span>
              <span className="animate-wiggle text-xs">
                {data?.result.today_cnt ?? 0}
              </span>
            </div>
            <div className="flex gap-3 items-end text-xs">
              <span className=" opacity-50 text-xs">TOTAL</span>
              <span className="animate-wiggle text-xs">
                {(data?.result.allVisitor_cnt ?? 0).toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
