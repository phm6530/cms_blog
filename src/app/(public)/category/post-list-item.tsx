import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { DateUtils } from "@/util/date-uill";
import { HighlightKeyword } from "@/util/keyword-highlist";
import BadgeNew from "@/components/shared/badge-new";
import { PostItemModel } from "@/type/post.type";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";

export const PostItem = forwardRef<
  HTMLDivElement,
  PostItemModel & { keyword?: string; className?: string }
>(
  (
    {
      post_title,
      post_id,
      post_description,
      sub_group_name,
      thumbnail_url,
      created_at,
      comment_count,
      keyword,
      like_cnt,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "transition-all  border-l-indigo-500 animate-wiggle group grid-cols-1 cursor-pointer grid  gap-5 items-center py-3 border-b  last:border-b-0",
          thumbnail_url && "grid-cols-[5fr_minmax(100px,_2fr)]",
          className
        )}
      >
        <div className="flex flex-col gap-2 py-1 md:py-3!">
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
            <p className="group-hover:underline [text-shadow:_0px_0px_1px_rgba(0,0,0,1)] text-base md:text-xl! tracking-tight">
              {!!keyword ? (
                <HighlightKeyword text={post_title} keyword={keyword} />
              ) : (
                post_title
              )}
            </p>
          </Link>
          <p className="line-clamp-2 text-xs md:text-[13px]! text-muted-foreground leading-5 tracking-tight md:mb-4 break-words">
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
        {thumbnail_url && (
          <div className="max-w-[150px] w-full ml-auto  aspect-[1/1] md:aspect-[16/11]  rounded-xl relative overflow-hidden ">
            <Image
              src={`${unsplashS3Mapping(thumbnail_url)}`}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
    );
  }
);

PostItem.displayName = "PostItem";
export default PostItem;
