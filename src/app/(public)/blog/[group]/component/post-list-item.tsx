import Image from "next/image";
import { PostItemModel } from "../post-list";
import Link from "next/link";
import { ENV } from "@/type/constants";

export default function PostItem({
  post_title,
  post_id,
  post_description,
  sub_group_name,
  update_at,
  thumbnail_url,
}: PostItemModel) {
  return (
    <div className="group cursor-pointer grid grid-cols-[180px_1fr] gap-8 items-start">
      <div className="w-[180px] h-full  rounded-md relative overflow-hidden border">
        {thumbnail_url && (
          <Image
            src={`${ENV.IMAGE_URL}/${thumbnail_url}`}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 py-3">
        <Link href={`/blog/${sub_group_name}/${post_id}`}>
          <p className="group-hover:text-amber-200 text-lg">{post_title}</p>
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-5">
          {post_description}
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1">{update_at}</p>
      </div>
    </div>
  );
}
