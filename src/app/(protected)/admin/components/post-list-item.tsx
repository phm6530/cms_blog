"use client";
import { AdminPostItemModel } from "@/type/post.type";
import PostViewHandler from "../post/post-view-handler";
import { Badge } from "@/components/ui/badge";
import { DateUtils } from "@/util/date-uill";
import Link from "next/link";
import PostPinnedHandler from "../post/post-pinned-hanlder";
import { useState } from "react";

export default function PostListItem({
  post_id,
  post_title,
  view,
  sub_group_name,
  created_at,
  pin,
}: AdminPostItemModel) {
  const [isPending, setPending] = useState<boolean>(false);

  const setPendingHandler = (e: boolean) => {
    setPending(e);
  };

  console.log(isPending);

  return (
    <article className="flex p-4 hover:border-indigo-400 items-center justify-between">
      <div className="text-sm flex flex-col gap-1">
        <Link href={`/post/${post_id}`} className="hover:underline">
          <p> {post_title}</p>
        </Link>
        <div className="flex gap-2 items-center">
          <Badge variant={"secondary"}>{sub_group_name}</Badge>

          <span className="text-xs opacity-50">
            {DateUtils.dateFormatKR(created_at, "YYYY. MM. DD")}
          </span>
        </div>
      </div>
      <div className="wrapper flex gap-2">
        <PostPinnedHandler
          pin_id={pin.pin_id}
          post_id={post_id}
          view={view}
          is_pinned={pin.is_pinned}
          isPending={isPending}
        />
        <PostViewHandler
          defaultView={view}
          postId={post_id}
          pinId={pin.pin_id}
          setPendingHandler={setPendingHandler}
        />
      </div>
    </article>
  );
}
