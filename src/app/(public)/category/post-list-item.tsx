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
      <Link href={`/post/${post_id}`}>
        <div
          ref={ref}
          className={cn(
            " border-l-indigo-500 flex animate-wiggle group cursor-pointer  flex-col  gap-5 ",

            thumbnail_url &&
              "grid-cols-[minmax(0,5fr)_minmax(100px,2fr)] group",
            className
          )}
        >
          {thumbnail_url && (
            <div className="w-full relative overflow-hidden rounded-xl group aspect-[16/10]">
              <div className="w-full h-full ml-auto absolute inset-0  transition-all group-hover:scale-110">
                <div className="absolute inset-0 z-1 bg-gradient-to-b from-zinc-950/0 to-zinc-50/20 opacity-0 group-hover:opacity-100 transition-all"></div>
                <Image
                  src={`${unsplashS3Mapping(thumbnail_url)}`}
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 py-1 ">
            <div className="flex gap-3 mb-2">
              <Badge variant={"secondary"} className="text-[10px] rounded-full">
                {sub_group_name}
              </Badge>
              <div className="relative inline-flex items-center justify-center">
                {/* 실제 Badge 내용 */}
                {DateUtils.isNew(created_at) && <BadgeNew />}
              </div>
            </div>

            <p className="group-hover:underline text-base md:text-base tracking-tight">
              {!!keyword ? (
                <HighlightKeyword text={post_title} keyword={keyword} />
              ) : (
                post_title
              )}
            </p>

            <p className="line-clamp-2 text-sm  text-muted-foreground leading-5 tracking-tight md:mb-4 break-words">
              {post_description}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex gap-3 ">
              <span className="flex gap-1 items-center text-xs">
                <MessageCircle className="size-4" /> {comment_count}
              </span>
              <span className="flex gap-1 items-center text-xs">
                <Heart className="size-4" /> {like_cnt}
              </span>

              <span className="border-l-2 pl-3 text-xs">
                {DateUtils.dateFormatKR(created_at, "YY. MM. DD")}
              </span>
            </p>
          </div>
        </div>
      </Link>
    );
  }
);

PostItem.displayName = "PostItem";
export default PostItem;
