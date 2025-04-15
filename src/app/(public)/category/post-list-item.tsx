import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
import { HighlightKeyword } from "@/util/keyword-highlist";
import BadgeNew from "@/components/shared/badge-new";
import { PostItemModel } from "@/type/post.type";

export default function PostItem({
  post_title,
  post_id,
  post_description,
  sub_group_name,
  thumbnail_url,
  created_at,
  comment_count,
  keyword,
  like_cnt,
}: PostItemModel & { keyword?: string }) {
  return (
    <div className="animate-fadein group cursor-pointer grid grid-cols-[4fr_1fr] gap-5 items-center py-3 border-b  last:border-b-0">
      <div className="flex flex-col gap-2 py-3">
        <div className="flex gap-3 mb-2">
          <Badge variant={"secondary"} className="text-[10px] rounded-full">
            {sub_group_name}
          </Badge>
          <div className="relative inline-flex items-center justify-center">
            {/* 실제 Badge 내용 */}
            {DateUtils.isNew(created_at) && <BadgeNew />}
          </div>
        </div>
        <Link href={`/post/${post_id}`}>
          <p className="group-hover:underline text-xl tracking-tight ">
            {!!keyword ? (
              <HighlightKeyword text={post_title} keyword={keyword} />
            ) : (
              post_title
            )}

            {/* {post_title} */}
          </p>
        </Link>
        <p className="line-clamp-2 text-[13px] text-muted-foreground leading-6 tracking-tight mb-4">
          {post_description}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex gap-3">
          <span className="flex gap-1 items-center">
            <MessageCircle className="size-4" /> {comment_count}
          </span>
          <span className="flex gap-1 items-center">
            <Heart className="size-4" /> {like_cnt}
          </span>

          <span className="border-l-2 pl-3">
            {DateUtils.dateFormatKR(created_at, "YY. MM. DD")}
          </span>
        </p>
      </div>
      <div className="max-w-[150px]  w-full ml-auto  aspect-[16/11]  rounded-md relative overflow-hidden ">
        {thumbnail_url && (
          <Image
            src={`https://d33h8icwcso2tj.cloudfront.net/${thumbnail_url}`}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
    </div>
  );
}
