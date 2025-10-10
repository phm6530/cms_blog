"use client";

import CommentForm from "./comment-form";
import useStore from "@/context/store";

import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";
import ConfirmButton from "../shared/confirm-button";
import withClientFetch from "@/util/withClientFetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HTTP_METHOD, REVALIDATE } from "@/type/constants";
import { useForm } from "react-hook-form";
import InputPassword from "../ui/password-input";
import { CommentItemModel } from "@/lib/comment-bff";
import { useLayoutEffect, useRef, useState } from "react";
import { DateUtils } from "@/util/date-uill";

export default function CommentItem({
  id: commentId,
  replyIdx,
  comment,
  children,
  deps,
  created_at,
  parent_id,
  author,
  post_id,
  className,
}: CommentItemModel & { deps: number; className?: string; replyIdx?: number }) {
  const { passwordFomView, setPasswordFormId, commentsViewId, toggleFormView } =
    useStore();
  const ref = useRef<HTMLInputElement>(null);
  const [lineClimp, setLineClimp] = useState(false);
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollHeight >= 34 * 3) setLineClimp(true);
  }, []);

  const session = useSession();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (data?: { password?: string }) => {
      return await withClientFetch({
        endPoint: `api/comment/${post_id}?item=${commentId}`,
        options: { method: HTTP_METHOD.DELETE },
        body:
          author.role === "guest" && data?.password
            ? { password: data.password }
            : {},
      });
    },
    onSuccess: () => {
      toast.success("삭제 되었습니다");
      queryClient.invalidateQueries({
        queryKey: [`${REVALIDATE.COMMENT}:${post_id}`],
      });
      router.refresh();
    },
  });

  const { register, handleSubmit } = useForm({
    defaultValues: { password: "" },
  });

  const onDeleteHandler = (data: { password: string }) => mutate(data);
  const isReply = deps > 0;

  return (
    <article
      className={cn(
        "text-sm leading-relaxed",
        deps === 0 && "border-b border-border/30 py-4",
        className
      )}
      style={{ marginLeft: isReply ? 20 : 0 }}
    >
      {/* 작성자 + 시간 */}
      <div className="flex items-center gap-2 text-xs mb-1">
        <span className="font-bold">{author.nickname}</span>
        <span className="text-xs text-muted-foreground ">
          {" "}
          {DateUtils.fromNow(created_at)}
        </span>
      </div>

      {/* 본문 */}
      <div
        ref={ref}
        className={cn(
          "whitespace-pre-wrap break-words text-foreground",
          lineClimp && "line-clamp-3"
        )}
      >
        {comment}
      </div>

      {/* 더보기 */}
      {lineClimp && (
        <button
          onClick={() => setLineClimp(false)}
          className="mt-1 text-xs text-muted-foreground hover:underline"
        >
          더보기
        </button>
      )}

      {/* 액션 */}
      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
        <button
          onClick={() => toggleFormView(commentId)}
          className="hover:underline"
        >
          답글
        </button>

        {author.role === "admin" &&
          author.admin_email === session.data?.user?.email && (
            <ConfirmButton title="삭제하시겠습니까?" cb={() => mutate({})}>
              <button className="hover:underline">삭제</button>
            </ConfirmButton>
          )}

        {author.role === "guest" && (
          <>
            <button
              onClick={() => setPasswordFormId(commentId)}
              className="hover:underline"
            >
              {passwordFomView === commentId ? "취소" : "삭제"}
            </button>

            {passwordFomView === commentId && (
              <form
                onSubmit={handleSubmit(onDeleteHandler)}
                className="flex gap-2 mt-1"
              >
                <InputPassword
                  {...register("password", { required: true })}
                  className="h-6 w-28 text-xs px-2"
                  placeholder="비밀번호"
                />
                <button
                  type="submit"
                  className="px-2 py-1 border rounded text-xs hover:bg-muted"
                >
                  확인
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {/* 답글 작성 */}
      {commentsViewId === commentId && (
        <div className="mt-3">
          <CommentForm
            postId={post_id + ""}
            parent_id={isReply ? parent_id : commentId}
          />
        </div>
      )}

      {/* 대댓글 */}
      {deps < 1 && children.length > 0 && (
        <div className="pl-4 border-l border-border/20 mt-3 space-y-3">
          {children.map((e, idx) => (
            <CommentItem
              key={idx}
              {...e}
              replyIdx={idx}
              parent_id={commentId}
              deps={deps + 1}
            />
          ))}
        </div>
      )}
    </article>
  );
}
