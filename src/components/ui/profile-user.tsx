import { cn } from "@/lib/utils";
import { DateUtils } from "@/util/date-uill";
import { BadgeCheck, UserRound } from "lucide-react";
import Image from "next/image";

export default function ProfileUser({
  profileImg,
  nickname,
  role,
  createAt,
}: {
  profileImg?: string | null;
  nickname: string;
  role: "super" | "admin" | "guest";
  createAt?: string;
}) {
  const img =
    role !== "guest" ? `${profileImg}` : `/img/guestbook/${profileImg}`;

  return (
    <div className="flex gap-3 items-center ">
      <div
        className={cn(
          "size-10  rounded-full bg-gray-500/10 flex justify-center items-center relative overflow-hidden",
          profileImg && "border-3 border-border"
        )}
      >
        {!profileImg ? (
          <UserRound className="text-secondary-foreground/80" />
        ) : (
          <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
        )}
      </div>
      <div className="flex flex-col">
        <div className="col-span-2 flex items-start gap-2">
          <div className="flex flex-col">
            <span className="text-sm">{nickname} </span>
            {createAt && (
              <span className="text-xs opacity-50">
                {DateUtils.fromNow(createAt)}
              </span>
            )}
          </div>

          {(role === "super" || role === "admin") && (
            <div className="relative ml-1">
              <BadgeCheck
                className="text-indigo-300 shadow-2xl z-1 mt-[1px]"
                size={17}
              />{" "}
              <BadgeCheck
                className="text-cyan-400/50  shadow-2xl z-1 absolute top-[0px] animate-ping"
                size={17}
              />
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
}
