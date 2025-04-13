"use client";

import ConfirmButton from "@/components/shared/confirm-button";
import { Button } from "@/components/ui/button";
import useThrottling from "@/hook/useThrottling";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { HTTP_METHOD } from "@/type/constants";
import withClientFetch from "@/util/withClientFetch";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [isLike, setIsLike] = useState(false);

  const { mutate: likeMutate } = useMutation({
    mutationFn: async () => {
      return await withClientFetch({
        endPoint: `api/post/${postId}/like`,
        requireAuth: true,
      });
    },
    onSuccess: () => {
      toast.success("좋아요 처리되었습니다.");
    },
  });

  // like 처리
  useEffect(() => {
    const like = localStorage.getItem(`like-${postId}`);
    if (like) {
      setIsLike(true);
    }
  }, [postId]);

  // 디바운스 처리
  const { debounce } = useDebounce(() => {
    const key = `like-${postId}`;
    const localLiked = localStorage.getItem(key);

    if ((isLike && localLiked) || (!isLike && !localLiked)) {
      return;
    }

    if (isLike && !localLiked) {
      localStorage.setItem(key, "true");
      alert("true 요청");
    }

    if (!isLike && localLiked) {
      localStorage.removeItem(key);
      alert("false 요청");
    }

    // 둘 다 true or 둘 다 false인 경우 → 무시
  }, 1000);

  useEffect(() => {
    debounce();
  }, [isLike, debounce]);

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
      <Button
        className="cursor-pointer"
        onClick={() => {
          setIsLike(!isLike);
          debounce();
        }}
        variant={"outline"}
      >
        <Heart
          className={cn("size-4 ", isLike ? "fill-red-500" : "fill-none")}
        />
        <span className="text-xs">좋아요</span>
      </Button>
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
