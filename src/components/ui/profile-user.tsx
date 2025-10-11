import { cn } from "@/lib/utils";
import { DateUtils } from "@/util/date-uill";
import { UserRound } from "lucide-react";
import Image from "next/image";

export default function ProfileUser({
  createAt,
  profileImg,
  nickname,
  role,
}: {
  profileImg?: string | null;
  nickname: string;
  role: "super" | "admin" | "guest";
  createAt?: string;
}) {
  const img =
    role !== "guest" ? `${profileImg}` : `/img/guestbook/${profileImg}`;

  return (
    <div className="grid grid-cols-[45px_1fr] gap-3 items-center ">
      <div
        className={cn(
          "size-10  rounded-full bg-gray-500/10 flex justify-center items-center relative overflow-hidden",
          profileImg && "border-3 border-border"
        )}
      >
        {!profileImg ? (
          <UserRound />
        ) : (
          <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="col-span-2 flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{nickname} </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {role === "super" || role === "admin" ? (
              <span className="relative ">관리자</span>
            ) : (
              <span>Guest</span>
            )}
          </div>
          {createAt && (
            <span className="text-xs opacity-50 ml-auto">
              {DateUtils.fromNow(createAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
