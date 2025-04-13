"use client";

import ConfirmButton from "@/components/shared/confirm-button";
import { Button } from "@/components/ui/button";
import useThrottling from "@/hook/useThrottling";
import { HTTP_METHOD } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation } from "@tanstack/react-query";
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
    onSuccess: () => {
      toast.success("삭제되었습니다.", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      router.replace(`/category/${category}`);
    },
  });
  const { throttle } = useThrottling();

  const onDeleteHandler = async () => {
    throttle(async () => mutate(), 1000);
  };

  return (
    <div className="flex gap-2">
      {session.data?.user && (
        <>
          <ConfirmButton title={"삭제하시겠습니까?"} cb={onDeleteHandler}>
            <Button className="cursor-pointer" variant={"outline"}>
              삭제
            </Button>
          </ConfirmButton>

          <Button asChild className="cursor-pointer" variant={"outline"}>
            <Link href={`/write?mode=edit&postId=${postId}`}>수정</Link>
          </Button>
        </>
      )}
    </div>
  );
}
