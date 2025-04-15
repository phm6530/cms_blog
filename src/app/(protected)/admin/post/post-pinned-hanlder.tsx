"use client";
import { Button } from "@/components/ui/button";
import useThrottling from "@/hook/useThrottling";
import { cn } from "@/lib/utils";
import { HTTP_METHOD } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation } from "@tanstack/react-query";

export default function PostPinnedHandler({
  post_id,
  view,
}: {
  post_id: number;
  view: boolean;
}) {
  const { throttle } = useThrottling();

  const { mutate } = useMutation({
    mutationFn: async (post_id: number) => {
      return await withClientFetch({
        endPoint: "api/admin/post/pinned",
        options: {
          method: HTTP_METHOD.POST,
        },
        requireAuth: true,
        body: { post_id },
      });
    },
  });

  return (
    <>
      <Button
        variant={"outline"}
        className={cn(
          "text-xs opacity-50",
          view ? "opacity-100" : "bg-transparent!"
        )}
        onClick={() => throttle(async () => mutate(post_id), 1500)}
      >
        고정
      </Button>
    </>
  );
}
