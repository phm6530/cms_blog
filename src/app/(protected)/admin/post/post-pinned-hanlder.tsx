"use client";
import { Button } from "@/components/ui/button";
import LoadingSpinerV2 from "@/components/ui/loading-spinner-v2";
import useThrottling from "@/hook/useThrottling";
import { cn } from "@/lib/utils";
import { HTTP_METHOD, POST_STATUS, REVALIDATE } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PostPinnedHandler({
  pin_id,
  post_id,
  status,
  isPending: viewPending,
  is_pinned,
}: {
  pin_id: number | null;
  post_id: number;
  status: POST_STATUS;
  isPending: boolean;
  is_pinned: boolean;
}) {
  const { throttle } = useThrottling();

  //옵티미스틱 용으로
  const [opVal, setOpval] = useState(is_pinned);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    { post_id: number; toggleType: "on" | "off"; pin_id?: number }, // Input
    Error, // Error 타입
    { post_id: number; toggleType: "on" | "off"; pin_id?: number } // Variables 타입
  >({
    mutationFn: async ({ post_id, toggleType, pin_id }) => {
      let baseUrl = `api/admin/post/pinned`;

      const body = toggleType === "off" ? { pin_id } : { post_id };

      if (toggleType === "off") {
        if (!pin_id) {
          throw new Error("잘못된 요청입니다.");
        }
        baseUrl += `/${pin_id}`;
      }

      return await withClientFetch({
        endPoint: baseUrl,
        options: {
          method: toggleType === "on" ? HTTP_METHOD.POST : HTTP_METHOD.DELETE,
        },
        requireAuth: true,
        body,
      });
    },
    onSuccess: () => {
      toast.success(!opVal ? "설정 되었습니다." : "해제 되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      setOpval((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: [REVALIDATE.POST.LIST],
      });
    },
  });

  useEffect(() => {
    setOpval(is_pinned);
  }, [is_pinned]);

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isPending || viewPending}
        className={cn(
          "text-xs opacity-50 min-w-[100px] justify-between",
          status === POST_STATUS.PUBLISHED
            ? "opacity-100"
            : "bg-transparent! cursor-no-drop",
          opVal && "border-indigo-400!"
        )}
        onClick={() =>
          throttle(async () => {
            if (status === POST_STATUS.PRIVATE) return;
            mutate({
              pin_id: pin_id ?? undefined,
              post_id,
              toggleType: opVal ? "off" : "on",
            });
          }, 1500)
        }
      >
        <Pin className={cn(opVal ? "text-indigo-400!" : "opacity-20")} />
        {isPending ? <LoadingSpinerV2 /> : opVal ? "고정 해제" : "고정"}
      </Button>
    </>
  );
}
