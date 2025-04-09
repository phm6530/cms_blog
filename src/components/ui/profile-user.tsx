import { cn } from "@/lib/utils";
import { DateUtils } from "@/util/date-uill";
import { BadgeCheck } from "lucide-react";
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
  // const id = Math.floor((Math.random() * 6 ) + 1);
  const img = profileImg || `/img/guestbook/person_4.jpg`;
  return (
    <div className="flex gap-3 items-center ">
      <div
        className={cn(
          "size-10 border-3 border-border rounded-full flex justify-center items-center relative overflow-hidden",
          !profileImg && "grayscale-50"
        )}
      >
        <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
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
              <BadgeCheck className="text-teal-500  shadow-2xl z-1" size={20} />{" "}
              <BadgeCheck
                className="text-teal-500  shadow-2xl z-1 absolute top-[0px] animate-ping"
                size={20}
              />
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
}
