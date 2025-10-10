import { Heart, MessageSquareMore } from "lucide-react";

export default function PostStats({
  comment_cnt,
  like_cnt,
}: {
  comment_cnt: number;
  like_cnt: number;
}) {
  return (
    <div className="flex gap-3 text-muted-foreground">
      <span className="flex gap-1 items-center text-xs">
        <MessageSquareMore className="size-4" /> {comment_cnt}
      </span>
      <span className="flex gap-1 items-center text-xs">
        <Heart className="size-4" /> {like_cnt}
      </span>
    </div>
  );
}
