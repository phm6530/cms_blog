import Image from "next/image";
import { PostItemModel } from "../post-list";

export default function PostItem({
  post_title,
  post_description,
  update_at,
  thumbnail_url,
}: PostItemModel) {
  return (
    <div className="group cursor-pointer grid grid-cols-[200px_1fr] gap-8 items-start">
      <div className="w-[200px] h-full  rounded-md relative overflow-hidden border">
        {thumbnail_url && (
          <Image
            src={`https://d33h8icwcso2tj.cloudfront.net/${thumbnail_url}`}
            alt=""
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <div className="flex flex-col gap-1 py-3">
        <p className="group-hover:text-amber-200 text-lg">{post_title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-5">
          {post_description}
        </p>
        <p className="text-xs text-muted-foreground/50 mt-1">{update_at}</p>
      </div>
    </div>
  );
}
