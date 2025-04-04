"use client";
import { CommentItemModel } from "@/app/api/comment/route";
import { Button } from "../ui/button";
import CommentForm from "./comment-form";
import useStore from "@/context/store";

export default function CommentItem({
  id: commentId,
  comment,
  children,
  deps,
}: CommentItemModel & { deps: number }) {
  const { commentsViewId, toggleFormView } = useStore(); // Zustand 상태 사용

  return (
    <div className="flex flex-col gap-2" style={{ marginLeft: `${20}px` }}>
      <p>{comment}</p>
      <div className="text-xs [&>span:cursor-pointer]">
        <Button
          className="cursor-pointer text-xs "
          variant={"ghost"}
          onClick={() => toggleFormView(commentId)} // 해당 댓글에 대한 폼을 토글
        >
          댓글쓰기
        </Button>
        <span>삭제</span>
      </div>
      {commentsViewId === commentId && <CommentForm parent_id={commentId} />}

      {children.map((e, idx) => {
        return <CommentItem key={idx} {...e} deps={deps + 1} />;
      })}
    </div>
  );
}
