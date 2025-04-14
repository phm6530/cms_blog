"use client";
import { Button } from "@/components/ui/button";
import CommentForm from "@/components/comments/comment-form";
import useStore from "@/context/store";
import { Reply, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileUser from "@/components/ui/profile-user";
import { useSession } from "next-auth/react";
import ConfirmButton from "@/components/shared/confirm-button";
import withClientFetch from "@/util/withClientFetch";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HTTP_METHOD } from "@/type/constants";
import { useForm } from "react-hook-form";
import InputPassword from "@/components/ui/password-input";
import { CommentItemModel } from "@/lib/comment-bff";

export default function GuestBookItem({
  id: commentId,
  comment,
  children,
  deps,
  created_at,
  parent_id,
  author,
}: CommentItemModel & { deps: number }) {
  const { passwordFomView, setPasswordFormId, commentsViewId, toggleFormView } =
    useStore(); // Zustand로 공유
  const session = useSession();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (data?: { password?: string }) => {
      return await withClientFetch({
        endPoint: `api/guestboard/${commentId}`,
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

  const isReply = deps > 0;

  return (
    <article
      className={cn(
        "flex gap-2 justify-start flex-1  animate-wiggle border-muted-foreground/40  hover:border-primary",
        deps === 0 &&
          "mb-2 py-5 p-5 shadow-lg border dark:border-foreground/20 border-border/50 bg-background   rounded-xl ",
        deps === 1 && "border-t border-border/80 hover:border-border/80 pt-4"
      )}
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
        <div className="pl-0">
          <div
            className={cn(
              "text-sm  leading-6 text-secondary-foreground whitespace-pre-wrap text-ellipsis border-input font-pretendard "
            )}
          >
            {comment}
          </div>
          <div className="flex gap-2 items-center text-xs [&>span:cursor-pointer]">
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
            targetSchema="guestbook"
            parent_id={isReply ? parent_id : commentId}
          />
        )}
        {deps < 1 &&
          children.map((e, idx) => {
            return (
              <GuestBookItem
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
