"use client";

import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import withClientFetch from "@/util/withClientFetch";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 *
 * @param param0
 * @returns
 */
export default function PostLikeHandler({
  postId,
  likeCnt,
}: {
  postId: number;
  likeCnt: number;
}) {
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(likeCnt);
  const prevIsLike = useRef(false);
  const key = `like-${postId}`;

  // like 처리
  useEffect(() => {
    const like = localStorage.getItem(`like-${postId}`);
    if (like) {
      setIsLike(true);
      prevIsLike.current = true;
    }
  }, [postId]);

  const { mutate: likeMutate } = useMutation({
    mutationFn: async () => {
      const optimisticLike = !isLike;
      return await withClientFetch({
        endPoint: `api/post/${postId}/like?action=${
          optimisticLike ? "unlike" : "like"
        }`,
        // requireAuth: true,
      });
    },
    onError: () => {
      if (!!prevIsLike.current) {
        // 이전데이터가 true였으면 다시 복구
        localStorage.setItem(key, "true");
        setIsLike(true);
      } else {
        localStorage.removeItem(key);
        setIsLike(false);
      }
      setIsLike(prevIsLike.current);
      toast.error("LIKE 처리 실패");
    },
  });

  // 디바운스 처리
  const { debounce } = useDebounce((next: boolean) => {
    const localLiked = localStorage.getItem(key);

    if (next && !localLiked) {
      localStorage.setItem(key, "true");
      likeMutate();
    } else if (!next && localLiked) {
      localStorage.removeItem(key);
      likeMutate();
    }
  }, 1000);

  return (
    <div className="text-center">
      <Button
        className="cursor-pointer rounded-full bg-transparent! "
        onClick={() => {
          /**
           * opTimistic으로
           */
          const optimisticLike = !isLike;
          setLikeCount((prev) => prev + (optimisticLike ? 1 : -1));
          setIsLike(optimisticLike);
          debounce(optimisticLike);
        }}
        variant={"outline"}
      >
        <Heart
          className={cn(
            "size-4 text-foreground/20! ",
            isLike ? "fill-red-500" : "fill-none"
          )}
        />
        <span className="text-xs opacity-70">{likeCount}</span>
      </Button>
    </div>
  );
}
