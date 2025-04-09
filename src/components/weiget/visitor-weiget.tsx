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
      <div className="flex flex-col items-end gap-3  rounded-3xl">
        <span className="text-xs opacity-50">전체 방문자</span>

        {isLoading ? (
          <div className="flex items-center justify-center h-16">
            <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin "></div>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-end">
              <h3 className="text-3xl tracking-tighter font-Poppins">
                <span className="animate-wiggle">
                  {data?.result.allVisitor_cnt}
                </span>
              </h3>
            </div>
            <span className="text-xs opacity-50">
              Today {data?.result.today_cnt ?? 0}
            </span>
          </>
        )}
      </div>
    </>
  );
}
