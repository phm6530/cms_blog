"use client";

import ConfirmButton from "@/components/shared/confirm-button";
import { Button } from "@/components/ui/button";
import useThrottling from "@/hook/useThrottling";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PostHandler({
  postId,
  category,
}: {
  postId: string;
  category: string;
}) {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
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
      queryClient.removeQueries({
        queryKey: [REVALIDATE.POST.LIST],
        exact: false,
      });

      router.replace(`/category/${category}`);
    },
  });

  const { throttle } = useThrottling();

  const onDeleteHandler = async () => {
    throttle(async () => mutate(), 1000);
  };

  return (
    <div className="flex gap-2 mt-3.5 border-b pb-5 mb-5">
      {session.data?.user && (
        <>
          <ConfirmButton title={"삭제하시겠습니까?"} cb={onDeleteHandler}>
            <Button className="text-xs cursor-pointer" variant={"outline"}>
              삭제
            </Button>
          </ConfirmButton>

          <Button
            asChild
            className="text-xs cursor-pointer"
            variant={"outline"}
          >
            <Link href={`/write?mode=edit&postId=${postId}`}>수정</Link>
          </Button>
        </>
      )}
    </div>
  );
}
