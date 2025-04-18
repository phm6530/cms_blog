"use client";
import withClientFetch from "@/util/withClientFetch";

import { useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";

export default function VisitorWigetV2() {
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
      <div className="flex flex-col  gap-3   border-t pt-5 pb-5">
        {isLoading ? (
          <div className="flex  justify-center h-8">
            <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin "></div>
          </div>
        ) : (
          <>
            <div className="flex  gap-1  text-xs">
              {/* <span className=" opacity-50">TOTAL</span> */}
              <span className="animate-wiggle text-2xl flex items-center gap-2">
                <UserRound size={17} />
                {(data?.result.allVisitor_cnt ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-3 items-end  ">
              <span className="opacity-50 text-[11px]">TODAY</span>
              <span className="animate-wiggle">
                {data?.result.today_cnt ?? 0}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
