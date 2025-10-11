"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BlogMetadata } from "@/type/blog.type";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import { DateUtils } from "@/util/date-uill";
import withClientFetch from "@/util/withClientFetch";
import { withFetchRevaildationAction } from "@/util/withFetchRevaildationAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Timer } from "lucide-react";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { wirtePostSchema } from "./schema";
import { setDefaultValues } from "./defaultvalue-form";
import getPostItem from "@/app/(public)/post/[id]/action/page-service";

export function DraftDialog() {
  const [view, setView] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { reset } = useFormContext<z.infer<typeof wirtePostSchema>>();

  /**---- 수정아닐떄 다가져옴 리스트 가져오기 ---- */
  const { data, isLoading } = useQuery({
    queryKey: ["DRAFT_LIST"],
    queryFn: async () => {
      const response = await withFetchRevaildationAction<Array<BlogMetadata>>({
        endPoint: "api/post/draft",
      });

      if (!response.success) {
        throw new Error(response.message);
      }
      return response.result;
    },
    staleTime: 100000,
  });

  const { mutate } = useMutation({
    mutationFn: async (postId: number) => {
      // Delete
      return await withClientFetch({
        endPoint: `api/post/${postId}`,
        requireAuth: true,
        options: {
          method: HTTP_METHOD.DELETE,
        },
      });
    },
    onSuccess: async () => {
      toast.success("삭제되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });

      //삭제 후 리스트 초기화
      await queryClient.invalidateQueries({
        queryKey: ["DRAFT_LIST"],
      });
    },
  });

  /** --- 단일 ITEM 가져오기 --- */
  const { mutate: getDraftItem } = useMutation({
    mutationFn: async (id: number) => {
      const response = await withFetchRevaildationAction<
        Awaited<ReturnType<typeof getPostItem>>
      >({
        endPoint: `api/post/${id}`,
        options: {
          cache: "force-cache",
          next: {
            tags: [`${REVALIDATE.POST.DETAIL}:${id}`],
          },
        },
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.result;
    },
    onSuccess: (data) => {
      reset(setDefaultValues(data));
      toast.success("임시저장 항목 불러왔습니다.");
    },
  });

  if (isLoading || !data || data?.length === 0) {
    return null;
  }

  return (
    <Dialog open={view} onOpenChange={() => setView(false)}>
      <span
        className="text-indigo-400"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setView(true);
        }}
      >
        ({data?.length ?? 0})
      </span>

      <DialogContent className="sm:max-w-md max-h-screen ">
        <DialogHeader>
          <DialogTitle>임시저장</DialogTitle>
          {<DialogDescription>임시 저장항모입니다.</DialogDescription>}
        </DialogHeader>
        <div className="flex gap-3 p-2 flex-col overflow-y-scroll max-h-[600px]">
          {data.map((e, idx) => {
            return (
              <div
                onClick={(el) => {
                  el.stopPropagation();
                  getDraftItem(e.post_id);
                }}
                className={cn(
                  "p-4 border rounded-sm cursor-pointer hover:bg-muted"
                  // e.post_id === Number(curPostId) &&
                  //   "outline outline-indigo-400"
                )}
                key={`draftpost-${idx}`}
              >
                <h3> {e.post_title}</h3>
                <p className="text-xs">{e.post_description}</p>
                <div className="text-xs opacity-70 flex gap-1 mt-2">
                  <Timer size={14} />
                  <span>저장시간</span>
                  {DateUtils.dateFormatKR(e.created_at, "YYYY. MM. DD")}
                </div>
                <Button
                  onClick={(el) => {
                    el.stopPropagation();
                    mutate(e.post_id);
                  }}
                  className="text-xs mt-4"
                  variant={"outline"}
                >
                  삭제
                </Button>
              </div>
            );
          })}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="ml-auto text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setView(false);
              }}
            >
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
