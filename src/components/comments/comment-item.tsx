"use client";
import { CommentItemModel } from "@/app/api/comment/route";
import { Button } from "../ui/button";
import CommentForm from "./comment-form";
import useStore from "@/context/store";
import { Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ProfileUser from "../ui/profile-user";
import { useSession } from "next-auth/react";

export default function CommentItem({
  id: commentId,
  comment,
  children,
  deps,
  created_at,
  parent_id,
  author,
}: CommentItemModel & { deps: number }) {
  const { commentsViewId, toggleFormView } = useStore(); // Zustand 상태 사용
  const session = useSession();
  console.log(author);
  const isReply = deps > 0;
  return (
    <article
      className={cn(
        "flex gap-2 justify-start  animate-wiggle",
        deps === 0 && "mb-2 border-b py-3 "
      )}
      style={{ marginLeft: `${!!isReply ? 20 : 0}px` }}
    >
      {!!isReply && <Reply size={13} className="rotate-180 opacity-40 mt-2" />}
      <div className="flex flex-col gap-2  w-full">
        <div className="flex gap-3 items-center ">
          <div className="size-10 border-3 border-border rounded-full flex justify-center items-center relative overflow-hidden">
            {/* <PersonStanding /> */}
            <Image
              src={"/img/my-dog.jpg"}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex flex-col">
            <ProfileUser
              nickname={author.nickname}
              role={author.role}
              createAt={created_at}
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm flex items-center gap-3"></p>
            </div>
          </div>
        </div>
        <pre className=" text-sm  text-secondary-foreground border-l-2 border-input pl-3 font-pretendard">
          {comment}
        </pre>
        <div className="flex gap-2 items-center text-xs [&>span:cursor-pointer]">
          <Button
            className="cursor-pointer text-xs p-0 text-muted-foreground"
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
              author.admin_email === session.data?.user.email
            ) {
              return (
                <Button
                  className="cursor-pointer text-xs p-0 text-muted-foreground"
                  variant={"link"}
                >
                  삭제
                </Button>
              );
            }

            // guest인 경우, guest_id 비교
            if (author.role === "guest") {
              return (
                <Button
                  className="cursor-pointer text-xs p-0 text-muted-foreground"
                  variant={"link"}
                >
                  삭제
                </Button>
              );
            }

            return null;
          })()}
        </div>

        {commentsViewId === commentId && (
          <CommentForm parent_id={isReply ? parent_id : commentId} />
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
