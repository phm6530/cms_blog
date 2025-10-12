import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DateUtils } from "@/util/date-uill";
import { HighlightKeyword } from "@/util/keyword-highlist";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { unsplashS3Mapping } from "@/util/unsplash-s3-mapping";
import PostStats from "@/components/post-stats";
import { InitialReturnData } from "./[category]/_components/page";

export const PostItem = forwardRef<
  HTMLDivElement,
  InitialReturnData[number] & { keyword?: string; className?: string }
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
            " border-l-indigo-500 grid group cursor-pointer   gap-5 items-center",

            thumbnail_url &&
              "grid-cols-[minmax(120px,2fr)_minmax(0,5fr)] md:grid-cols-1  group ",
            className
          )}
        >
          {thumbnail_url && (
            <div className="w-full relative overflow-hidden rounded-xl group md:aspect-[16/10] aspect-[1/1]">
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

              {/* 베지들 - 모바일에서는 숨김 */}
              <div className="absolute top-3 left-3 z-10 hidden md:block">
                <Badge
                  variant={"secondary"}
                  className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                >
                  {sub_group_name}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 py-3 ">
            <div className="group-hover:underline text-base md:text-base tracking-tight">
              {!!keyword ? (
                <HighlightKeyword text={post_title} keyword={keyword} />
              ) : (
                <>
                  {post_title}{" "}
                  {DateUtils.isNew(created_at) && (
                    <div className=" right-2  md:right-3 z-10 inline-block  ">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-red-400 to-red-500  text-white text-[7px] text-center md:text-[8px]   size-3   rounded shadow-md">
                          N
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="line-clamp-2 text-sm  text-muted-foreground leading-5 tracking-tight md:mb-4 break-words">
              {post_description}
            </p>
            <div className="text-xs text-muted-foreground mt-3 flex gap-3 ">
              <PostStats comment_cnt={comment_count} like_cnt={like_cnt ?? 0} />

              <span className=" text-xs ml-auto">
                {DateUtils.dateFormatKR(created_at, "YY. MM. DD")}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
);

PostItem.displayName = "PostItem";
export default PostItem;
