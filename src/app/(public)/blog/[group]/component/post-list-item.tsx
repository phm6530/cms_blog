import Image from "next/image";
import { PostItemModel } from "../post-list";
import Link from "next/link";
import { ENV } from "@/type/constants";
import { Badge } from "@/components/ui/badge";
import { CommandIcon, Eye, MessageSquareMore } from "lucide-react";

export default function PostItem({
  post_title,
  post_id,
  post_description,
  sub_group_name,
  update_at,
  thumbnail_url,
}: PostItemModel) {
  return (
    <div className="group cursor-pointer grid grid-cols-[auto_180px] gap-8 items-start border p-5 rounded-2xl ">
      <div className="flex flex-col gap-2 py-3">
        <div className="flex gap-2">
          <Badge variant={"secondary"} className="text-xs!">
            {sub_group_name}
          </Badge>
          <div className="relative inline-flex items-center justify-center">
            {/* 뒤에 깔릴 ping 효과 */}
            {/* <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75 animate-ping" /> */}

            {/* 실제 Badge 내용 */}
            <Badge variant={"default"} className="relative text-xs">
              New
            </Badge>
          </div>
        </div>
        <Link href={`/blog/${sub_group_name}/${post_id}`}>
          <p className="group-hover:text-amber-200 text-xl">{post_title}</p>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-5">
          {post_description}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1 flex gap-3">
          <span className="flex gap-1 items-center">
            <MessageSquareMore className="w-3.5 h-3.5" /> 1
          </span>

          <span className="flex gap-1 items-center">
            <Eye className="w-3.5 h-3.5" /> 1
          </span>

          <span>{update_at}</span>
        </p>
      </div>
      <div className="w-[180px] h-full rounded-md relative overflow-hidden border ">
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
