"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { REVALIDATE } from "@/type/constants";
import { PinnedPostModel } from "@/type/post.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { replaceSortAction } from "./sort-action";
import { toast } from "sonner";
import { actionPinnedPosts } from "./action";

export default function PinnedPage() {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [list, setList] = useState<Array<PinnedPostModel> | null>(null);
  const prevList = useRef<Array<PinnedPostModel> | null>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (
      replaceSortArr: Array<{ pinId: number; newOrder: number }>
    ) => {
      const result = await replaceSortAction(replaceSortArr);
      if (!result.success) {
        throw new Error(result.message);
      }
    },
    onSuccess: () => {
      toast.success("정렬이 변경되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      prevList.current = list; // 이전 버전을 업데이트
      queryClient.invalidateQueries({
        queryKey: [REVALIDATE.POST.PINNED_POST],
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [REVALIDATE.POST.PINNED_POST],
    queryFn: async () => await actionPinnedPosts(),
  });
  console.log("data?", data);

  useEffect(() => {
    if (data) {
      setList(data);
      prevList.current = data;
    }
  }, [data]);

  if (isLoading) {
    return "loading....";
  }

  const onSubmitHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!list) return;
    const replaceArr = list?.map((e, idx) => {
      return {
        pinId: e.id,
        newOrder: idx + 1,
      };
    });

    mutate(replaceArr);
  };

  return (
    <>
      <p className="text-sm text-muted-foreground">드래그 하여 순서 변경</p>
      <p className="text-sm text-muted-foreground">
        고정 콘텐츠는 5개 이상 활성화 불가합니다.
      </p>
      <div className="flex gap-1 items-end justify-end text-right w-full">
        <span
          className={cn(
            "text-3xl",
            data!.length > 5 && "text-destructive",
            data!.length === 5 && "text-indigo-400"
          )}
        >
          {data?.length}
        </span>
        /<span className="opacity-50">5</span>
      </div>

      <section className="animate-wiggle border-t">
        {list?.length === 0 && (
          <div className="text-center py-10">
            등록된 고정 콘텐츠가 없습니다.
          </div>
        )}
        {list?.map((e, pinIdx) => {
          return (
            <div
              key={`pinned:${e.id}`}
              className={cn(
                "border p-5 grid grid-cols-[auto_1fr] hover:outline-1 outline-purple-500",
                pinIdx === dragIdx && "outline-1 outline-purple-500 opacity-50",
                pinIdx === overIdx && "outline-8 outline-purple-500"
              )}
              draggable
              onDragStart={() => setDragIdx(pinIdx)}
              onDragEnd={() => setDragIdx(null)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIdx(pinIdx);
              }}
              onDrop={() => {
                if (
                  dragIdx === null ||
                  overIdx === null ||
                  dragIdx === overIdx ||
                  !list
                )
                  return;

                const updatedList = [...list];
                [updatedList[dragIdx], updatedList[overIdx]] = [
                  updatedList[overIdx],
                  updatedList[dragIdx],
                ];

                setList(updatedList);
                setDragIdx(null);
                setOverIdx(null);
              }}
            >
              <GripVertical className="opacity-50 cursor-grab  hover:opacity-100" />
              <div className="flex  gap-2 justify-between">
                <div className="flex gap-2 flex-col">
                  <h1 className="text-base">{e.post_title}</h1>{" "}
                  <Badge> {e.sub_group_name}</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-10 flex items-end justify-end">
        <Button
          variant={"secondary"}
          disabled={JSON.stringify(prevList.current) === JSON.stringify(list)}
          className={cn("py-7 px-10")}
          onClick={onSubmitHandler}
        >
          저장하기
        </Button>
      </div>
    </>
  );
}
