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
      <div className="flex items-center gap-3  rounded-3xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-8">
            <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin "></div>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-end text-xs ">
              <span className="opacity-50">TODAY</span>
              <span className="animate-wiggle">
                {data?.result.today_cnt ?? 0}
              </span>
            </div>
            <div className="flex gap-3 items-end text-xs">
              <span className=" opacity-50">TOTAL</span>
              <span className="animate-wiggle">
                {data?.result.allVisitor_cnt}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
