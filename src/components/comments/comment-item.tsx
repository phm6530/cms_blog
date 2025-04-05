"use client";
import { CommentItemModel } from "@/app/api/comment/route";
import { Button } from "../ui/button";
import CommentForm from "./comment-form";
import useStore from "@/context/store";
import { Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateUtils } from "@/util/date-uill";
import Image from "next/image";

export default function CommentItem({
  id: commentId,
  comment,
  children,
  deps,
  created_at,
  author,
}: CommentItemModel & { deps: number }) {
  const { commentsViewId, toggleFormView } = useStore(); // Zustand 상태 사용

  return (
    <div
      className={cn(
        "flex gap-2 justify-start",
        deps === 0 && "mb-2 border-b py-3"
        // deps === 1 && "border-l-2 pl-3"
      )}
      style={{ marginLeft: `${deps > 0 ? 20 : 0}px` }}
    >
      {deps > 0 && <Reply size={13} className="rotate-180 opacity-40 mt-2" />}
      <div className="flex flex-col gap-2 items-start">
        <div className="flex gap-3 items-center">
          <div className="size-10 border-3 border-border rounded-full flex justify-center items-center relative overflow-hidden">
            {/* <PersonStanding /> */}
            <Image
              src={"/img/my-dog.jpg"}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm flex items-center gap-3">
              <span className="font-semibold ">{author.nickname}</span>
              <span className="text-xs opacity-40">
                {DateUtils.fromNow(created_at)}
              </span>
            </p>
            <div className="rounded-xl text-sm  text-secondary-foreground">
              {comment}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center text-xs [&>span:cursor-pointer]">
          <Button
            className="cursor-pointer text-xs p-0 text-muted-foreground"
            variant={"link"}
            onClick={() => toggleFormView(commentId)} // 해당 댓글에 대한 폼을 토글
          >
            댓글쓰기
          </Button>
          <Button
            className="cursor-pointer text-xs p-0 text-muted-foreground"
            variant={"link"}
            onClick={() => toggleFormView(commentId)} // 해당 댓글에 대한 폼을 토글
          >
            삭제
          </Button>
        </div>
        {commentsViewId === commentId && <CommentForm parent_id={commentId} />}

        {children.map((e, idx) => {
          return <CommentItem key={idx} {...e} deps={deps + 1} />;
        })}
      </div>
    </div>
  );
}
