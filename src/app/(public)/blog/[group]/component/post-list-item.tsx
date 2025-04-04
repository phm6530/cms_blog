import Image from "next/image";
import { PostItemModel } from "../post-list";
import Link from "next/link";
import { ENV } from "@/type/constants";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquareMore } from "lucide-react";
import { DateUtils } from "@/util/date-uill";

export default function PostItem({
  post_title,
  post_id,
  post_description,
  sub_group_name,

  thumbnail_url,
  create_at,
}: PostItemModel) {
  return (
    <div className="group cursor-pointer grid grid-cols-[4fr_1fr] gap-5 items-center py-4 border-b  ">
      <div className="flex flex-col gap-3 py-3">
        <div className="flex gap-2">
          <Badge variant={"secondary"} className="text-xs!">
            {sub_group_name}
          </Badge>
          <div className="relative inline-flex items-center justify-center">
            {/* 뒤에 깔릴 ping 효과 */}
            {/* <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75 animate-caret-blink" /> */}

            {/* 실제 Badge 내용 */}
            {DateUtils.isNew(create_at) && (
              <Badge
                variant={"outline"}
                className="relative text-xs border-rose-400 text-rose-400 animate-wiggle"
              >
                New
              </Badge>
            )}
          </div>
        </div>
        <Link href={`/blog/${sub_group_name}/${post_id}`}>
          <p className="group-hover:text-amber-200 text-2xl tracking-tight">
            {post_title}
          </p>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-5 tracking-tight">
          {post_description}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex gap-3">
          <span className="flex gap-1 items-center">
            <MessageSquareMore className="w-3.5 h-3.5" /> 1
          </span>

          <span className="flex gap-1 items-center">
            <Eye className="w-3.5 h-3.5" /> 1
          </span>

          <span className="ml-auto">
            {DateUtils.dateFormatKR(create_at, "YY. MM. DD")}
          </span>
        </p>
      </div>
      <div className="max-w-[120px]  w-full ml-auto  aspect-[10/10]  rounded-md relative overflow-hidden ">
        {thumbnail_url && (
          <Image
            src={`${ENV.IMAGE_URL}/${thumbnail_url}`}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
    </div>
  );
}
