"use client";
import withClientFetch from "@/util/withClientFetch";
import { useQuery } from "@tanstack/react-query";

export default function VisitorWigetV2() {
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
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex justify-center p-2">
          <div className="size-5 border-2 border-t-transparent border-zinc-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex items-center gap-3 text-lg ">
          <span className="text-sm text-muted-foreground">안녕하세요?</span>
          <span>
            오늘{" "}
            <span className="font-semibold text-red-500 underline">
              {data?.result.today_cnt ?? 0}
            </span>{" "}
            번째 방문자시네요!
          </span>
        </div>
      )}
    </div>
  );
}
