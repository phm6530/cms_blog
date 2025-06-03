"use client";
import { Button } from "../ui/button";
import CommentForm from "./comment-form";
import useStore from "@/context/store";
import { ChevronUp, Reply, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileUser from "../ui/profile-user";
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

export default function CommentItem({
  id: commentId,
  comment,
  children,
  deps,
  created_at,
  parent_id,
  author,
  post_id,
  className,
}: CommentItemModel & { deps: number; className?: string }) {
  const { passwordFomView, setPasswordFormId, commentsViewId, toggleFormView } =
    useStore(); // Zustand로 공유
  const ref = useRef<HTMLInputElement>(null);
  const [lineClimp, setLineClimp] = useState<boolean>(false);
  const queryClient = useQueryClient();

  console.log(author);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const oneLineHight = 34;
    const height = el.scrollHeight;
    if (height >= oneLineHight * 3) {
      setLineClimp(true);
    }
  }, [ref]);

  const session = useSession();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (data?: { password?: string }) => {
      return await withClientFetch({
        endPoint: `api/comment/${post_id}?item=${commentId}`,
        options: {
          method: HTTP_METHOD.DELETE,
        },
        body:
          author.role === "guest" && data?.password
            ? { password: data.password }
            : {},
      });
    },
    onSuccess: () => {
      toast.success("삭제 되었습니다", {
        style: {
          background: "#1e293b",
          color: "#38bdf8",
        },
      });
      queryClient.invalidateQueries({
        queryKey: [`${REVALIDATE.COMMENT}:${post_id}`],
      });
      router.refresh();
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: { password: "" } });

  const onDeleteHnadler = (data: { password: string }) => {
    mutate(data);
  };

  const isReply = (deps > 0) as any;

  return (
    <article
      className={cn(
        "flex gap-2 justify-start  animate-wiggle",
        deps === 0 && "mb-2 border-b last:border-b-0 py-5 ",
        className
      )}
      style={{ marginLeft: `${!!isReply ? 20 : 0}px` }}
    >
      {!!isReply && <Reply size={13} className="rotate-180 opacity-60 mt-2" />}
      <div className="flex flex-col gap-2  w-full">
        <ProfileUser
          profileImg={
            author.role === "admin" || author.role === "super"
              ? author.profile_img
              : null
          }
          nickname={author.nickname}
          role={author.role}
          createAt={created_at}
        />
        <div className="pl-0 py-2">
          <div
            ref={ref}
            className={cn(
              "text-sm  text-secondary-foreground whitespace-pre-wrap border-input border-l pl-3 font-pretendard leading-6",
              lineClimp && "line-clamp-3"
            )}
          >
            {comment}
          </div>{" "}
          {lineClimp && (
            <div
              className="text-xs p-1 mt-3 items-center flex gap-1 cursor-pointer text-violet-400"
              onClick={() => setLineClimp(false)}
            >
              <ChevronUp size={13} />
              내용 펼치기
            </div>
          )}
          <div className="flex gap-2 pt-4 items-center text-xs [&>span:cursor-pointer]">
            <Button
              className=" cursor-pointer text-xs p-0 text-muted-foreground"
              variant={"link"}
              onClick={() => toggleFormView(commentId)} // 해당 댓글에 대한 폼을 토글
            >
              댓글쓰기
            </Button>

            {/* Admin이랑 동일하면 */}
            {(() => {
              // admin이면서 자기 댓글인 경우
              if (
                (author.role === "admin" || author.role === "super") &&
                author.admin_email === session.data?.user?.email
              ) {
                return (
                  <ConfirmButton
                    title="댓글을 삭제하시겠습니까?"
                    cb={() => mutate({})}
                  >
                    <Button
                      className="cursor-pointer animate-wiggle text-xs p-0 text-muted-foreground"
                      variant={"link"}
                    >
                      삭제
                    </Button>
                  </ConfirmButton>
                );
              }

              // guest인 경우, guest_id 비교
              if (author.role === "guest") {
                return (
                  <>
                    <Button
                      className="cursor-pointer animate-wiggle text-xs p-0 text-muted-foreground"
                      variant={"link"}
                      onClick={() => setPasswordFormId(commentId)}
                    >
                      {passwordFomView === commentId ? <X /> : "삭제"}
                    </Button>

                    {passwordFomView === commentId && (
                      <form
                        className="flex gap-2"
                        onSubmit={handleSubmit(onDeleteHnadler)}
                      >
                        <div className=" flex flex-col">
                          <InputPassword
                            {...register("password", {
                              required: { value: true, message: "required" },
                            })}
                            className="py-1 placeholder:text-xs"
                            placeholder="비밀번호"
                            aria-invalid={!!errors.password}
                          />
                        </div>

                        <Button
                          variant={"outline"}
                          className="cursor-pointer text-xs"
                        >
                          확인
                        </Button>
                      </form>
                    )}
                  </>
                );
              }

              return null;
            })()}
          </div>
        </div>
        {commentsViewId === commentId && (
          <CommentForm
            postId={post_id + ""}
            parent_id={isReply ? parent_id : commentId}
          />
        )}
        {deps < 1 &&
          children.map((e, idx) => {
            return (
              <CommentItem
                key={idx}
                {...e}
                parent_id={commentId}
                deps={deps + 1}
              />
            );
          })}
      </div>
    </article>
  );
}
